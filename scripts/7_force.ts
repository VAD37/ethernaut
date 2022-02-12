// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { getSigner } from "./signer";

import { ProxyCall__factory } from "../typechain";

async function main() {
  const instanceAddress = "0x677bf1202a4DfC76117e75fdb60E813876b55e26";
  const signer = getSigner();
  const suicide = await ethers.getContractFactory("Suicide");
  const ct = await suicide.deploy(instanceAddress, {value: 100});
  await ct.deployed();
}
main()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
