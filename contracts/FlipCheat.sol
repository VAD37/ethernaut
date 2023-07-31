// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FlipCheat {
    using SafeMath for uint256;
    uint256 public FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    uint256 public lastBlockNumber;
    uint256 public lastBlockHash;
    uint256 public lastCoinDivide;
    bool public lastSide;

    // Since this is cheating using block have not mined. So we do not need to subtract 1.
    function flip() public view returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        // uint256 blockValue = uint256(blockhash(block.number));
        uint256 coinFlip = blockValue.div(FACTOR);
        bool side = coinFlip == 1 ? true : false;
        return side;
    }

    // Since this is cheating using block have not mined. So we do not need to subtract 1.
    function postflip() public returns (bool, uint256) {
        // uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        uint256 blockValue = uint256(blockhash(block.number - 1));
        lastBlockNumber = block.number;
        lastBlockHash = blockValue;
        uint256 coinFlip = blockValue.div(FACTOR);
        lastCoinDivide = coinFlip;
        bool side = coinFlip == 1 ? true : false;
        lastSide = side;
        return (side, block.number);
    }
}
