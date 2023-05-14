import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
const Ethers = require("ethers");
import fs from "fs";
// const { dirname } = require("path");
// const pkDir = dirname(require.main.filename);
console.log("before dotenv");
require("dotenv").config();
console.log("after dotenv");
const Network = require("../settings/Network.json");
console.log("providers Network.network", Network.network);
// UNCOMMENT DESIRED PROVIDER

const RPC_URL_GODWOKEN = "https://v1.mainnet.godwoken.io/rpc";
const RPC_URL_GODWOKEN_TEST = "https://v1.testnet.godwoken.io/rpc";
const RPC_URL_GOERLI =
  "https://goerli.infura.io/v3/83aa9b16a1104311b80e9020c82ce952";
const RPC_URL_SEPOLIA =
  "https://sepolia.infura.io/v3/ce3e1ae98d474ef4a3e9ca0d2713cede";
const RPC_URL_MUMBAI =
  "https://polygon-mumbai.infura.io/v3/83aa9b16a1104311b80e9020c82ce952";
const RPC_URL_POLYGON =
  "https://polygon-mainnet.infura.io/v3/83aa9b16a1104311b80e9020c82ce952";

let PROVIDER_URL;
switch (Network.network) {
  case "ganache":
    PROVIDER_URL = "http://10.0.0.134:7545";
    break;
  case "godwoken":
    PROVIDER_URL = RPC_URL_GODWOKEN;
    break;
  case "godwoken_test":
    console.log("SWITCH godwoken test");
    PROVIDER_URL = RPC_URL_GODWOKEN_TEST;
    break;
  case "goerli":
    PROVIDER_URL = RPC_URL_GOERLI;
    break;
  case "sepolia":
    PROVIDER_URL = RPC_URL_SEPOLIA;
    break;
  case "mumbai":
    PROVIDER_URL = RPC_URL_MUMBAI;
    break;
  case "bnbTest":
    PROVIDER_URL = RPC_URL_BINANCE_TEST;
  case "hh-lan":
    PROVIDER_URL = "http://192.168.132.44:8545";
    break;
  case "hardhat":
  case "hh":
  default:
    PROVIDER_URL = "http://127.0.0.1:8545";
    break;
}

console.log("provider URL is... ", PROVIDER_URL);
// TODO: choose between web3 or ethers (default to web3 if nothing passed for legacy support)
const provider = async (providerUrl, web3OrEthers, walletIndex) => {
  let provider;
  //my godwoken testnet key
  let keys = [
    "efab1d8aee4198c8f938eab2cef50301f15bb10903794e11fce5006cee976843",
  ];
  //const keysFromFile = fs.readFileSync(`${pkDir}/.privateKey`).toString();
  // const keysFromFile = fs
  //   .readFileSync(`${process.cwd()}/.privateKey`)
  //   .toString();

  // keysFromFile.split(/\r?\n/).forEach((line) => {
  //   const privateKey = line.trim();
  //   keys.push(privateKey);
  // });
  if (web3OrEthers && web3OrEthers == "ethers") {
    console.log("setup provider as web3OrEthers");
    // ethers provider
    provider = new Ethers.providers.JsonRpcProvider(
      providerUrl ? providerUrl : PROVIDER_URL
    );
    const index = walletIndex ? walletIndex : 0;
    const wallet = new Ethers.Wallet(keys[index], provider);
    return { provider: provider, wallet: wallet };
  } else {
    console.log("setup provider as HDWalletProvider");
    const wallet = new HDWalletProvider({
      privateKeys: keys,
      providerOrUrl: providerUrl ? providerUrl : PROVIDER_URL,
    });
    provider = new Web3(wallet);
    return provider;
  }
};

export default provider;
