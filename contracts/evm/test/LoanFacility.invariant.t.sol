// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StatusRegistry} from "../src/StatusRegistry.sol";
import {LoanFacility, IERC20Minimal} from "../src/LoanFacility.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

// Invariant (stateful) fuzzing: Foundry calls the Handler's actions in random order with random inputs, playing
// borrower, lender, arbiter, the CRE forwarder and an outsider, and checks the invariants below after every call.
// This is a tool-based outside judge for the properties the unit tests assert one scenario at a time.

interface Vm {
    function prank(address msgSender) external;
    function warp(uint256 newTimestamp) external;
    function addr(uint256 privateKey) external pure returns (address);
    function sign(uint256 privateKey, bytes32 digest) external pure returns (uint8 v, bytes32 r, bytes32 s);
}

contract Handler {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    uint32 private constant HARD = (1 << 0) | (1 << 3);
    uint32 private constant PETITION = 1 << 2;

    StatusRegistry public immutable registry;
    LoanFacility public immutable facility;
    MockUSDC public immutable usdc;
    address public immutable forwarder;
    address public immutable lender;
    address public immutable borrower;
    address public immutable arbiter;
    address public constant OUTSIDER = address(0xBAD);
    address public constant OFFICE_HOLDER = address(0x0FF1CE);

    uint256 public now_; // via-ir may cache block.timestamp; track time in storage
    uint64 public lastCheckedAt;
    uint256 public drawdownCount; // the facility exposes no count getter (contract size)

    // Ghost accounting and violation log
    uint256 public suspenseIn;
    uint256 public suspenseOut;
    uint256 public violations;
    string public lastViolation;
    mapping(bytes32 => uint256) public calls;

    // Every accepted review, for the reference model in the test contract
    struct ReviewLog {
        uint32 bits;
        uint64 asOf;
        uint64 expiresAt;
    }
    ReviewLog[] public reviewLog;

    function reviewCount() external view returns (uint256) {
        return reviewLog.length;
    }

    constructor(StatusRegistry r, LoanFacility f, MockUSDC u, address fwd, address l, address b, address a) {
        registry = r;
        facility = f;
        usdc = u;
        forwarder = fwd;
        lender = l;
        borrower = b;
        arbiter = a;
        now_ = block.timestamp;
    }

    // ─── helpers ────────────────────────────────────────────────────────

    function _flag(string memory why) private {
        violations++;
        lastViolation = why;
    }

    function _known() private view returns (bool) {
        return registry.getLatest(facility.entityId()).activeBits & (HARD | PETITION) != 0;
    }

    function _statusIs(LoanFacility.Status a, LoanFacility.Status b) private pure returns (bool) {
        return a == b;
    }

    // ─── actions ────────────────────────────────────────────────────────

    function warp(uint32 secs) external {
        now_ += uint256(secs) % 3 days;
        vm.warp(now_);
        calls["warp"]++;
    }

    /// CRE report with random findings. Petition dates are optional and never after the check time.
    function attest(uint32 eventBits, uint32 unavailableBits, uint16 presentedAgoHours, uint16 publishedAgoHours, uint16 validHours, bool withPetition)
        external
    {
        uint64 checkedAt = uint64(now_);
        if (checkedAt <= lastCheckedAt) {
            now_ = uint256(lastCheckedAt) + 1;
            vm.warp(now_);
            checkedAt = uint64(now_);
        }
        uint64 presented = withPetition ? checkedAt - uint64(presentedAgoHours % 2000) * 1 hours : 0;
        uint64 published = withPetition ? checkedAt - uint64(publishedAgoHours % 1000) * 1 hours : 0;
        if (published < presented) published = presented;
        StatusRegistry.Report memory r = StatusRegistry.Report({
            entityId: facility.entityId(),
            checkedAt: checkedAt,
            validUntil: checkedAt + 1 + uint64(validHours % 168) * 1 hours,
            eventBits: eventBits & 0x7f,
            unavailableBits: unavailableBits & 0x7,
            chUpdatedAt: 0,
            gazetteUpdatedAt: published,
            gleifUpdatedAt: 0,
            petitionPresentedAt: presented,
            petitionPublishedAt: published,
            petitionCaseRef: withPetition ? keccak256(abi.encode(presented)) : bytes32(0),
            evidenceHash: keccak256(abi.encode(eventBits, checkedAt)),
            requestId: bytes32(0)
        });
        bytes memory report = abi.encode(r);
        vm.prank(forwarder);
        try registry.onReport("", report) {
            lastCheckedAt = checkedAt;
            calls["attest"]++;
        } catch {}
    }

    function requestDrawdown(uint96 amount) external {
        vm.prank(borrower);
        try facility.requestDrawdown(uint256(amount) % 300_000e6) returns (uint256 id) {
            drawdownCount = id + 1;
            calls["request"]++;
        } catch {}
    }

    function executeDrawdown(uint8 id, bool asOutsider) external {
        uint256 count = drawdownCount;
        if (count == 0) return;
        LoanFacility.Status before = facility.status();
        uint256 suspenseBefore = facility.suspenseBalance();
        if (asOutsider) vm.prank(OUTSIDER);
        try facility.executeDrawdown(uint256(id) % count) {
            calls["execute"]++;
            if (!_statusIs(before, LoanFacility.Status.NORMAL) && !_statusIs(before, LoanFacility.Status.WATCH)) {
                _flag("drawdown executed outside NORMAL/WATCH");
            }
            if (facility.suspenseBalance() != suspenseBefore) _flag("drawdown changed suspense");
        } catch {}
    }

    function repay(uint96 amount) external {
        bool known = _known();
        uint256 suspenseBefore = facility.suspenseBalance();
        uint256 a = uint256(amount) % 50_000e6;
        vm.prank(borrower);
        try facility.repay(a) {
            calls["repay"]++;
            uint256 delta = facility.suspenseBalance() - suspenseBefore;
            if (known && delta != a) _flag("repayment during insolvency event not held in suspense");
            if (!known && delta != 0) _flag("ordinary repayment held in suspense");
            suspenseIn += delta;
        } catch {}
    }

    function releaseSuspense() external {
        bool known = _known();
        uint256 s = facility.suspenseBalance();
        uint256 lenderBefore = usdc.balanceOf(lender);
        vm.prank(OUTSIDER);
        try facility.releaseSuspense() {
            calls["release"]++;
            if (known) _flag("suspense released while petition or proceeding known");
            if (usdc.balanceOf(lender) != lenderBefore + s) _flag("release did not pay the lender exactly");
            suspenseOut += s;
        } catch {}
    }

    function resolveSuspense(uint8 pick, bool asArbiter) external {
        address[4] memory who = [lender, borrower, OFFICE_HOLDER, OUTSIDER];
        address to = who[pick % 4];
        bool officeHolderOk = to == OFFICE_HOLDER && facility.officeHolder() == OFFICE_HOLDER
            && block.timestamp >= facility.officeHolderFrom() && _known();
        uint256 s = facility.suspenseBalance();
        vm.prank(asArbiter ? arbiter : lender);
        try facility.resolveSuspense(to, keccak256("reason")) {
            calls["resolve"]++;
            if (!asArbiter) _flag("non-arbiter resolved suspense");
            if (to != lender && to != borrower && !officeHolderOk) _flag("suspense paid to unauthorised recipient");
            suspenseOut += s;
        } catch {}
    }

    function nominateOfficeHolder() external {
        vm.prank(arbiter);
        try facility.nominateOfficeHolder(OFFICE_HOLDER, keccak256("winding-up order")) {
            calls["nominate"]++;
        } catch {}
    }

    function recordReview(uint32 bits, uint32 expiresIn) external {
        StatusRegistry.Attestation memory a = registry.getLatest(facility.entityId());
        // Cover a subset of what the latest attestation shows, so reviews (and the paths they unlock) are reachable.
        uint32 covered = bits & a.activeBits;
        if (covered == 0) covered = a.activeBits;
        uint64 expiresAt = uint64(now_ + 1 + uint256(expiresIn) % 30 days);
        vm.prank(arbiter);
        try facility.recordReview(covered, a.id, keccak256("review"), expiresAt) {
            reviewLog.push(ReviewLog({bits: covered, asOf: a.checkedAt, expiresAt: expiresAt}));
            calls["review"]++;
        } catch {}
    }

    function declareDefault() external {
        LoanFacility.Status before = facility.status();
        vm.prank(lender);
        try facility.declareDefault() {
            calls["default"]++;
            if (!_statusIs(before, LoanFacility.Status.REVIEW_REQUIRED)) _flag("default declared outside REVIEW_REQUIRED");
        } catch {}
    }

    function cancelUndrawn(bool byLender) external {
        bool allowed = !byLender || facility.defaulted();
        uint256 s = facility.suspenseBalance();
        vm.prank(byLender ? lender : borrower);
        try facility.cancelUndrawn() {
            calls["cancel"]++;
            if (!allowed) _flag("lender cancelled without default");
            if (facility.suspenseBalance() != s) _flag("cancellation touched suspense");
        } catch {}
    }

    /// Someone sends tokens straight to the facility (not a repayment): must not be mistaken for suspense.
    function donate(uint96 amount) external {
        uint256 a = uint256(amount) % 10_000e6;
        if (usdc.balanceOf(OUTSIDER) < a) return;
        vm.prank(OUTSIDER);
        usdc.transfer(address(facility), a);
        calls["donate"]++;
    }
}

contract LoanFacilityInvariantTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    address private constant FORWARDER = address(0xF0);
    address private constant LENDER = address(0x1E);
    address private constant ARBITER = address(0xA4);
    uint256 private constant BORROWER_PK = 0xB0B;

    StatusRegistry private registry;
    MockUSDC private usdc;
    LoanFacility private facility;
    Handler private handler;
    address private borrower;

    function setUp() public {
        vm.warp(1_790_000_000);
        borrower = vm.addr(BORROWER_PK);
        registry = new StatusRegistry(FORWARDER);
        usdc = new MockUSDC();
        facility = new LoanFacility(
            registry, IERC20Minimal(address(usdc)), LENDER, borrower, ARBITER, "DM000001", "", 30 days,
            LoanFacility.CarveOutWindow.PRESENTATION
        );
        registry.setRegistrar(address(facility), true);
        usdc.mint(address(facility), 1_000_000e6);
        usdc.mint(borrower, 1_000_000e6);
        usdc.mint(address(0xBAD), 100_000e6);
        vm.prank(borrower);
        usdc.approve(address(facility), type(uint256).max);

        uint256 deadline = block.timestamp + 1 hours;
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(BORROWER_PK, facility.bindingDigest(0, deadline));
        vm.prank(LENDER);
        facility.bind(0, deadline, abi.encodePacked(r, s, v));

        handler = new Handler(registry, facility, usdc, FORWARDER, LENDER, borrower, ARBITER);
    }

    /// Foundry calls only the Handler's functions.
    function targetContracts() public view returns (address[] memory targets) {
        targets = new address[](1);
        targets[0] = address(handler);
    }

    function invariant_suspenseIsAlwaysBacked() public view {
        require(usdc.balanceOf(address(facility)) >= facility.suspenseBalance(), "suspense not backed by tokens");
    }

    function invariant_tokensAreConserved() public view {
        uint256 sum = usdc.balanceOf(address(facility)) + usdc.balanceOf(LENDER) + usdc.balanceOf(borrower)
            + usdc.balanceOf(ARBITER) + usdc.balanceOf(address(0xBAD)) + usdc.balanceOf(address(0x0FF1CE));
        require(sum == usdc.totalSupply(), "tokens created or lost");
    }

    function invariant_suspenseLedgerBalances() public view {
        require(handler.suspenseIn() - handler.suspenseOut() == facility.suspenseBalance(), "suspense ledger mismatch");
    }

    /// Reference model, written independently of LoanFacility: a petition or proceeding blocks drawdowns unless an
    /// unexpired review covers that event bit AND the occurrence had begun by the attestation the reviewer saw.
    function invariant_adverseEventsAreNeverSilentlyCovered() public view {
        StatusRegistry.Attestation memory a = registry.getLatest(facility.entityId());
        if (a.id == 0 || block.timestamp > a.validUntil) return; // STALE blocks anyway
        uint64[] memory firstSeen = registry.getFirstSeen(facility.entityId());
        uint32[3] memory adverse = [uint32(1) << 0, uint32(1) << 2, uint32(1) << 3];
        bool uncoveredAdverse;
        for (uint256 k = 0; k < 3; k++) {
            uint32 bit = adverse[k];
            if (a.activeBits & bit == 0) continue;
            uint8 idx = k == 0 ? 0 : (k == 1 ? 2 : 3);
            bool covered;
            for (uint256 i = 0; i < handler.reviewCount(); i++) {
                (uint32 bits, uint64 asOf, uint64 expiresAt) = handler.reviewLog(i);
                if (bits & bit != 0 && block.timestamp < expiresAt && firstSeen[idx] != 0 && firstSeen[idx] <= asOf) {
                    covered = true;
                }
            }
            if (!covered) uncoveredAdverse = true;
        }
        if (uncoveredAdverse) {
            LoanFacility.Status s = facility.status();
            require(
                s != LoanFacility.Status.NORMAL && s != LoanFacility.Status.WATCH && s != LoanFacility.Status.UNVERIFIED,
                "drawdowns allowed while an uncovered petition or proceeding is active"
            );
        }
    }

    function invariant_noForbiddenActionSucceeded() public view {
        require(handler.violations() == 0, handler.lastViolation());
    }
}
