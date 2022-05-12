import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import fs from "fs";
const { dirname } = require("path");
const pkDir = dirname(require.main.filename);

const provider = async (providerUrl) => {
  let keys = [];
  const keysFromFile = fs.readFileSync(`${pkDir}/privateKey`).toString();
  keysFromFile.split(/\r?\n/).forEach((line) => {
    const privateKey = line.trim();
    keys.push(privateKey);
  });
  let wallet = new HDWalletProvider({
    privateKeys: keys,
    providerOrUrl: providerUrl ? providerUrl : "http://127.0.0.1:7545"
  });
  let provider = await new Web3(wallet);
  return provider;
};

export default provider;
