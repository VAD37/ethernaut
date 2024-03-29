// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "forge-std/Test.sol";
contract Switch {
    bool public switchOn; // switch is off
    bytes4 public offSelector = bytes4(keccak256("turnSwitchOff()"));

     modifier onlyThis() {
        require(msg.sender == address(this), "Only the contract can call this");
        _;
    }

    modifier onlyOff() {
        //log calldata
        console.logBytes(msg.data);
        // we use a complex data type to put in memory
        bytes32[1] memory selector;
        // check that the calldata at position 68 (location of _data)
        assembly {
            calldatacopy(selector, 68, 4) // grab function selector from calldata
        }
        console.logBytes32(selector[0]);
        require(
            selector[0] == offSelector,
            "Can only call the turnOffSwitch function"
        );
        _;
    }

    function flipSwitch(bytes memory _data) public onlyOff {//30c13ade    
        (bool success, ) = address(this).call(_data);//why ignore first 68
        require(success, "call failed :(");
    }

    function turnSwitchOn() public onlyThis {
        console.log("switch on");
        console.logBytes(msg.data);
        switchOn = true;
    }

    function turnSwitchOff() public onlyThis {
        console.log("switch off");
        switchOn = false;
    }

}