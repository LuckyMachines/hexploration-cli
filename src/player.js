import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract";

let currentAccount;
let summary;
let board;

export async function playerInfo(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  console.log("Getting player info for game:", gameID);
  summary = await Contract("summary", provider);
  board = await Contract("board", provider);
  let playerStats = await summary.methods
    .currentPlayerStats(board._address, gameID)
    .call();
  console.log(playerStats);
}
