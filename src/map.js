import chalk from "chalk";
import inquirer from "inquirer";
import { drawMap } from "./hexText";

let currentAccount;

export async function showMap(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  console.log("Show Map of Hexploration World with ID:", gameID);
  drawMap(5, 5);
}
