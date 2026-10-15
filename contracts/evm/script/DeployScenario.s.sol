// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StatusRegistry} from "../src/StatusRegistry.sol";
import {LoanFacility, IERC20Minimal} from "../src/LoanFacility.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

interface Vm {
    function envUint(string calldata name) external view returns (uint256);
    function envAddress(string calldata name) external view returns (address);
    function addr(uint256 privateKey) external pure returns (address);
    function sign(uint256 privateKey, bytes32 digest) external pure returns (uint8 v, bytes32 r, bytes32 s);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
}

/// @notice Loan scenario for the FICTIONAL company DM000001 (served by demo/scenario-server.ts).
/// @dev The arbiter is a separate address from the lender, as it would be in a real facility (e.g. agent or trustee).
///      Agreement terms: 30-day petition carve-out counted from presentation (LMA "commencement").
///      Env: CRE_ETH_PRIVATE_KEY (lender), DEMO_BORROWER_PRIVATE_KEY, DEMO_ARBITER_ADDRESS, REGISTRY.
contract DeployScenario {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    string private constant COMPANY = "DM000001";
    uint64 private constant GRACE = 30 days;

    function run() external returns (MockUSDC usdc, LoanFacility facility) {
        uint256 lenderKey = vm.envUint("CRE_ETH_PRIVATE_KEY");
        uint256 borrowerKey = vm.envUint("DEMO_BORROWER_PRIVATE_KEY");
        StatusRegistry registry = StatusRegistry(vm.envAddress("REGISTRY"));
        address lender = vm.addr(lenderKey);
        address borrower = vm.addr(borrowerKey);
        address arbiter = vm.envAddress("DEMO_ARBITER_ADDRESS");

        vm.startBroadcast(lenderKey);
        usdc = new MockUSDC();
        facility = new LoanFacility(
            registry, IERC20Minimal(address(usdc)), lender, borrower, arbiter, COMPANY, "", GRACE, LoanFacility.CarveOutWindow.PRESENTATION
        );
        registry.setRegistrar(address(facility), true);
        usdc.mint(address(facility), 1_000_000e6); // facility commitment
        usdc.mint(borrower, 100_000e6); // borrower funds for repayments

        // Borrower acknowledges the binding off-chain (EIP-712); lender submits it.
        uint256 deadline = block.timestamp + 1 days;
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(borrowerKey, facility.bindingDigest(0, deadline));
        facility.bind(0, deadline, abi.encodePacked(r, s, v));
        vm.stopBroadcast();

        vm.startBroadcast(borrowerKey);
        usdc.approve(address(facility), type(uint256).max);
        vm.stopBroadcast();
    }
}
