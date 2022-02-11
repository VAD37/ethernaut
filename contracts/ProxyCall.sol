pragma solidity ^0.8.0;

contract ProxyCall {
    address public owner;

    modifier _onlyOwner() {
        require(msg.sender == owner,"Who are u?");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function proxy(address _to, bytes calldata _data) public payable  _onlyOwner() {
        _to.call{value:msg.value}(_data);
    }
}
