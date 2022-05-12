import chalk from "chalk";
import inquirer from "inquirer";

let currentAccount;

export async function progressPhase(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  console.log("Progress to next phase of game ID:", gameID);
}
