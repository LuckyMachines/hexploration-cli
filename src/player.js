import chalk from "chalk";
import inquirer from "inquirer";

let currentAccount;

export async function playerInfo(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  console.log("Getting player info for game:", gameID);
}
