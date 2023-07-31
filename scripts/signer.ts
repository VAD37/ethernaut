import { ethers, Signer } from "ethers";
require('dotenv').config();
export function getSigner(): Signer {    
    // import file .secret and read it
    const url = process.env.SEPOLIA_URL;
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
    const privateKey = process.env.PRIVATE_KEY || '';    
    return new ethers.Wallet(privateKey, customHttpProvider);
}