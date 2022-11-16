import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import fs from "fs";
const { dirname } = require("path");
const pkDir = dirname(require.main.filename);
require("dotenv").config();

// UNCOMMENT DESIRED PROVIDER
const PROVIDER_URL = process.env.RPC_URL_MUMBAI; // Mumbai
// const PROVIDER_URL = process.env.RPC_URL_BINANCE_TEST; // Binance Test
// const PROVIDER_URL = process.env.RPC_URL_GOERLI; // GOERLI
// const PROVIDER_URL = "http://127.0.0.1:7545"; // Ganache

const provider = async (providerUrl) => {
  let keys = [];
  const keysFromFile = fs.readFileSync(`${pkDir}/.privateKey`).toString();
  keysFromFile.split(/\r?\n/).forEach((line) => {
    const privateKey = line.trim();
    keys.push(privateKey);
  });
  let wallet = new HDWalletProvider({
    privateKeys: keys,
    providerOrUrl: providerUrl ? providerUrl : PROVIDER_URL
  });
  let provider = new Web3(wallet);
  return provider;
};

export default provider;
