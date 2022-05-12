import chalk from "chalk";
import inquirer from "inquirer";

let currentAccount;

export async function submitMoves(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  console.log("Submitting moves to game:", gameID);
}
