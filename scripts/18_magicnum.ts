// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
// import {ethers} from 'hardhat';
import { BigNumber, Signer, BytesLike, Contract } from "ethers";
import { getSigner } from "./signer";
import { MagicNumSolver__factory, MagicNum__factory } from "../typechain";
import { createLevel, submitLevel } from './utils';

async function main() {
  const signer = getSigner();
  // const signer = (await ethers.getSigners())[0];

  const level = await createLevel(signer,"magic");
  const magicNum = await MagicNum__factory.connect(level,signer);
  
  console.log("deploying magic")
  const target = await (new MagicNumSolver__factory(signer)).deploy();
  // await target.deployed();
  
  await magicNum.setSolver(target.address);
  console.log("solver set")
  // console.log("size: ", await magicNum.getCodeSize(target.address));
  await submitLevel(signer,level);
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