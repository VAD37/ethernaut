import { ethers } from "ethers";
import { getSigner } from "./signer";

import { BigNumber, BytesLike } from "ethers";
import { Token__factory } from "../typechain/ethers-v5";



async function main() {
  const instanceAddress = "0xA985973Fa364d93e7E0e8a21F8715DB607eAd4b8";
  const main = getSigner();
  const supportAddress = "0x6995870D9890e10979aFCbDEA5d8D249e969822D";
  const contract = Token__factory.connect(instanceAddress, main);

  await SendOverflowNumber();


  async function SendOverflowNumber() {
    console.log("main balances:", (await contract.balanceOf(await main.getAddress())).toString());
    console.log("support balances:", (await contract.balanceOf(supportAddress)).toString());

    const tx = await contract.transfer(supportAddress, ethers.utils.parseEther("0.001"));
    const receipt = await tx.wait();
    console.log(receipt);

    console.log("main balances:", (await contract.balanceOf(await main.getAddress())).toString());
    console.log("support balances:", (await contract.balanceOf(supportAddress)).toString());
  }
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
