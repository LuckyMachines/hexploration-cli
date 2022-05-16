import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract";

let currentAccount;
let summary;
let board;

export async function playerInfo(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  // console.log("Getting player info for game:", gameID);
  summary = await Contract("summary", provider);
  board = await Contract("board", provider);
  let playerStats = await summary.methods
    .currentPlayerStats(board._address, gameID)
    .call();
  let activeInventory = await summary.methods
    .activeInventory(board._address, gameID)
    .call();
  let handInventory = await summary.methods
    .currentHandInventory(board._address, gameID)
    .call();

  console.log(
    `Movement: ${playerStats.movement}, Agility: ${playerStats.agility}, Dexterity: ${playerStats.dexterity}`
  );
  console.log("Campsite:", activeInventory.campsite ? "Packed Up" : "On Board");
  console.log(
    `Left hand item: ${
      handInventory.leftHandItem ? handInventory.leftHandItem : "None"
    }, Right hand item:${
      handInventory.rightHandItem ? handInventory.rightHandItem : "None"
    }`
  );
  console.log(
    "Player Status:",
    activeInventory.status ? activeInventory.status : "Healthy"
  );
  console.log(
    "Artifact:",
    activeInventory.artifact ? activeInventory.artifact : "None"
  );
  console.log("Relic:", activeInventory.relic ? activeInventory.relic : "None");
  console.log("Shield:", activeInventory.shield ? "Enabled" : "None");
}
