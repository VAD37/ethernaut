pragma solidity ^0.8.0;

contract MagicNumSolver {
    function whatIsTheMeaningOfLife() public pure returns (bytes memory x) {
        assembly {
            x := 42
        }
    }
}
