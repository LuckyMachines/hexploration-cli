import Web3 from "web3";
const Ethers = require("ethers");
require("dotenv").config();

// TODO: choose between web3 or ethers (default to web3 if nothing passed for legacy support)
const provider = async (ethereum, web3OrEthers) => {
  // let keys = [];
  // const keysFromFile = fs.readFileSync(`${pkDir}/.privateKey`).toString();
  // keysFromFile.split(/\r?\n/).forEach((line) => {
  //   const privateKey = line.trim();
  //   keys.push(privateKey);
  // });
  if (web3OrEthers && web3OrEthers == "ethers") {
    // // ethers provider
    // provider = new Ethers.providers.JsonRpcProvider(
    //   providerUrl ? providerUrl : PROVIDER_URL
    // );
    // const index = walletIndex ? walletIndex : 0;
    // const wallet = new Ethers.Wallet(keys[index], provider);
    // return { provider: provider, wallet: wallet };
    const ethersProvider = new Ethers.providers.Web3Provider(ethereum, "any");
    // Prompt user for account connections
    const signer = ethersProvider.getSigner();
    // console.log("Account connected:", await signer.getAddress());
    return { provider: ethersProvider, wallet: signer };
  } else {
    // const wallet = new HDWalletProvider({
    //   privateKeys: keys,
    //   providerOrUrl: providerUrl ? providerUrl : PROVIDER_URL
    // });
    // provider = new Web3(wallet);
    let web3Provider = new Web3(ethereum);
    return web3Provider;
  }
};

export default provider;
