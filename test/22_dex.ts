import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

describe("Dex one test", function () {
  it.only("Local Test", async function () {
    const Token = await ethers.getContractFactory("SwappableToken");
    const DEX = await ethers.getContractFactory("Dex");

    const token1 = await Token.deploy("token1", "T1", BigNumber.from(100000000));
    const token2 = await Token.deploy("token2", "T2", BigNumber.from(100000000));

    await token1.deployed();
    await token2.deployed();
    const dex = await DEX.deploy(token1.address, token2.address);    
    const owner = (await ethers.getSigners())[0];
    
    token1.approve(dex.address, ethers.constants.MaxUint256);
    token2.approve(dex.address, ethers.constants.MaxUint256);
    console.log("empty dex with no price")

    console.log("t1 -> t2:", await dex.get_swap_price(token1.address, token2.address, 1000));
    console.log("t2 -> t1:", await dex.get_swap_price(token2.address, token1.address, 1000));


    console.log("add liquidity");
    await dex.add_liquidity(token1.address, 800000);
    await dex.add_liquidity(token2.address, 24000000);

    console.log("t1 -> t2:", await dex.get_swap_price(token1.address, token2.address, 1000));
    console.log("t2 -> t1:", await dex.get_swap_price(token2.address, token1.address, 1000));
  });
});
