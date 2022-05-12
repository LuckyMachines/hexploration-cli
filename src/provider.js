import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import fs from "fs";

const provider = async (providerUrl) => {
  const privateKey = fs.readFileSync("privateKey").toString().trim();
  let wallet = new HDWalletProvider({
    privateKeys: [privateKey],
    providerOrUrl: providerUrl ? providerUrl : "http://127.0.0.1:7545"
  });
  let provider = await new Web3(wallet);
  return provider;
};

export default provider;
