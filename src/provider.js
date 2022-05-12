import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import fs from "fs";
const { dirname } = require("path");
const pkDir = dirname(require.main.filename);

const provider = async (providerUrl) => {
  const privateKey = fs.readFileSync(`${pkDir}/privateKey`).toString().trim();
  let wallet = new HDWalletProvider({
    privateKeys: [privateKey],
    providerOrUrl: providerUrl ? providerUrl : "http://127.0.0.1:7545"
  });
  let provider = await new Web3(wallet);
  return provider;
};

export default provider;
