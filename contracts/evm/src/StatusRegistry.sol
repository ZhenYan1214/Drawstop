// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReceiverTemplate} from "./ReceiverTemplate.sol";

/// @title StatusRegistry
/// @notice Stores CRE-signed attestations about UK companies' statutory insolvency notices and registry status.
/// @dev An attestation records facts only: "as of checkedAt, in source S, event E was found / not found /
///      could not be checked". It never asserts solvency or good standing, and "not found" never excludes a
///      petition that has been presented but not yet advertised. Severity is decided by consumers such as
///      LoanFacility.
contract StatusRegistry is ReceiverTemplate {
    // Sources (bit position in unavailableBits)
    uint8 public constant SRC_COMPANIES_HOUSE = 0;
    uint8 public constant SRC_GAZETTE = 1;
    uint8 public constant SRC_GLEIF = 2;

    // Event bits (see DESIGN.md §3)
    uint8 public constant EV_CH_STATUS_ADVERSE = 0; // CH company_status in liquidation/administration/...
    uint8 public constant EV_CH_INSOLVENCY_HISTORY = 1; // CH has_insolvency_history
    uint8 public constant EV_GZ_PETITION_PENDING = 2; // Gazette 2450/2451 with no later 2461/2452 for the same case
    uint8 public constant EV_GZ_INSOLVENCY_PROCEEDING = 3; // Gazette 2452, 2431/2441, 2432/2443/2454, 2410
    uint8 public constant EV_GZ_PETITION_DISMISSED = 4; // Gazette 2461 matched to a petition (informational)
    uint8 public constant EV_GLEIF_LEI_LAPSED = 5; // LEI not renewed; not an insolvency signal
    uint8 public constant EV_SOURCE_CONFLICT = 6; // GLEIF and Companies House disagree
    uint8 public constant EVENT_COUNT = 7;

    struct Entity {
        string companyNumber;
        string lei; // empty when the borrower has no LEI
        bool monitored;
    }

    /// @dev ABI layout of the report produced by the CRE workflow.
    struct Report {
        bytes32 entityId;
        uint64 checkedAt; // when the workflow queried (runtime.now)
        uint64 validUntil; // stale after this time
        uint32 eventBits; // events found in this check
        uint32 unavailableBits; // sources that could not be checked in this check
        uint64 chUpdatedAt; // source's own last-update time, 0 = not published by the source
        uint64 gazetteUpdatedAt; // publication time of the newest confirmed notice, 0 = none
        uint64 gleifUpdatedAt; // LEI record lastUpdateDate, 0 = not checked
        uint64 petitionPresentedAt; // Gazette dateOfPetitionPresentation of the pending petition, 0 = none/unknown
        uint64 petitionPublishedAt; // Gazette publication time of that petition notice, 0 = none
        bytes32 petitionCaseRef; // keccak256 of normalized court case reference, 0 = none
        bytes32 evidenceHash; // keccak256 of the canonical normalized per-source results
        bytes32 requestId; // non-zero when triggered by a drawdown request
    }

    struct Attestation {
        uint256 id; // sequential, 0 = none
        uint64 checkedAt;
        uint64 validUntil;
        uint32 eventBits;
        uint32 unavailableBits;
        uint32 activeBits; // eventBits, carrying forward last known state for unavailable sources
        uint64 chUpdatedAt;
        uint64 gazetteUpdatedAt;
        uint64 gleifUpdatedAt;
        uint64 petitionPresentedAt;
        uint64 petitionPublishedAt;
        bytes32 petitionCaseRef;
        bytes32 evidenceHash;
        bytes32 requestId;
    }

    mapping(bytes32 => Entity) private s_entities;
    bytes32[] private s_entityIds;
    mapping(bytes32 => Attestation) private s_latest;
    /// @notice First checkedAt of the current continuous run in which an event bit was active, 0 if inactive.
    mapping(bytes32 => uint64[7]) private s_firstSeen;
    mapping(address => bool) public isRegistrar;
    uint256 public attestationCount;

    event RegistrarSet(address indexed registrar, bool allowed);
    event EntityRegistered(bytes32 indexed entityId, string companyNumber, string lei);
    event AttestationRecorded(bytes32 indexed entityId, uint256 indexed attestationId, bytes32 indexed requestId, Attestation attestation);

    error NotRegistrar(address caller);
    error UnknownEntity(bytes32 entityId);
    error StaleReport(bytes32 entityId, uint64 checkedAt, uint64 latestCheckedAt);
    error InvalidWindow(uint64 checkedAt, uint64 validUntil);
    error LeiMismatch(bytes32 entityId);

    uint64 public constant MAX_CLOCK_SKEW = 10 minutes; // a report may not claim to be checked in the future
    uint64 public constant MAX_VALIDITY = 7 days; // nor stay valid longer than this

    constructor(address forwarder) ReceiverTemplate(forwarder) {}

    function entityIdFor(string memory companyNumber) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("GB-CH:", companyNumber));
    }

    function setRegistrar(address registrar, bool allowed) external onlyOwner {
        isRegistrar[registrar] = allowed;
        emit RegistrarSet(registrar, allowed);
    }

    /// @notice Adds a company to the monitored set. Called by the owner or an authorized facility. A second facility
    ///         for the same company must bind the same LEI, so the GLEIF cross-check serves both.
    function registerEntity(string calldata companyNumber, string calldata lei) external returns (bytes32 entityId) {
        if (msg.sender != owner() && !isRegistrar[msg.sender]) revert NotRegistrar(msg.sender);
        entityId = entityIdFor(companyNumber);
        Entity storage e = s_entities[entityId];
        if (e.monitored && keccak256(bytes(e.lei)) != keccak256(bytes(lei))) revert LeiMismatch(entityId);
        if (!e.monitored) {
            e.monitored = true;
            e.companyNumber = companyNumber;
            e.lei = lei;
            s_entityIds.push(entityId);
            emit EntityRegistered(entityId, companyNumber, lei);
        }
    }

    function _processReport(bytes calldata report) internal override {
        Report memory r = abi.decode(report, (Report));

        if (!s_entities[r.entityId].monitored) revert UnknownEntity(r.entityId);
        // Bounded window, no future check times, no petition dates after the check: a single bad report must not
        // freeze the entity (later reports would be rejected as out of order) or stay valid indefinitely.
        if (
            r.validUntil <= r.checkedAt || r.validUntil > r.checkedAt + MAX_VALIDITY
                || r.checkedAt > block.timestamp + MAX_CLOCK_SKEW || r.petitionPresentedAt > r.checkedAt
                || r.petitionPublishedAt > r.checkedAt
        ) revert InvalidWindow(r.checkedAt, r.validUntil);
        Attestation storage prev = s_latest[r.entityId];
        // Receivers must discard out-of-order reports.
        if (prev.id != 0 && r.checkedAt <= prev.checkedAt) revert StaleReport(r.entityId, r.checkedAt, prev.checkedAt);

        uint32 activeBits = _updateFirstSeen(r, prev);

        // Petition details are carried forward with their bits: when the Gazette could not be checked, and when it
        // no longer returns them while a petition or proceeding is still active.
        bool gazetteUnavailable = r.unavailableBits & (uint32(1) << SRC_GAZETTE) != 0;
        bool keepPetition = gazetteUnavailable
            || (r.petitionPresentedAt == 0 && r.petitionCaseRef == 0 && activeBits & GAZETTE_ADVERSE != 0);
        Attestation memory a = Attestation({
            id: ++attestationCount,
            checkedAt: r.checkedAt,
            validUntil: r.validUntil,
            eventBits: r.eventBits,
            unavailableBits: r.unavailableBits,
            activeBits: activeBits,
            chUpdatedAt: r.chUpdatedAt,
            gazetteUpdatedAt: gazetteUnavailable ? prev.gazetteUpdatedAt : r.gazetteUpdatedAt,
            gleifUpdatedAt: r.gleifUpdatedAt,
            petitionPresentedAt: keepPetition ? prev.petitionPresentedAt : r.petitionPresentedAt,
            petitionPublishedAt: keepPetition ? prev.petitionPublishedAt : r.petitionPublishedAt,
            petitionCaseRef: keepPetition ? prev.petitionCaseRef : r.petitionCaseRef,
            evidenceHash: r.evidenceHash,
            requestId: r.requestId
        });
        s_latest[r.entityId] = a;
        emit AttestationRecorded(r.entityId, a.id, r.requestId, a);
    }

    uint32 private constant PETITION = uint32(1) << EV_GZ_PETITION_PENDING;
    uint32 private constant PROCEEDING = uint32(1) << EV_GZ_INSOLVENCY_PROCEEDING;
    uint32 private constant DISMISSED = uint32(1) << EV_GZ_PETITION_DISMISSED;
    uint32 private constant GAZETTE_ADVERSE = PETITION | PROCEEDING;

    /// @dev Active bits and the start of each bit's current occurrence.
    ///      - Outage: a source that could not be checked keeps its last known bits. An outage never erases a known
    ///        adverse event, and never creates one.
    ///      - Absence is not resolution: a known petition clears only on a matched dismissal (2461) or when a
    ///        proceeding supersedes it; a known proceeding never clears on its own (human review covers it). A notice
    ///        that drops out of a search result therefore cannot reopen drawdowns or release suspense.
    ///      - New occurrence: a petition with a different court case or presentation date, or a newer Gazette notice
    ///        while a proceeding is active, restarts firstSeen, so a review of the earlier one does not cover it.
    function _updateFirstSeen(Report memory r, Attestation storage prev) private returns (uint32 activeBits) {
        uint64[7] storage firstSeen = s_firstSeen[r.entityId];
        bool gazetteChecked = r.unavailableBits & (uint32(1) << SRC_GAZETTE) == 0;
        bool newPetition = gazetteChecked && (r.petitionCaseRef != 0 || r.petitionPresentedAt != 0)
            && (r.petitionCaseRef != prev.petitionCaseRef || r.petitionPresentedAt != prev.petitionPresentedAt);
        bool newNotice = gazetteChecked && prev.gazetteUpdatedAt != 0 && r.gazetteUpdatedAt > prev.gazetteUpdatedAt;
        for (uint8 bit = 0; bit < EVENT_COUNT; bit++) {
            uint32 mask = uint32(1) << bit;
            bool wasActive = prev.activeBits & mask != 0;
            bool active = r.unavailableBits & (uint32(1) << sourceOf(bit)) != 0 ? wasActive : r.eventBits & mask != 0;
            if (!active && wasActive) {
                if (mask == PROCEEDING) active = true;
                else if (mask == PETITION) active = r.eventBits & (DISMISSED | PROCEEDING) == 0;
            }
            if (active) {
                activeBits |= mask;
                bool restart = (mask == PETITION && newPetition) || (mask == PROCEEDING && newNotice);
                if (firstSeen[bit] == 0 || restart) firstSeen[bit] = r.checkedAt;
            } else {
                firstSeen[bit] = 0;
            }
        }
    }

    function sourceOf(uint8 eventBit) public pure returns (uint8) {
        if (eventBit <= EV_CH_INSOLVENCY_HISTORY) return SRC_COMPANIES_HOUSE;
        if (eventBit <= EV_GZ_PETITION_DISMISSED) return SRC_GAZETTE;
        return SRC_GLEIF;
    }

    function getLatest(bytes32 entityId) external view returns (Attestation memory) {
        return s_latest[entityId];
    }

    /// @notice firstSeen per event bit (dynamic array for binding-friendly ABI; always EVENT_COUNT long).
    function getFirstSeen(bytes32 entityId) external view returns (uint64[] memory firstSeen) {
        firstSeen = new uint64[](EVENT_COUNT);
        for (uint8 bit = 0; bit < EVENT_COUNT; bit++) {
            firstSeen[bit] = s_firstSeen[entityId][bit];
        }
    }

    function getEntity(bytes32 entityId) external view returns (Entity memory) {
        return s_entities[entityId];
    }

    /// @notice Monitored entities, used by the cron workflow (EVM read).
    function getMonitored() external view returns (bytes32[] memory ids, string[] memory companyNumbers, string[] memory leis) {
        uint256 n = s_entityIds.length;
        ids = new bytes32[](n);
        companyNumbers = new string[](n);
        leis = new string[](n);
        for (uint256 i = 0; i < n; i++) {
            Entity storage e = s_entities[s_entityIds[i]];
            ids[i] = s_entityIds[i];
            companyNumbers[i] = e.companyNumber;
            leis[i] = e.lei;
        }
    }
}
