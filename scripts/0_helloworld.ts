import { ethers, Signer } from "ethers";
import { getSigner } from "./signer";

import { createLevel, submitLevel } from "./utils";

async function main() {

    // const level = "0xB8e3501Eb9626b74E460dE11F492ae212c0F1469";
    const signer = getSigner();
    const level = await createLevel(signer,"Hello");
    const contract = new ethers.Contract(level, abi, signer);
    await contract.authenticate("ethernaut0", { gasLimit: 1000000 });
    await submitLevel(signer, level);

}


const abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_password",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "passkey",
                "type": "string"
            }
        ],
        "name": "authenticate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xaa613b29"
    },
    {
        "inputs": [],
        "name": "getCleared",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true,
        "signature": "0x3c848d78"
    },
    {
        "inputs": [],
        "name": "info",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function",
        "constant": true,
        "signature": "0x370158ea"
    },
    {
        "inputs": [],
        "name": "info1",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function",
        "constant": true,
        "signature": "0xd4c3cf44"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "param",
                "type": "string"
            }
        ],
        "name": "info2",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function",
        "constant": true,
        "signature": "0x2133b6a9"
    },
    {
        "inputs": [],
        "name": "info42",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function",
        "constant": true,
        "signature": "0x2cbd79a5"
    },
    {
        "inputs": [],
        "name": "infoNum",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true,
        "signature": "0xc253aebe"
    },
    {
        "inputs": [],
        "name": "method7123949",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function",
        "constant": true,
        "signature": "0xf0bc7081"
    },
    {
        "inputs": [],
        "name": "password",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true,
        "signature": "0x224b610b"
    },
    {
        "inputs": [],
        "name": "theMethodName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true,
        "signature": "0xf157a1e3"
    }
]

main()
    .then(() => {
        console.log("Done!");
    })
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });

