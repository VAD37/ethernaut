import { ethers, Signer } from "ethers";
import * as fs from 'fs';
require('dotenv').config();
export function getSigner(): Signer {
    // import file .secret and read it

    const url = process.env.RINKEBY_URL;
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
    const privateKey = fs.readFileSync(".secret", "utf8");
    return new ethers.Wallet(privateKey, customHttpProvider);
}