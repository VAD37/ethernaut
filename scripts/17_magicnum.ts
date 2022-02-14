// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { MagicNumSolver__factory } from "../typechain";
import { Interface } from 'ethers/lib/utils';

async function main() {
  const instanceAddress = "0x3109AE583e54deb394612D9E7b986007a8D112AA";
  const signer = getSigner();
  console.log("deploying magic")
  // const target = await (new MagicNumSolver__factory(signer)).deploy();
  // await target.deployed();
  const abi = [
    "function setSolver(address _solver)",
    "function whatIsTheMeaningOfLife()",
  ];
  const iface = new Interface(abi);
  const data = iface.encodeFunctionData("whatIsTheMeaningOfLife", []);
  console.log("calling setSolver")
  console.log(data);
  // await signer.sendTransaction({to: instanceAddress, data: data, gasLimit:950000});

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