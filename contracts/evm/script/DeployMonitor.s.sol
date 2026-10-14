// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {StatusRegistry} from "../src/StatusRegistry.sol";

interface Vm {
    function envUint(string calldata name) external view returns (uint256);
    function envAddress(string calldata name) external view returns (address);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
}

/// @notice Deploys the StatusRegistry and registers real UK companies for public-record monitoring only.
/// @dev No loan facility is bound to a real company: binding a test wallet to a real company would publish a false
///      claim that the wallet represents it. Facility scenarios use a fictional company (see DeployScenario).
///      Env: CRE_ETH_PRIVATE_KEY, CRE_FORWARDER (simulation: 0x15fC6ae953E024d975e77382eEeC56A9101f9F88).
contract DeployMonitor {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function run() external returns (StatusRegistry registry) {
        uint256 deployerKey = vm.envUint("CRE_ETH_PRIVATE_KEY");
        address forwarder = vm.envAddress("CRE_FORWARDER");

        vm.startBroadcast(deployerKey);
        registry = new StatusRegistry(forwarder);
        // Public-record monitoring targets (no lending relationship implied):
        registry.registerEntity("11877818", ""); // AMS FACILITIES (SW) LTD: petition 2026-08-11, order 2026-10-07
        registry.registerEntity("00445790", "2138002P5RNKC5W2JZ46"); // TESCO PLC: control case, LEI cross-check
        vm.stopBroadcast();
    }
}
