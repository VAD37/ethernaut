import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

describe("Good Samatarian test", function () {
  it("Local Test", async function () {
    const Good = await (await ethers.getContractFactory("GoodSamaritan")).deploy();
    await Good.deployed();
    await Good.requestDonation();
    const attacker = await (await ethers.getContractFactory("GoodSamaritanExploit")).deploy(Good.address);
    await attacker.deployed();
    await attacker.takeAllDonation();
    const coin = await (await ethers.getContractFactory("Coin")).attach(await Good.coin());
    console.log(await coin.balances(await attacker.address));
    console.log(await coin.balances(await Good.address));
    console.log(await coin.balances(await Good.wallet()));
    expect(await coin.balances(attacker.address)).to.gt(1000);
  });
});
