import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract.js";

let currentAccount;
let board;
let controller;
let summary;

export async function equipItem(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  board = await Contract("board", provider);
  controller = await Contract("controller", provider);
  summary = await Contract("summary", provider);
  console.log("Equip item...");

  // get player inventory....
  // if items exist, provide list of inventory
  // choose hand to equip to
  // call equip item on controller
}
