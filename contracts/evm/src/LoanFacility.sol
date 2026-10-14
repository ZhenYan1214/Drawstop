// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StatusRegistry} from "./StatusRegistry.sol";

interface IERC20Minimal {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// @title LoanFacility
/// @notice Bilateral testnet credit facility for a known, lender-verified UK borrower, modelled on LMA-style terms:
///         - drawstop (cf. LMA cl. 4.2): no new drawdown while an insolvency event is known or the evidence is stale;
///         - petition carve-out (cf. LMA cl. 23.7): a winding-up petition gets the agreement's grace window, counted
///           from the agreed anchor (presentation / publication / detection);
///         - Insolvency Act 1986 s.127: repayments received while a petition is pending are held in suspense instead
///           of being passed on, because they are void if a winding-up order follows.
///         Default, acceleration and enforcement are never automatic.
/// @dev The borrower <-> company binding is acknowledged by both parties (borrower EIP-712 signature + lender tx).
///      It is NOT an independent identity proof: the lender is trusted to have completed KYB off-chain.
contract LoanFacility {
    enum Status {
        UNBOUND, // binding not confirmed by both parties
        STALE, // no attestation, or latest attestation expired -> re-check required
        UNVERIFIED, // a required source could not be checked -> re-check required, not an adverse finding
        PETITION_PENDING, // winding-up petition advertised, agreement's grace window still running
        REVIEW_REQUIRED, // insolvency proceeding, or petition past its grace window: human decision required
        WATCH, // watch-only signal (LEI lapsed, insolvency history, source conflict); drawdowns allowed
        NORMAL,
        DEFAULTED
    }

    /// @notice From when the petition grace window is counted.
    enum ClockAnchor {
        PRESENTATION, // date the petition was presented (LMA "commencement")
        PUBLICATION, // date the petition was advertised in The Gazette
        DETECTION // first attestation that found it
    }

    struct Drawdown {
        uint256 amount;
        uint64 requestedAt;
        bool executed;
    }

    struct Repayment {
        uint256 amount;
        uint64 at;
        bool heldInSuspense; // received while an insolvency event was known (s.127 risk)
    }

    struct Review {
        address reviewer;
        uint32 coveredBits;
        uint256 attestationId; // attestation the reviewer looked at (audit trail)
        bytes32 reasonHash; // hash of the off-chain written reason
        uint64 createdAt;
        uint64 expiresAt;
    }

    uint32 public constant HARD_MASK = (1 << 0) | (1 << 3); // CH status adverse, Gazette insolvency proceeding
    uint32 public constant PETITION_MASK = 1 << 2; // Gazette petition pending
    uint32 public constant WATCH_MASK = (1 << 1) | (1 << 5) | (1 << 6); // insolvency history, LEI lapsed, conflict
    uint32 public constant REQUIRED_SOURCES = (1 << 0) | (1 << 1); // Companies House + Gazette; GLEIF is cross-check only

    bytes32 private constant DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 public constant BINDING_TYPEHASH =
        keccak256("Binding(address borrower,string lei,string companyNumber,uint256 nonce,uint256 deadline)");
    uint256 private constant SECP256K1_HALF_N = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0;

    StatusRegistry public immutable registry;
    IERC20Minimal public immutable token;
    address public immutable lender;
    address public immutable borrower;
    address public immutable arbiter;
    uint64 public immutable petitionGracePeriod;
    ClockAnchor public immutable clockAnchor;
    bytes32 public immutable entityId;
    string public companyNumber;
    string public lei;

    bool public bound;
    bool public defaulted;
    uint256 public bindingNonce;
    uint256 public suspenseBalance;
    Drawdown[] public drawdowns;
    Repayment[] public repayments;
    Review[] public reviews;

    event Bound(address indexed borrower, bytes32 indexed entityId, string companyNumber, string lei, uint256 nonce);
    event DrawdownRequested(
        uint256 indexed drawdownId, bytes32 indexed requestId, bytes32 indexed entityId, string companyNumber, string lei, uint256 amount
    );
    event DrawdownExecuted(uint256 indexed drawdownId, uint256 attestationId, uint256 amount);
    event Repaid(uint256 indexed repaymentId, uint256 amount, bool heldInSuspense, Status status);
    event SuspenseReleased(address indexed to, uint256 amount, bytes32 reasonHash, address by);
    event Acknowledged(address indexed by, uint256 indexed attestationId, bytes32 noteHash);
    event ReviewRecorded(
        uint256 indexed reviewId, address indexed reviewer, uint32 coveredBits, uint256 attestationId, bytes32 reasonHash, uint64 expiresAt
    );
    event DefaultDeclared(address indexed lender, uint256 attestationId, uint64 at);

    error OnlyLender();
    error OnlyBorrower();
    error OnlyArbiter();
    error OnlyParty();
    error AlreadyBound();
    error NotBound();
    error BindingExpired();
    error BadNonce(uint256 expected, uint256 got);
    error BadSignature();
    error NoSuchDrawdown(uint256 drawdownId);
    error AlreadyExecuted(uint256 drawdownId);
    error AttestationNotFresh(uint64 checkedAt, uint64 requestedAt);
    error DrawdownsBlocked(Status status);
    error InvalidReview();
    error DefaultNotAllowed(Status status);
    error SuspenseNotReleasable(Status status);
    error NothingInSuspense();
    error TransferFailed();

    constructor(
        StatusRegistry registry_,
        IERC20Minimal token_,
        address lender_,
        address borrower_,
        address arbiter_,
        string memory companyNumber_,
        string memory lei_,
        uint64 petitionGracePeriod_,
        ClockAnchor clockAnchor_
    ) {
        registry = registry_;
        token = token_;
        lender = lender_;
        borrower = borrower_;
        arbiter = arbiter_;
        companyNumber = companyNumber_;
        lei = lei_;
        petitionGracePeriod = petitionGracePeriod_;
        clockAnchor = clockAnchor_;
        entityId = registry_.entityIdFor(companyNumber_);
    }

    // ---------------------------------------------------------------------
    // Binding
    // ---------------------------------------------------------------------

    function domainSeparator() public view returns (bytes32) {
        return keccak256(
            abi.encode(DOMAIN_TYPEHASH, keccak256("CounterpartyStatusMonitor"), keccak256("1"), block.chainid, address(this))
        );
    }

    function bindingDigest(uint256 nonce, uint256 deadline) public view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                BINDING_TYPEHASH, borrower, keccak256(bytes(lei)), keccak256(bytes(companyNumber)), nonce, deadline
            )
        );
        return keccak256(abi.encodePacked("\x19\x01", domainSeparator(), structHash));
    }

    /// @notice Lender confirms the binding with the borrower's EIP-712 signature. The lender's transaction is the
    ///         lender's acknowledgement; the signature is the borrower's.
    function bind(uint256 nonce, uint256 deadline, bytes calldata borrowerSignature) external {
        if (msg.sender != lender) revert OnlyLender();
        if (bound) revert AlreadyBound();
        if (block.timestamp > deadline) revert BindingExpired();
        if (nonce != bindingNonce) revert BadNonce(bindingNonce, nonce);
        if (_recover(bindingDigest(nonce, deadline), borrowerSignature) != borrower) revert BadSignature();

        bindingNonce = nonce + 1;
        bound = true;
        registry.registerEntity(companyNumber, lei);
        emit Bound(borrower, entityId, companyNumber, lei, nonce);
    }

    // ---------------------------------------------------------------------
    // Drawdowns (drawstop)
    // ---------------------------------------------------------------------

    function requestId(uint256 drawdownId) public view returns (bytes32) {
        return keccak256(abi.encode(address(this), drawdownId));
    }

    /// @notice Emits DrawdownRequested, which triggers a fresh CRE check (EVM log trigger).
    function requestDrawdown(uint256 amount) external returns (uint256 drawdownId) {
        if (msg.sender != borrower) revert OnlyBorrower();
        if (!bound) revert NotBound();
        drawdownId = drawdowns.length;
        drawdowns.push(Drawdown({amount: amount, requestedAt: uint64(block.timestamp), executed: false}));
        emit DrawdownRequested(drawdownId, requestId(drawdownId), entityId, companyNumber, lei, amount);
    }

    /// @notice Releases funds once an attestation made after the request allows it. Callable by anyone.
    function executeDrawdown(uint256 drawdownId) external {
        if (drawdownId >= drawdowns.length) revert NoSuchDrawdown(drawdownId);
        Drawdown storage d = drawdowns[drawdownId];
        if (d.executed) revert AlreadyExecuted(drawdownId);

        StatusRegistry.Attestation memory a = registry.getLatest(entityId);
        if (a.checkedAt < d.requestedAt) revert AttestationNotFresh(a.checkedAt, d.requestedAt);
        Status s = status();
        if (s != Status.NORMAL && s != Status.WATCH) revert DrawdownsBlocked(s);

        d.executed = true;
        if (!token.transfer(borrower, d.amount)) revert TransferFailed();
        emit DrawdownExecuted(drawdownId, a.id, d.amount);
    }

    // ---------------------------------------------------------------------
    // Repayments (s.127 suspense)
    // ---------------------------------------------------------------------

    /// @notice Repayments are always accepted. While a petition or insolvency proceeding is known, they are held in
    ///         suspense rather than passed to the lender, because a later winding-up order would make them void.
    function repay(uint256 amount) external returns (uint256 repaymentId) {
        if (msg.sender != borrower) revert OnlyBorrower();
        Status s = status();
        bool atRisk = _insolvencyEventKnown();
        repaymentId = repayments.length;
        repayments.push(Repayment({amount: amount, at: uint64(block.timestamp), heldInSuspense: atRisk}));
        if (!token.transferFrom(borrower, address(this), amount)) revert TransferFailed();
        if (atRisk) {
            suspenseBalance += amount;
        } else if (!token.transfer(lender, amount)) {
            revert TransferFailed();
        }
        emit Repaid(repaymentId, amount, atRisk, s);
    }

    /// @notice Once fresh evidence shows no petition or proceeding (e.g. after a 2461 dismissal), suspense goes to the
    ///         lender. Callable by anyone.
    function releaseSuspense() external {
        Status s = status();
        // A review may let drawdowns resume, but it cannot remove the legal s.127 risk of a live petition.
        if ((s != Status.NORMAL && s != Status.WATCH) || _insolvencyEventKnown()) revert SuspenseNotReleasable(s);
        _payOutSuspense(lender, bytes32(0));
    }

    /// @notice Human resolution of suspense, e.g. return to the liquidator after a winding-up order, or release to
    ///         the lender under a court validation order. Requires a written reason.
    function resolveSuspense(address to, bytes32 reasonHash) external {
        if (msg.sender != arbiter) revert OnlyArbiter();
        if (reasonHash == bytes32(0)) revert InvalidReview();
        _payOutSuspense(to, reasonHash);
    }

    /// @notice Sum of repayments already passed to the lender at or after `since` (e.g. the petition presentation
    ///         date). These may be void under s.127 if a winding-up order follows.
    function repaidToLenderSince(uint64 since) public view returns (uint256 total) {
        for (uint256 i = 0; i < repayments.length; i++) {
            if (!repayments[i].heldInSuspense && repayments[i].at >= since) total += repayments[i].amount;
        }
    }

    /// @notice Convenience view: repayments passed to the lender since the pending petition was presented.
    function repaidSincePetitionPresented() external view returns (uint256) {
        uint64 presentedAt = registry.getLatest(entityId).petitionPresentedAt;
        return presentedAt == 0 ? 0 : repaidToLenderSince(presentedAt);
    }

    // ---------------------------------------------------------------------
    // Human acknowledgement, review and default
    // ---------------------------------------------------------------------

    /// @notice Records that a party became aware of an attestation (cf. Torre v RBS: an agent's duty to notify
    ///         lenders arises on actual knowledge).
    function acknowledge(uint256 attestationId, bytes32 noteHash) external {
        if (msg.sender != lender && msg.sender != arbiter) revert OnlyParty();
        emit Acknowledged(msg.sender, attestationId, noteHash);
    }

    /// @notice Records an arbiter review. Never edits the attestation; neutralizes only `coveredBits` occurrences
    ///         that already existed at review time, and only until `expiresAt`.
    function recordReview(uint32 coveredBits, uint256 attestationId, bytes32 reasonHash, uint64 expiresAt)
        external
        returns (uint256 reviewId)
    {
        if (msg.sender != arbiter) revert OnlyArbiter();
        if (coveredBits == 0 || expiresAt <= block.timestamp || reasonHash == bytes32(0)) revert InvalidReview();
        reviewId = reviews.length;
        reviews.push(
            Review({
                reviewer: msg.sender,
                coveredBits: coveredBits,
                attestationId: attestationId,
                reasonHash: reasonHash,
                createdAt: uint64(block.timestamp),
                expiresAt: expiresAt
            })
        );
        emit ReviewRecorded(reviewId, msg.sender, coveredBits, attestationId, reasonHash, expiresAt);
    }

    /// @notice Lender may declare default only in REVIEW_REQUIRED, on fresh evidence. Moves no funds.
    function declareDefault() external {
        if (msg.sender != lender) revert OnlyLender();
        Status s = status();
        if (s != Status.REVIEW_REQUIRED) revert DefaultNotAllowed(s);
        defaulted = true;
        emit DefaultDeclared(msg.sender, registry.getLatest(entityId).id, uint64(block.timestamp));
    }

    // ---------------------------------------------------------------------
    // Status (pure function of latest attestation, time, agreement terms and reviews)
    // ---------------------------------------------------------------------

    function status() public view returns (Status) {
        if (defaulted) return Status.DEFAULTED;
        if (!bound) return Status.UNBOUND;

        StatusRegistry.Attestation memory a = registry.getLatest(entityId);
        if (a.id == 0 || block.timestamp > a.validUntil) return Status.STALE;

        uint64[] memory firstSeen = registry.getFirstSeen(entityId);
        uint32 uncovered = a.activeBits & ~coveredBits(firstSeen);

        // Winding-up order, resolution, liquidator/administrator appointment, or adverse CH status: no grace.
        if (uncovered & HARD_MASK != 0) return Status.REVIEW_REQUIRED;
        if (uncovered & PETITION_MASK != 0) {
            return block.timestamp < uint256(graceStart(a, firstSeen)) + petitionGracePeriod
                ? Status.PETITION_PENDING
                : Status.REVIEW_REQUIRED;
        }
        if (a.unavailableBits & REQUIRED_SOURCES != 0) return Status.UNVERIFIED;
        if (uncovered & WATCH_MASK != 0) return Status.WATCH;
        return Status.NORMAL;
    }

    /// @notice Start of the petition grace window per the agreed anchor; falls back to the next later known time.
    function graceStart(StatusRegistry.Attestation memory a, uint64[] memory firstSeen) public view returns (uint64) {
        uint64 detected = firstSeen[2];
        if (clockAnchor == ClockAnchor.PRESENTATION && a.petitionPresentedAt != 0) return a.petitionPresentedAt;
        if (clockAnchor != ClockAnchor.DETECTION && a.petitionPublishedAt != 0) return a.petitionPublishedAt;
        return detected;
    }

    /// @notice Bits neutralized by active reviews. A review covers an occurrence only if it began before the
    ///         review was recorded; a new occurrence of the same event is not covered.
    function coveredBits(uint64[] memory firstSeen) public view returns (uint32 covered) {
        for (uint256 i = 0; i < reviews.length; i++) {
            Review memory r = reviews[i];
            if (block.timestamp >= r.expiresAt) continue;
            for (uint8 bit = 0; bit < 7; bit++) {
                uint32 mask = uint32(1) << bit;
                if (r.coveredBits & mask != 0 && firstSeen[bit] != 0 && firstSeen[bit] <= r.createdAt) covered |= mask;
            }
        }
    }

    function drawdownCount() external view returns (uint256) {
        return drawdowns.length;
    }

    function repaymentCount() external view returns (uint256) {
        return repayments.length;
    }

    function reviewCount() external view returns (uint256) {
        return reviews.length;
    }

    /// @dev Known petition or proceeding in the latest attestation, regardless of reviews (s.127 risk is legal,
    ///      not a matter of the parties' tolerance).
    function _insolvencyEventKnown() private view returns (bool) {
        return registry.getLatest(entityId).activeBits & (HARD_MASK | PETITION_MASK) != 0;
    }

    function _payOutSuspense(address to, bytes32 reasonHash) private {
        uint256 amount = suspenseBalance;
        if (amount == 0) revert NothingInSuspense();
        suspenseBalance = 0;
        if (!token.transfer(to, amount)) revert TransferFailed();
        emit SuspenseReleased(to, amount, reasonHash, msg.sender);
    }

    function _recover(bytes32 digest, bytes calldata sig) private pure returns (address signer) {
        if (sig.length != 65) revert BadSignature();
        bytes32 r = bytes32(sig[0:32]);
        bytes32 s = bytes32(sig[32:64]);
        uint8 v = uint8(sig[64]);
        if (uint256(s) > SECP256K1_HALF_N || (v != 27 && v != 28)) revert BadSignature();
        signer = ecrecover(digest, v, r, s);
        if (signer == address(0)) revert BadSignature();
    }
}
