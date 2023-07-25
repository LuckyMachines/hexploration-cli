import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract";
import {
  displayPlayerInfo,
  displayCard,
  displayCards,
  displayStats
} from "./playerInfo";

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
  // TODO: get total movement / agility / dexterity from contracts

  const playerProfile = {
    playerID: playerID,
    name: "",
    badge: "P" + playerID,
    movement: playerStats.movement,
    totalMovement: 4,
    agility: playerStats.agility,
    totalAgility: 4,
    dexterity: playerStats.dexterity,
    totalDexterity: 4,
    campsite: activeInventory.campsite ? "Packed Up" : "Set Up (in game)",
    leftHand: handInventory.leftHandItem ? handInventory.leftHandItem : "None",
    rightHand: handInventory.rightHandItem
      ? handInventory.rightHandItem
      : "None",
    status: activeInventory.status ? activeInventory.status : "Healthy",
    artifact: activeInventory.artifact ? activeInventory.artifact : "None",
    relic: activeInventory.relic ? activeInventory.relic : "None",
    shield: activeInventory.shield ? "Enabled" : "None",
    teamRole: "Fearless Leader"
  };

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
    let lastActionCardDetail = "";
    let lastActionCardOutcomes = ["", "", ""];
    let lastActionCardRollThresholds = [0, 0, 0];
    let lastActionCardRollTypeRequired = 0;
    if (lastActionDeck) {
      lastActionCardDetail = await lastActionDeck.methods
        .description(eventSummary.cardDrawn)
        .call();

      // console.log(`lastActionCardDetail: ${lastActionCardDetail}`);

      lastActionCardOutcomes = await lastActionDeck.methods
        .getOutcomeDescription(eventSummary.cardDrawn)
        .call();
      // console.log(`lastActionCardOutcomes: ${lastActionCardOutcomes}`);

      lastActionCardRollThresholds = await lastActionDeck.methods
        .getRollThresholds(eventSummary.cardDrawn)
        .call();
      // console.log(
      //   `lastActionCardRollThresholds: ${lastActionCardRollThresholds}`
      // );

      lastActionCardRollTypeRequired = await lastActionDeck.methods
        .getRollTypeRequired(eventSummary.cardDrawn)
        .call();
      // console.log(
      //   `lastActionCardRollTypeRequired: ${lastActionCardRollTypeRequired}`
      // );
    }

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
          inventoryChanges: eventSummary.inventoryChanges
            ? eventSummary.inventoryChanges
            : ["", "", ""],
          statUpdates: eventSummary.statUpdates
            ? eventSummary.statUpdates
            : [0, 0, 0],
          movementPath: eventSummary.movementPath
            ? eventSummary.movementPath
            : []
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
  console.log("Player Action:");
  console.log(lastActionSummary.currentAction);
  switch (lastActionSummary.currentAction) {
    case "Move":
      // console.log(`Movement Path: ${lastActionSummary.movementPath}`);
      break;
    case "Setup Camp":
      break;
    case "Break Down Camp":
      break;
    case "Dig":
      break;
    case "Rest":
      // TODO: get rest options
      break;
    case "Help":
      // TODO: get help options
      break;
    default:
      break;
  }

  // TODO: list player inventory

  // console.log("Last Action summary:", lastActionSummary);
  // console.log("pre-displayCard");

  if (
    lastActionSummary &&
    lastActionSummary.hasCard &&
    lastActionSummary.cardType != "None"
  ) {
    // console.log("displayCard");
    displayCard(lastActionSummary);
  }
  displayStats(lastActionSummary);
  // console.log("post-displayCard");

  //[item loss, item gain, hand loss]

  // TODO: only display the following immediately after a day phase event

  // Note: this uses the old array format, not an EventSummary struct
  /*
  returns (
            uint256[] memory playerIDs,
            string[] memory cardTypes,
            string[] memory cardsDrawn,
            string[] memory cardResults,
            string[3][] memory inventoryChanges,
            int8[3][] memory statUpdates
        )
  */
  const lastDayEvents = await summary.methods
    .lastDayPhaseEvents(board._address, gameID)
    .call();

  let lastDayEventData = [];

  for (let i = 0; i < lastDayEvents.playerIDs.length; i++) {
    const inventoryChanges = lastDayEvents.inventoryChanges[i];
    // const inventoryChange =
    //   inventoryChanges[0] != ""
    //     ? `Item loss: ${inventoryChanges[0]}`
    //     : inventoryChanges[1] != ""
    //     ? `Item gain: ${inventoryChanges[1]}`
    //     : inventoryChanges[2] != ""
    //     ? `Item loss: ${inventoryChanges[2]}`
    //     : "";
    lastDayEventData.push({
      playerID: lastDayEvents.playerIDs[i].toString(),
      cardType: lastDayEvents.cardTypes[i],
      cardDrawn: lastDayEvents.cardsDrawn[i],
      cardResult: lastDayEvents.cardResults[i],
      inventoryChanges: inventoryChanges,
      statUpdates: lastDayEvents.statUpdates[i]
    });
  }

  let lastDayEventSummary;
  for (let i = 0; i < lastDayEventData.length; i++) {
    const ldeSummary = lastDayEventData[i];
    if (ldeSummary.playerID == playerID) {
      lastDayEventSummary = await summaryFromEventSummary(ldeSummary);
      break;
    }
  }

  // console.table(lastDayEventData);

  if (
    lastDayEventSummary &&
    lastDayEventSummary.hasCard &&
    lastDayEventSummary.cardType != "None"
  ) {
    console.log("\n Day Time Events:");
    displayCard(lastDayEventSummary);
    displayStats(lastDayEventSummary);
  }

  displayPlayerInfo(playerProfile);
}
