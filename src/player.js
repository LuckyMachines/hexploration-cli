import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract";
import { displayPlayerInfo } from "./playerInfo";

let currentAccount;
let summary;
let playerSummary;
let board;

const ACTION = [
  "Idle",
  "Move",
  "Setup Camp",
  "Break Down Camp",
  "Dig",
  "Rest",
  "Help"
];

export async function playerInfo(network, gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  // console.log("Getting player info for game:", gameID);
  summary = await Contract(network, "summary", provider);
  playerSummary = await Contract(network, "playerSummary", provider);
  board = await Contract(network, "board", provider);
  let playerStats = await playerSummary.methods
    .currentPlayerStats(board._address, gameID)
    .call({ from: currentAccount });
  let activeInventory = await playerSummary.methods
    .activeInventory(board._address, gameID)
    .call({ from: currentAccount });
  // console.log(activeInventory);
  // let inactiveInventory = await playerSummary.methods
  //   .inactiveInventory(board._address, gameID)
  //   .call({ from: currentAccount });
  // console.log(inactiveInventory);
  let handInventory = await playerSummary.methods
    .currentHandInventory(board._address, gameID)
    .call({ from: currentAccount });

  // Constants
  const playerID = await playerSummary.methods
    .getPlayerID(board._address, gameID, currentAccount)
    .call();
  const name = "";
  const badge = "P" + playerID;
  const movement = playerStats.movement;
  const totalMovement = 4;
  const agility = playerStats.agility;
  const totalAgility = 4;
  const dexterity = playerStats.dexterity;
  const totalDexterity = 4;
  const campsite = activeInventory.campsite ? "Packed Up" : "Set Up (in game)";
  const leftHand = handInventory.leftHandItem
    ? handInventory.leftHandItem
    : "None";
  const rightHand = handInventory.rightHandItem
    ? handInventory.rightHandItem
    : "None";
  const status = activeInventory.status ? activeInventory.status : "Healthy";
  const artifact = activeInventory.artifact ? activeInventory.artifact : "None";
  const relic = activeInventory.relic ? activeInventory.relic : "None";
  const shield = activeInventory.shield ? "Enabled" : "None";
  const teamRole = "Fearless Leader";
  displayPlayerInfo(
    playerID,
    name,
    badge,
    movement,
    totalMovement,
    agility,
    totalAgility,
    dexterity,
    totalDexterity,
    campsite,
    leftHand,
    rightHand,
    status,
    artifact,
    relic,
    shield,
    teamRole
  );

  /*
  console.log(
    `\nMovement: ${playerStats.movement}, Agility: ${playerStats.agility}, Dexterity: ${playerStats.dexterity}`
  );
  console.log(
    "Campsite:",
    activeInventory.campsite ? "Packed Up" : "Set Up (in game)"
  );
  console.log(
    `Left hand item: ${
      handInventory.leftHandItem ? handInventory.leftHandItem : "None"
    }, Right hand item: ${
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
*/
  //TODO: ensure these values are stored during dig + day phase action
  console.log("\nLast Actions:");
  const lastActions = await summary.methods
    .lastPlayerActions(board._address, gameID)
    .call();
  // console.log(lastActions);
  let displayData = [];
  // console.log("Player Actions:", playerActions);
  lastActions.forEach((summary) => {
    let cleanSummary = {
      playerID: summary.playerID.toString(),
      cardType: summary.cardType,
      cardDrawn: summary.cardDrawn,
      currentAction: summary.currentAction,
      cardResult: summary.cardResult,
      inventoryChanges: summary.inventoryChanges,
      statUpdates: summary.statUpdates,
      movementPath: summary.movementPath
    };
    displayData.push(cleanSummary);
  });
  console.table(displayData);

  const lastDayEvents = await summary.methods
    .lastDayPhaseEvents(board._address, gameID)
    .call();

  let lastDayEventData = [];
  for (let i = 0; i < lastDayEvents.playerIDs.length; i++) {
    const inventoryChanges = lastDayEvents.inventoryChanges[i];
    const inventoryChange =
      inventoryChanges[0] != ""
        ? `Item loss: ${inventoryChanges[0]}`
        : inventoryChanges[1] != ""
        ? `Item gain: ${inventoryChanges[1]}`
        : inventoryChanges[2] != ""
        ? `Item loss: ${inventoryChanges[2]}`
        : "";
    lastDayEventData.push({
      "Player ID": lastDayEvents.playerIDs[i].toString(),
      "Card Type": lastDayEvents.cardTypes[i],
      "Card Drawn": lastDayEvents.cardsDrawn[i],
      Result: lastDayEvents.cardResults[i],
      Inventory: inventoryChange,
      "Stat Updates": lastDayEvents.statUpdates[i]
    });
  }

  console.log("\n Day Time Events:");
  console.table(lastDayEventData);
}
