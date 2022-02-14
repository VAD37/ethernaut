import { expect } from "chai";
import { ethers } from "hardhat";

describe("Gate Two Test", function () {
  it.only("Pass gates", async function () {
    const AlienCodex = await ethers.getContractFactory("AlienCodex");
    const codex = await AlienCodex.deploy();
    await codex.deployed();
    
    for(let i = 0; i < 10; i++) {
      console.log(await ethers.getDefaultProvider().getStorageAt(codex.address, i));
    }
    
    
  });
});
