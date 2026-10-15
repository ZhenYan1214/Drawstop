// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StatusRegistry} from "../src/StatusRegistry.sol";
import {LoanFacility, IERC20Minimal} from "../src/LoanFacility.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {ReceiverTemplate} from "../src/ReceiverTemplate.sol";

interface Vm {
    function prank(address msgSender) external;
    function warp(uint256 newTimestamp) external;
    function addr(uint256 privateKey) external pure returns (address);
    function sign(uint256 privateKey, bytes32 digest) external pure returns (uint8 v, bytes32 r, bytes32 s);
    function expectRevert() external;
    function expectRevert(bytes4 revertData) external;
    function expectRevert(bytes calldata revertData) external;
}

contract LoanFacilityTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    address private constant FORWARDER = address(0xF0);
    address private constant LENDER = address(0x1E);
    address private constant ARBITER = address(0xA4);
    uint256 private constant BORROWER_PK = 0xB0B;
    uint64 private constant GRACE = 30 days;
    uint64 private constant MAX_AGE = 1 days;
    string private constant CH = "11877818";
    string private constant LEI = "";

    // Real public timeline, AMS FACILITIES (SW) LTD (Gazette notices 5219886 / 5229442)
    uint64 private constant PRESENTED = 1786406400; // 2026-08-11 00:00 UTC, petition presented by HMRC
    uint64 private constant PUBLISHED = 1790674208; // 2026-09-29 09:30:08 UTC, 2450 advertised in The Gazette
    uint64 private constant ORDER_PUBLISHED = 1791986414; // 2026-10-14 14:00:14 UTC, 2452 winding-up order notice
    // Hypothetical petition advertised 12 days after presentation, so a 30-day window is still open when it is seen
    uint64 private constant FRESH_PRESENTED = PUBLISHED - 12 days;

    uint32 private constant CH_ADVERSE = 1 << 0;
    uint32 private constant PETITION = 1 << 2;
    uint32 private constant PROCEEDING = 1 << 3;
    uint32 private constant DISMISSED = 1 << 4;
    uint32 private constant LEI_LAPSED = 1 << 5;
    uint32 private constant CONFLICT = 1 << 6;
    uint32 private constant SRC_CH = 1 << 0;
    uint32 private constant SRC_GAZETTE = 1 << 1;
    uint32 private constant SRC_GLEIF = 1 << 2;

    StatusRegistry private registry;
    MockUSDC private usdc;
    LoanFacility private facility;
    address private borrower;
    uint256 private t; // current test time; see _warp

    function setUp() public {
        _warp(PRESENTED - 30 days);
        borrower = vm.addr(BORROWER_PK);
        registry = new StatusRegistry(FORWARDER);
        usdc = new MockUSDC();
        facility = _newFacility(LoanFacility.CarveOutWindow.PRESENTATION);
        usdc.mint(address(facility), 1_000_000e6);
        usdc.mint(borrower, 1_000_000e6);
    }

    // ------------------------------------------------------------------ helpers

    /// via-ir can cache t inside one test function, so tests read time from storage instead.
    function _warp(uint256 to) private {
        t = to;
        vm.warp(to);
    }


    function _newFacility(LoanFacility.CarveOutWindow window) private returns (LoanFacility f) {
        f = new LoanFacility(registry, IERC20Minimal(address(usdc)), LENDER, borrower, ARBITER, CH, LEI, GRACE, window);
        registry.setRegistrar(address(f), true);
        vm.prank(borrower);
        usdc.approve(address(f), type(uint256).max);
    }

    function _sign(uint256 pk, bytes32 digest) private pure returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, digest);
        return abi.encodePacked(r, s, v);
    }

    function _bind(LoanFacility f) private {
        uint256 deadline = t + 1 hours;
        bytes memory sig = _sign(BORROWER_PK, f.bindingDigest(0, deadline));
        vm.prank(LENDER);
        f.bind(0, deadline, sig);
    }

    function _report(uint32 eventBits, uint32 unavailableBits, uint64 presentedAt, uint64 publishedAt, bytes32 requestId)
        private
        view
        returns (bytes memory)
    {
        uint64 nowTs = uint64(t);
        return abi.encode(
            StatusRegistry.Report({
                entityId: facility.entityId(),
                checkedAt: nowTs,
                validUntil: nowTs + MAX_AGE,
                eventBits: eventBits,
                unavailableBits: unavailableBits,
                chUpdatedAt: 0,
                gazetteUpdatedAt: publishedAt,
                gleifUpdatedAt: 0,
                petitionPresentedAt: presentedAt,
                petitionPublishedAt: publishedAt,
                petitionCaseRef: presentedAt == 0 ? bytes32(0) : keccak256("2026/006286"),
                evidenceHash: keccak256(abi.encode(eventBits, unavailableBits, nowTs)),
                requestId: requestId
            })
        );
    }

    function _attest(uint32 eventBits, uint32 unavailableBits) private {
        _attestPetition(eventBits, unavailableBits, 0, 0);
    }

    function _attestPetition(uint32 eventBits, uint32 unavailableBits, uint64 presentedAt, uint64 publishedAt) private {
        bytes memory report = _report(eventBits, unavailableBits, presentedAt, publishedAt, bytes32(0));
        vm.prank(FORWARDER);
        registry.onReport("", report);
    }

    function _eq(LoanFacility.Status a, LoanFacility.Status b, string memory why) private pure {
        require(a == b, why);
    }

    // ------------------------------------------------------------------ binding

    function testBindingRequiresBorrowerSignature() public {
        uint256 deadline = t + 1 hours;
        bytes memory wrong = _sign(0xBAD, facility.bindingDigest(0, deadline));
        vm.prank(LENDER);
        vm.expectRevert(LoanFacility.BadSignature.selector);
        facility.bind(0, deadline, wrong);
    }

    function testBindingOnlyLenderAndNoReplay() public {
        uint256 deadline = t + 1 hours;
        bytes memory sig = _sign(BORROWER_PK, facility.bindingDigest(0, deadline));
        vm.prank(borrower);
        vm.expectRevert(LoanFacility.OnlyLender.selector);
        facility.bind(0, deadline, sig);

        vm.prank(LENDER);
        facility.bind(0, deadline, sig);
        vm.prank(LENDER);
        vm.expectRevert(LoanFacility.AlreadyBound.selector);
        facility.bind(0, deadline, sig);
    }

    function testBindingSignatureIsScopedToFacility() public {
        LoanFacility other = _newFacility(LoanFacility.CarveOutWindow.PRESENTATION);
        uint256 deadline = t + 1 hours;
        bytes memory sigForOther = _sign(BORROWER_PK, other.bindingDigest(0, deadline));
        vm.prank(LENDER);
        vm.expectRevert(LoanFacility.BadSignature.selector);
        facility.bind(0, deadline, sigForOther);
    }

    function testBindingExpires() public {
        uint256 deadline = t + 1 hours;
        bytes memory sig = _sign(BORROWER_PK, facility.bindingDigest(0, deadline));
        _warp(deadline + 1);
        vm.prank(LENDER);
        vm.expectRevert(LoanFacility.BindingExpired.selector);
        facility.bind(0, deadline, sig);
    }

    // ------------------------------------------------------------------ basic status

    function testStatusLifecycleUnboundStaleNormal() public {
        _eq(facility.status(), LoanFacility.Status.UNBOUND, "unbound");
        _bind(facility);
        _eq(facility.status(), LoanFacility.Status.STALE, "no attestation is stale");
        _attest(0, 0);
        _eq(facility.status(), LoanFacility.Status.NORMAL, "clean");
        _warp(t + MAX_AGE + 1);
        _eq(facility.status(), LoanFacility.Status.STALE, "expired attestation is stale");
    }

    function testWatchSignalsDoNotBlockDrawdowns() public {
        _bind(facility);
        vm.prank(borrower);
        uint256 id = facility.requestDrawdown(100e6);
        _warp(t + 60);
        _attest(LEI_LAPSED | CONFLICT, 0);
        _eq(facility.status(), LoanFacility.Status.WATCH, "LEI lapse and source conflict are watch only");
        facility.executeDrawdown(id);
        require(usdc.balanceOf(borrower) == 1_000_000e6 + 100e6, "funds released");
    }

    function testGleifOutageDoesNotBlock() public {
        _bind(facility);
        _attest(0, SRC_GLEIF);
        _eq(facility.status(), LoanFacility.Status.NORMAL, "GLEIF is cross-check only");
    }

    function testRequiredSourceUnavailableIsNotAnAdverseFinding() public {
        _bind(facility);
        _attest(0, SRC_GAZETTE);
        _eq(facility.status(), LoanFacility.Status.UNVERIFIED, "unverified, not adverse");
    }

    // ------------------------------------------------------------------ the real AMS FACILITIES (SW) timeline

    /// Agreement counts the 30-day carve-out from presentation (LMA "commencement"). The petition was advertised
    /// 49 days after presentation, so the window had already closed before anyone could see it.
    function testRealTimelineGraceAlreadyExpiredAtPublication() public {
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, PRESENTED, PUBLISHED);
        _eq(facility.status(), LoanFacility.Status.REVIEW_REQUIRED, "grace from presentation already elapsed");
    }

    /// e.g. Carlsberg cl. 21.5(b): "discharged or dismissed within 30 days of commencement".
    function testCarveOutCountsFromPresentation() public {
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, FRESH_PRESENTED, PUBLISHED);
        _eq(facility.status(), LoanFacility.Status.PETITION_PENDING, "window from presentation still open");
        _warp(FRESH_PRESENTED + GRACE);
        _attestPetition(PETITION, 0, FRESH_PRESENTED, PUBLISHED);
        _eq(facility.status(), LoanFacility.Status.REVIEW_REQUIRED, "window elapsed");
    }

    /// e.g. GasLog cl. 28.10.2: "within seven days of commencement or, if earlier, the date on which it is advertised".
    /// Advertisement closes the window, so a Gazette-sourced attestation always finds it closed.
    function testAdvertisementEndsCarveOutEarly() public {
        facility = _newFacility(LoanFacility.CarveOutWindow.PRESENTATION_OR_ADVERTISEMENT);
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, FRESH_PRESENTED, PUBLISHED);
        require(facility.petitionWindowEnd() == PUBLISHED, "ends on advertisement");
        _eq(facility.status(), LoanFacility.Status.REVIEW_REQUIRED, "closed when seen");
    }

    function testUnknownPresentationDateGoesToReview() public {
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, 0, PUBLISHED);
        _eq(facility.status(), LoanFacility.Status.REVIEW_REQUIRED, "window cannot be computed");
    }

    function testWindingUpOrderGoesStraightToReview() public {
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, FRESH_PRESENTED, PUBLISHED);
        _eq(facility.status(), LoanFacility.Status.PETITION_PENDING, "petition pending");
        _warp(ORDER_PUBLISHED + 1 hours);
        _attest(PROCEEDING, 0); // 2452 supersedes the petition; CH still "active" (true on 2026-10-14)
        _eq(facility.status(), LoanFacility.Status.REVIEW_REQUIRED, "order: no grace");
        vm.prank(LENDER);
        facility.declareDefault();
        _eq(facility.status(), LoanFacility.Status.DEFAULTED, "human default");
    }

    function testDrawdownBlockedWhilePetitionPending() public {
        _bind(facility);
        _warp(PUBLISHED);
        vm.prank(borrower);
        uint256 id = facility.requestDrawdown(100e6);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, FRESH_PRESENTED, PUBLISHED);
        vm.expectRevert(abi.encodeWithSelector(LoanFacility.DrawdownsBlocked.selector, LoanFacility.Status.PETITION_PENDING));
        facility.executeDrawdown(id);
    }

    function testDefaultNotAllowedDuringGrace() public {
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, FRESH_PRESENTED, PUBLISHED);
        vm.prank(LENDER);
        vm.expectRevert(abi.encodeWithSelector(LoanFacility.DefaultNotAllowed.selector, LoanFacility.Status.PETITION_PENDING));
        facility.declareDefault();
    }

    function testOutageCarriesForwardPetitionAndItsDates() public {
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, PRESENTED, PUBLISHED);
        _warp(PUBLISHED + 2 hours);
        _attest(0, SRC_GAZETTE); // Gazette down: petition must not disappear
        StatusRegistry.Attestation memory a = registry.getLatest(facility.entityId());
        require(a.activeBits & PETITION != 0, "petition carried forward");
        require(a.petitionPresentedAt == PRESENTED, "presentation date carried forward");
        _eq(facility.status(), LoanFacility.Status.REVIEW_REQUIRED, "still adverse during outage");
    }

    // ------------------------------------------------------------------ s.127 repayments

    function testRepaymentHeldInSuspenseThenReleasedOnDismissal() public {
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, FRESH_PRESENTED, PUBLISHED);

        vm.prank(borrower);
        facility.repay(50e6);
        require(facility.suspenseBalance() == 50e6, "held in suspense");
        require(usdc.balanceOf(LENDER) == 0, "not passed to lender");

        vm.expectRevert();
        facility.releaseSuspense();

        _warp(PUBLISHED + 3 days);
        _attest(DISMISSED, 0); // 2461 dismissal matched to the petition
        _eq(facility.status(), LoanFacility.Status.NORMAL, "resumes after dismissal");
        facility.releaseSuspense();
        require(usdc.balanceOf(LENDER) == 50e6, "released to lender");
    }

    function testSuspenseHeldAfterOrderUntilHumanResolution() public {
        _bind(facility);
        _warp(ORDER_PUBLISHED);
        _attest(PROCEEDING, 0);
        vm.prank(borrower);
        facility.repay(50e6);
        vm.expectRevert();
        facility.releaseSuspense();

        address liquidator = address(0x11D);
        vm.prank(ARBITER);
        facility.nominateOfficeHolder(liquidator, keccak256("Official Receiver appointment"));
        vm.prank(ARBITER);
        vm.expectRevert(abi.encodeWithSelector(LoanFacility.InvalidRecipient.selector, liquidator));
        facility.resolveSuspense(liquidator, keccak256("returned to Official Receiver")); // nomination not yet effective

        _warp(t + 2 days); // OFFICE_HOLDER_DELAY
        vm.prank(ARBITER);
        facility.resolveSuspense(liquidator, keccak256("returned to Official Receiver"));
        require(usdc.balanceOf(liquidator) == 50e6, "returned to estate");
    }

    function testArbiterCannotPaySuspenseToAnyAddress() public {
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, FRESH_PRESENTED, PUBLISHED);
        vm.prank(borrower);
        facility.repay(50e6);

        address stranger = address(0xBAD);
        vm.prank(ARBITER);
        vm.expectRevert(abi.encodeWithSelector(LoanFacility.InvalidRecipient.selector, stranger));
        facility.resolveSuspense(stranger, keccak256("x"));

        vm.prank(ARBITER);
        vm.expectRevert(LoanFacility.NoProceedingKnown.selector); // a petition alone has no office-holder
        facility.nominateOfficeHolder(stranger, keccak256("x"));

        vm.prank(ARBITER);
        facility.resolveSuspense(borrower, keccak256("validation refused, returned to company"));
        require(usdc.balanceOf(borrower) == 1_000_000e6, "returned to borrower");
    }

    function testReviewCannotReleaseSuspenseWhilePetitionLive() public {
        _bind(facility);
        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, FRESH_PRESENTED, PUBLISHED);
        vm.prank(borrower);
        facility.repay(50e6);
        uint256 attId = registry.getLatest(facility.entityId()).id;
        _warp(t + 1 hours);
        vm.prank(ARBITER);
        facility.recordReview(PETITION, attId, keccak256("petition disputed, debt paid"), uint64(t + 7 days));
        _eq(facility.status(), LoanFacility.Status.NORMAL, "review lets drawdowns resume");
        vm.expectRevert();
        facility.releaseSuspense();
    }

    function testRepaymentsBeforeDetectionAreFlagged() public {
        _bind(facility);
        _warp(PRESENTED + 10 days); // petition presented but not yet advertised: invisible
        _attest(0, 0);
        vm.prank(borrower);
        facility.repay(70e6); // passes to lender, nobody knows yet
        require(usdc.balanceOf(LENDER) == 70e6, "passed through");

        _warp(PUBLISHED + 1 hours);
        _attestPetition(PETITION, 0, PRESENTED, PUBLISHED);
        require(facility.repaidSincePetitionPresented() == 70e6, "flagged as s.127-exposed");
    }

    function testNormalRepaymentPassesToLender() public {
        _bind(facility);
        _attest(0, 0);
        vm.prank(borrower);
        facility.repay(10e6);
        require(usdc.balanceOf(LENDER) == 10e6 && facility.suspenseBalance() == 0, "pass-through");
    }

    // ------------------------------------------------------------------ reviews and acknowledgement

    function testReviewCoversExistingOccurrenceUntilExpiry() public {
        _bind(facility);
        _attest(CH_ADVERSE, 0); // e.g. registry error
        uint256 attId = registry.getLatest(facility.entityId()).id;
        _warp(t + 1 hours);
        vm.prank(ARBITER);
        facility.recordReview(CH_ADVERSE, attId, keccak256("registry correction letter"), uint64(t + 7 days));
        _eq(facility.status(), LoanFacility.Status.NORMAL, "covered by review");
        require(registry.getLatest(facility.entityId()).eventBits == CH_ADVERSE, "attestation untouched");

        _warp(t + 7 days);
        _attest(CH_ADVERSE, 0);
        _eq(facility.status(), LoanFacility.Status.REVIEW_REQUIRED, "review expired, original evidence governs");
    }

    function testReviewDoesNotCoverNewOccurrenceOrOtherBits() public {
        _bind(facility);
        _attest(CH_ADVERSE, 0);
        uint256 attId = registry.getLatest(facility.entityId()).id;
        _warp(t + 1 hours);
        vm.prank(ARBITER);
        facility.recordReview(CH_ADVERSE, attId, keccak256("reason"), uint64(t + 30 days));

        _warp(t + 1 hours);
        _attest(CH_ADVERSE | PROCEEDING, 0);
        _eq(facility.status(), LoanFacility.Status.REVIEW_REQUIRED, "other bit not covered");

        _warp(t + 1 hours);
        _attest(0, 0);
        _eq(facility.status(), LoanFacility.Status.NORMAL, "clear");
        _warp(t + 1 hours);
        _attest(CH_ADVERSE, 0);
        _eq(facility.status(), LoanFacility.Status.REVIEW_REQUIRED, "new occurrence not covered");
    }

    function testOnlyArbiterReviewsAndOnlyPartiesAcknowledge() public {
        _bind(facility);
        vm.prank(LENDER);
        vm.expectRevert(LoanFacility.OnlyArbiter.selector);
        facility.recordReview(1, 0, keccak256("x"), uint64(t + 1 days));
        vm.prank(borrower);
        vm.expectRevert(LoanFacility.OnlyParty.selector);
        facility.acknowledge(1, keccak256("note"));
        vm.prank(LENDER);
        facility.acknowledge(1, keccak256("agent notified lenders"));
    }

    // ------------------------------------------------------------------ registry

    function testRegistryRejectsNonForwarder() public {
        _bind(facility);
        bytes memory report = _report(0, 0, 0, 0, bytes32(0));
        vm.expectRevert(abi.encodeWithSelector(ReceiverTemplate.InvalidSender.selector, address(this), FORWARDER));
        registry.onReport("", report);
    }

    /// Production KeystoneForwarder delivers 64-byte metadata (62-byte identity + 2-byte reportId).
    function testRegistryAcceptsOnlyExpectedWorkflowOwnerWithProductionMetadata() public {
        _bind(facility);
        address owner = address(0xC0FFEE);
        registry.setExpectedAuthor(owner);
        bytes memory report = _report(0, 0, 0, 0, bytes32(0));

        bytes memory good = abi.encodePacked(bytes32(uint256(1)), bytes10("wf"), owner, bytes2(0x0001));
        require(good.length == 64, "production layout");
        vm.prank(FORWARDER);
        registry.onReport(good, report);

        _warp(t + 1);
        bytes memory report2 = _report(0, 0, 0, 0, bytes32(0));
        bytes memory bad = abi.encodePacked(bytes32(uint256(1)), bytes10("wf"), address(0xBEEF), bytes2(0x0001));
        vm.prank(FORWARDER);
        vm.expectRevert(abi.encodeWithSelector(ReceiverTemplate.InvalidAuthor.selector, address(0xBEEF), owner));
        registry.onReport(bad, report2);
    }

    function testRegistryRejectsOutOfOrderReport() public {
        _bind(facility);
        bytes memory older = _report(PETITION, 0, 0, 0, bytes32(0));
        _warp(t + 10);
        _attest(0, 0);
        vm.prank(FORWARDER);
        vm.expectRevert(); // StaleReport
        registry.onReport("", older);
    }

    function testRegistryRejectsUnknownEntity() public {
        // facility not bound -> entity not registered
        bytes memory report = _report(0, 0, 0, 0, bytes32(0));
        bytes32 id = facility.entityId();
        vm.prank(FORWARDER);
        vm.expectRevert(abi.encodeWithSelector(StatusRegistry.UnknownEntity.selector, id));
        registry.onReport("", report);
    }

    function testDrawdownNeedsAttestationAfterRequest() public {
        _bind(facility);
        _attest(0, 0);
        _warp(t + 60);
        vm.prank(borrower);
        uint256 id = facility.requestDrawdown(100e6);
        vm.expectRevert(); // AttestationNotFresh
        facility.executeDrawdown(id);
        _warp(t + 60);
        bytes memory report = _report(0, 0, 0, 0, facility.requestId(id));
        vm.prank(FORWARDER);
        registry.onReport("", report);
        facility.executeDrawdown(id);
    }
}
