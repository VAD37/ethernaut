// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { getSigner } from "./signer";

import { createLevel, submitLevel } from "./utils";

async function main() {
  const signer = getSigner();
  const level = await createLevel(signer, "force");
  const suicide = await ethers.getContractFactory("Suicide");
  const ct = await suicide.connect(signer).deploy(level, {value: 100});
  const tx = await ct.deployed();
  console.log("deploying ", ct.address);
  
  await submitLevel(signer,level);
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
