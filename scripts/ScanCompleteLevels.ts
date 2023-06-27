// Find all complete level on current network.
// Runtime Environment's members available in the global scope.

import * as deploy_addresses from "./deploy.goerli.json";
import { BigNumber, ethers, Signer } from "ethers";
import { getSigner } from "./signer";
import { getAllCompleteLevelLog, getAllLevelCreatedLog } from "./utils";

// Apparently you cant get instance level from contract directly because data is not public.
// Ethernaut web client handle this by reading from caching. That's explain why I cant see incompleted level if I reset browser.
// Ethernaut sync progress with reading completed event only.
async function main() {
    const signer = getSigner();
    const player = await signer.getAddress();
    const provider = signer.provider ?? ethers.getDefaultProvider();

    const levelsLog = await getAllLevelCreatedLog(signer);
    const completedLevelLog = await getAllCompleteLevelLog(signer);
        
    const instances = levelsLog.map(x => x.data);
    console.log(`Found ${instances.length} created instances`);
    console.log(`Found ${completedLevelLog.length} levels completed`);

    // // for each instance, we find level number from Ethernaut contract mapping.
    // // By raw reading directly from blockchain
    // for (let i = 0; i < instances.length; i++) {
    //     const instance = instances[i];
    //     console.log("find level for instance", instance);
    //     const storagePosition = ethers.utils.solidityKeccak256(["address","uint256"], [instance,2]);             
    //     const sender = await provider.getStorageAt(deploy_addresses.ethernaut, storagePosition);
    //     const level = await provider.getStorageAt(deploy_addresses.ethernaut, BigNumber.from(storagePosition).add(1));
    //     console.log("keccak1:", sender);
    //     console.log("keccak2:", level);
    // };

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