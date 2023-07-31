import { BigNumber, ethers, Signer } from "ethers";
require('dotenv').config();
import * as deploy_addresses from "./deploy.sepolia.json";
import * as gamedata from "./gamedata.json";


export async function getAllLevelCreatedLog(signer: Signer) {
  const addressHexPad = ethers.utils.hexZeroPad(await signer.getAddress(), 32);
  const topics = ([ethers.utils.id(`LevelInstanceCreatedLog(address,address)`), addressHexPad]);
  if (!signer.provider) return [];
  const logs = await signer.provider.getLogs({
    fromBlock: 0,
    toBlock: 'latest',
    address: deploy_addresses.ethernaut,
    topics: topics,
  });
  return logs;
}

export async function getAllCompleteLevelLog(signer: Signer) {
  const addressHexPad = ethers.utils.hexZeroPad(await signer.getAddress(), 32);
  const topics = ([ethers.utils.id(`LevelCompletedLog(address player,address level)`), addressHexPad]);
  if (!signer.provider) return [];
  const logs = await signer.provider.getLogs({
    fromBlock: 0,
    toBlock: 'latest',
    address: deploy_addresses.ethernaut,
    topics: topics,
  });
  return logs;
}

export async function createLevel(signer: Signer, levelName: string) {
  const abi = [{
    "inputs": [
      {
        "internalType": "contract Level",
        "name": "_level",
        "type": "address"
      }
    ],
    "name": "createLevelInstance",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true,
    "signature": "0xdfc86b17"
  }]
  const ethernaut = new ethers.Contract(deploy_addresses.ethernaut, abi, signer);
  const regex = new RegExp(levelName, 'i');
  for (let i = 0; i < gamedata.levels.length; i++) {
    const element = gamedata.levels[i];
    //match name regex ignore uppercase with levelName 

    if (element.name.match(regex)) {
      const levelAddress = deploy_addresses.levels[Number(element.deployId)];
      const funding = ethers.utils.parseUnits(element.deployFunds.toString(), "ether");
      console.log(`Creating level: ${element.name}, ${funding.toNumber()} wei, ${levelAddress}`);
      const tx = await ethernaut.createLevelInstance(levelAddress, { value: funding });
      const receipt = await tx.wait();
      // read receipt for log. get LevelInstanceCreatedLog and instance address
      //filter logs for topics 0x7bf7f1ed7f75e83b76de0ff139966989aff81cb85aac26469c18978d86aac1c2
      const log = receipt.logs.find((log: { topics: string[]; }) => log.topics[0] === "0x7bf7f1ed7f75e83b76de0ff139966989aff81cb85aac26469c18978d86aac1c2");
      const newInstanceAddress = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(log.data), 20);
      console.log(`Created new insance Level: ${element.name}, ${newInstanceAddress}`);
      return newInstanceAddress;
    }
  }
  return "0x";
}

export async function submitLevel(signer: Signer, level: string) {
  const abi = [{
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_instance",
        "type": "address"
      }
    ],
    "name": "submitLevelInstance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xc882d7c2"
  }]
  const ethernaut = new ethers.Contract(deploy_addresses.ethernaut, abi, signer);
  console.log("submitting level", level);
  const tx = await ethernaut.submitLevelInstance(level, { gasLimit: 1000000 });
  // checking if level is completed. if tx return LevelCompletedLog event
  const receipt = await tx.wait();
  const isCompleted = receipt.logs.find((log: { topics: string[]; }) => log.topics[0] === '0x9dfdf7e3e630f506a3dfe38cdbe34e196353364235df33e5a3b588488d9a1e78');
  
  if(isCompleted)
    console.log("Level Completed!!!");
  else console.log("level not completed. Does not see completed event");
  return receipt;
}