import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import fs from "fs";
const { dirname } = require("path");
const pkDir = dirname(require.main.filename);

// UNCOMMENT DESIRED PROVIDER
// const PROVIDER_URL = "https://matic-mumbai.chainstacklabs.com"; // Mumbai
const PROVIDER_URL = "https://data-seed-prebsc-2-s3.binance.org:8545"; // Binance Test
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
  let provider = await new Web3(wallet);
  return provider;
};

export default provider;
