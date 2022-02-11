import { ethers } from "hardhat";
// import { ethers } from "ethers";
import { getSigner } from "./signer";

import { ProxyCall } from "../typechain/ProxyCall";
import { BigNumber, BytesLike } from "ethers";
import { Interface } from "ethers/lib/utils";

async function main() {
  const instanceAddress = "0xe1eBF1f14aae36ca39CC8Ec722901771fe08359e";
  const signer = getSigner();

  // 0x682Fc3f0384b0f464415feC28b233764CeB88d3a
  const factory = await ethers.getContractFactory("ProxyCall", signer);
  // const proxy = await factory.deploy() as ProxyCall
  const proxy = factory.attach("0x682Fc3f0384b0f464415feC28b233764CeB88d3a") as ProxyCall
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
  const tx = await proxy.proxy(instanceAddress, formatData, {gasLimit:62000});
  const receipt = await tx.wait();
  console.log(receipt);

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
