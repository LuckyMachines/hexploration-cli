import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import Ethers from "ethers";
import fs from "fs";
const { dirname } = require("path");
const pkDir = dirname(require.main.filename);
require("dotenv").config();

// UNCOMMENT DESIRED PROVIDER
const PROVIDER_URL = process.env.RPC_URL_MUMBAI; // Mumbai
// const PROVIDER_URL = process.env.RPC_URL_BINANCE_TEST; // Binance Test
// const PROVIDER_URL = process.env.RPC_URL_GOERLI; // GOERLI
// const PROVIDER_URL = "http://127.0.0.1:7545"; // Ganache

// TODO: choose between web3 or ethers (default to web3 if nothing passed for legacy support)
const provider = async (providerUrl, web3OrEthers, walletIndex) => {
  let provider;
  let keys = [];
  const keysFromFile = fs.readFileSync(`${pkDir}/.privateKey`).toString();
  keysFromFile.split(/\r?\n/).forEach((line) => {
    const privateKey = line.trim();
    keys.push(privateKey);
  });
  if (web3OrEthers && web3OrEthers == "ethers") {
    // ethers provider
    provider = new Ethers.providers.JsonRpcProvider(
      providerUrl ? providerUrl : PROVIDER_URL
    );
    const index = walletIndex ? walletIndex : 0;
    const wallet = new Ethers.Wallet(keys[index], provider);
    return { provider: provider, wallet: wallet };
  } else {
    const wallet = new HDWalletProvider({
      privateKeys: keys,
      providerOrUrl: providerUrl ? providerUrl : PROVIDER_URL
    });
    provider = new Web3(wallet);
    return provider;
  }
};

export default provider;
