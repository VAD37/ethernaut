// import { ethers as ethers_hh } from "hardhat";
import { ethers } from "ethers";
import { getSigner } from "./signer";

import { FlipCheat__factory } from "../typechain/";
import { CoinFlip__factory } from "../typechain/ethers-v5";
import { BigNumber } from "ethers";



// npx hardhat run scripts/3_flip.ts  --network rinkeby 
// Note if network is slow. You can miss the block. 

async function main() {
  const level = "0x5C697bf07f7B49120dEe53Afe0220681b49579C4";

  // const FlipCheat = await ethers_hh.getContractFactory("FlipCheat");
  // const flipCheat = await FlipCheat.deploy();
  // await flipCheat.deployed();
  // console.log("FlipCheat deployed to:", flipCheat.address);

  const signer = getSigner();
  const contract = CoinFlip__factory.connect(level, signer);
  const flipCheat = FlipCheat__factory.connect("0x9601F826e7fb42C2A649c25ae084f7B8632650F4", signer);


  // // let winCount: BigNumber = BigNumber.from(0);

  // // for (let i = 1; i < 10; i++) {

  // //   winCount = await contract.consecutiveWins();
  signer.provider?.getBlock("latest").then(async (block) => {console.log("predict block number:", block.number)});
  const predict_flip = await flipCheat.flip();
  console.log("predict flip:", predict_flip);

  console.log("send tx");
  const tx = await flipCheat.postflip({ gasLimit: 1000000, gasPrice: ethers.utils.parseUnits("10", "gwei"), });
  const receipt = await tx.wait();
  // console.log(receipt);
  console.log("block hash:", receipt.blockHash);
  console.log('block latest number:', receipt.blockNumber);
  // //   const tx = await contract.flip(actual_flip, {gasLimit:156000});
  // //   await tx.wait(1);
  // //   console.log("win count:", winCount.toNumber());
  // // }

  console.log("flip block hash uint:", (await flipCheat.lastBlockHash()).toString());
  console.log("flip block number:", (await flipCheat.lastBlockNumber()).toNumber());
  console.log("flip block div:", (await flipCheat.lastCoinDivide()).toNumber());
  console.log("flip result:", await flipCheat.lastSide());

  let block = await signer.provider?.getBlock((await flipCheat.lastBlockNumber()).toNumber() - 1);
  console.log("block flip number:", block?.number);
  console.log("predicted flip:", await PredictFlip(block?.hash || ""));
}
async function PredictFlip(hash: string) {
  const FACTOR = BigNumber.from("57896044618658097711785492504343953926634992332820282019728792003956564819968");
  const hashValue = BigNumber.from(hash);
  console.log("block hash uint", hashValue.toString());
  console.log("factor: ", hashValue.div(FACTOR).toString());
  const actual_flip = hashValue.div(FACTOR).eq(1);
  return actual_flip;
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