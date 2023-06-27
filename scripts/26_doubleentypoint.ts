// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { DoubleEntryPoint__factory, IForta__factory,DetectionDefender__factory } from "../typechain";
import { createLevel, submitLevel } from './utils';

async function main() {
    // Ok so the ethernaut webversion contract give wrong address. The address it give is the proxy contract. Not the wallet contract.
    // the proxy keep delegate view call to the wallet contract. 
    const signer = getSigner();
    const level = await createLevel(signer, "DoubleEntrypoint");
    
    const entryPoint = await DoubleEntryPoint__factory.connect(level,signer);
    const player = await signer.getAddress();
    const cryptoVault = await entryPoint.cryptoVault();
    const delegatedFrom = await entryPoint.delegatedFrom();
    const forta = IForta__factory.connect(await entryPoint.forta(),signer);
    console.log("cryptoVault:",cryptoVault);
    console.log("delegatedFrom:",delegatedFrom);
    console.log("forta:",forta.address);
    // CryptoVault have 100 DET and 100 LGT
    // attacker cannot withdraw DET from vault. But can withdraw LGT.
    // LGT have delegate transfer mechanism that call to new DET version.
    // So forta have to detect if transfer call from Vault to take LGT or not.
    const defender = await new DetectionDefender__factory(signer).deploy(cryptoVault,forta.address);
    await defender.deployed();
    console.log("defender:",defender.address);
    await forta.setDetectionBot(defender.address);
    console.log("forta defender set");
    // try steal token from vault. Expect error throw

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