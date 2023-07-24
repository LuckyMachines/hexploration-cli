import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract";
import { displayPlayerInfo, displayCard } from "./playerInfo";

let currentAccount;
let summary;
let playerSummary;
let board;
let eventDeck;
let ambushDeck;
let treasureDeck;

const ACTION = [
  "Idle",
  "Move",
  "Setup Camp",
  "Break Down Camp",
  "Dig",
  "Rest",
  "Help"
];

const ROLL_TYPE = ["Movement", "Agility", "Dexterity", "None"];

export async function playerInfo(network, gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  // console.log("Getting player info for game:", gameID);
  summary = await Contract(network, "summary", provider);
  playerSummary = await Contract(network, "playerSummary", provider);
  board = await Contract(network, "board", provider);
  eventDeck = await Contract(network, "eventDeck", provider);
  ambushDeck = await Contract(network, "ambushDeck", provider);
  treasureDeck = await Contract(network, "treasureDeck", provider);
  // console.log("Event deck:", eventDeck._address);
  // console.log("Ambush deck:", ambushDeck._address);
  // console.log("Treasure deck:", treasureDeck._address);

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

  const cardDecks = {
    Event: eventDeck,
    Ambush: ambushDeck,
    Treasure: treasureDeck
  };

  const summaryFromEventSummary = async (eventSummary) => {
    let hasCard =
      eventSummary.cardType != "" && eventSummary.cardDrawn != "None";

    const lastActionDeck = hasCard ? cardDecks[eventSummary.cardType] : null;
    // console.log(`lastActionDeck is defined: ${lastActionDeck !== undefined}`);
    // console.log(`cardType: ${eventSummary.cardType}`);

    const lastActionCardDetail = hasCard
      ? await lastActionDeck.methods.description(eventSummary.cardDrawn).call()
      : "";
    // console.log(`lastActionCardDetail: ${lastActionCardDetail}`);

    const lastActionCardOutcomes = hasCard
      ? await lastActionDeck.methods
          .getOutcomeDescription(eventSummary.cardDrawn)
          .call()
      : ["", "", ""]; // strings
    // console.log(`lastActionCardOutcomes: ${lastActionCardOutcomes}`);

    const lastActionCardRollThresholds = hasCard
      ? await lastActionDeck.methods
          .getRollThresholds(eventSummary.cardDrawn)
          .call()
      : [0, 0, 0]; // uints
    // console.log(
    //   `lastActionCardRollThresholds: ${lastActionCardRollThresholds}`
    // );

    const lastActionCardRollTypeRequired = hasCard
      ? await lastActionDeck.methods
          .getRollTypeRequired(eventSummary.cardDrawn)
          .call()
      : 0; // uint
    // console.log(
    //   `lastActionCardRollTypeRequired: ${lastActionCardRollTypeRequired}`
    // );

    let finalSummary = hasCard
      ? {
          playerID: eventSummary.playerID.toString(),
          hasCard: hasCard,
          cardType: eventSummary.cardType,
          cardTitle: eventSummary.cardDrawn,
          cardText: lastActionCardDetail,
          cardResult: eventSummary.cardResult,
          cardOutcomes: lastActionCardOutcomes,
          cardRollThresholds: lastActionCardRollThresholds,
          cardRollType: ROLL_TYPE[Number(lastActionCardRollTypeRequired)],
          cardOutcomeIndex:
            eventSummary.cardResult == lastActionCardOutcomes[0]
              ? 0
              : eventSummary.cardResult == lastActionCardOutcomes[1]
              ? 1
              : eventSummary.cardResult == lastActionCardOutcomes[2]
              ? 2
              : -1,
          currentAction: ACTION[Number(eventSummary.currentAction)],
          inventoryChanges: eventSummary.inventoryChanges,
          statUpdates: eventSummary.statUpdates,
          movementPath: eventSummary.movementPath
        }
      : {
          playerID: eventSummary.playerID.toString(),
          hasCard: hasCard,
          cardType: "",
          cardTitle: "",
          cardText: "",
          cardResult: "",
          cardOutcomes: "",
          cardRollThresholds: 0,
          cardRollType: "",
          cardOutcomeIndex: -1,
          currentAction: ACTION[Number(eventSummary.currentAction)],
          inventoryChanges: eventSummary.inventoryChanges,
          statUpdates: eventSummary.statUpdates,
          movementPath: eventSummary.movementPath
        };

    // console.log("Final summary:", finalSummary);
    return finalSummary;
  };

  const lastActions = await summary.methods
    .lastPlayerActions(board._address, gameID)
    .call();
  // // Display last actions as table
  // // console.log(lastActions);
  // let displayData = [];
  // // console.log("Player Actions:", playerActions);
  // lastActions.forEach((summary) => {
  //   let cleanSummary = {
  //     playerID: summary.playerID.toString(),
  //     cardType: summary.cardType,
  //     cardDrawn: summary.cardDrawn,
  //     currentAction: summary.currentAction,
  //     cardResult: summary.cardResult,
  //     inventoryChanges: summary.inventoryChanges,
  //     statUpdates: summary.statUpdates,
  //     movementPath: summary.movementPath
  //   };
  //   displayData.push(cleanSummary);
  // });
  // console.table(displayData);

  let lastActionSummary;
  for (let i = 0; i < lastActions.length; i++) {
    const laSummary = lastActions[i];
    if (laSummary.playerID == playerID) {
      lastActionSummary = await summaryFromEventSummary(laSummary);
      break;
    }
  }

  // console.log("Last Action summary:", lastActionSummary);
  // console.log("pre-displayCard");
  if (lastActionSummary.hasCard) {
    // console.log("displayCard");
    displayCard(lastActionSummary);
  }
  // console.log("post-displayCard");

  //[item loss, item gain, hand loss]
  if (
    lastActionSummary.inventoryChanges &&
    lastActionSummary.inventoryChanges.length >= 3
  ) {
    if (lastActionSummary.inventoryChanges[0] != "") {
      console.log("Item loss:", lastActionSummary.inventoryChanges[0]);
    }
    if (lastActionSummary.inventoryChanges[1] != "") {
      console.log("Item gain:", lastActionSummary.inventoryChanges[1]);
    }
    if (lastActionSummary.inventoryChanges[2] != "") {
      console.log("Hand loss:", lastActionSummary.inventoryChanges[2]);
    }
  } else {
    console.log("Inventory changes is undefined");
  }

  // console.log("Stat Updates:", lastActionSummary.statUpdates);
  // check if statUpdates is defined and has at least 3 elements
  if (
    lastActionSummary.statUpdates &&
    lastActionSummary.statUpdates.length >= 3
  ) {
    if (
      lastActionSummary.statUpdates[0] != 0 ||
      lastActionSummary.statUpdates[1] != 0 ||
      lastActionSummary.statUpdates[2] != 0
    ) {
      console.log("Stat Updates:");
    }
    if (lastActionSummary.statUpdates[0] > 0) {
      console.log(`Movement: +${lastActionSummary.statUpdates[0]}`);
    } else if (lastActionSummary.statUpdates[0] < 0) {
      console.log(`Movement: ${lastActionSummary.statUpdates[0]}`);
    }

    if (lastActionSummary.statUpdates[1] > 0) {
      console.log(`Agility: +${lastActionSummary.statUpdates[1]}`);
    } else if (lastActionSummary.statUpdates[1] < 0) {
      console.log(`Agility: ${lastActionSummary.statUpdates[1]}`);
    }

    if (lastActionSummary.statUpdates[2] > 0) {
      console.log(`Dexterity: +${lastActionSummary.statUpdates[2]}`);
    } else if (lastActionSummary.statUpdates[2] < 0) {
      console.log(`Dexterity: ${lastActionSummary.statUpdates[2]}`);
    }
  }

  // TODO: only display the following immediately after a day phase event

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
