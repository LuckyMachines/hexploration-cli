import chalk from "chalk";
import inquirer from "inquirer";

import Addresses from "../settings/ContractAddresses.js";
import Contract from "./contract.js";

let currentAccount;
let hexplorationBoard;
let hexplorationController;
let summary;

let inventory;
let activeInventory;
let submitLeftHand;
let submitRightHand;

let currentSpace;
//let web3;

async function submitAction(action, options, gameID) {
  const lh = submitLeftHand ? submitLeftHand : "";
  const rh = submitRightHand ? submitRightHand : "";
  const ActionType = [
    "Idle",
    "Move",
    "SetupCamp",
    "BreakDownCamp",
    "Dig",
    "Rest",
    "Help"
  ];
  const actionEnum = ActionType.indexOf(action);
  const pid = await summary.methods
    .getPlayerID(hexplorationBoard._address, gameID, currentAccount)
    .call();

  console.log(`Submitting ${action} action:`);
  console.log(
    `playerID: ${pid}\nactionIndex:${actionEnum}\noptions:${options}\nlh:${lh} rh:${rh}`
  );
  await hexplorationController.methods
    .submitAction(
      pid,
      actionEnum,
      options,
      lh,
      rh,
      gameID,
      hexplorationBoard._address
    )
    .send({ from: currentAccount, gas: "5000000" });
  console.log(`${action} action submitted to queue`);
}

function getAvailableSpaceChoices(currentSpace, allSpaces, maxMovement) {
  const curX = Number(currentSpace.split(",")[0]);
  const curY = Number(currentSpace.split(",")[1]);
  // let possibleXs = [Number(curX) - 1, Number(curX), Number(curX) + 1];
  // let possibleYs = [Number(curY) - 1, Number(curY), Number(curY) + 1];
  let evenPossibleChoices = [
    `${curX},${curY - 1}`,
    `${curX - 1},${curY}`,
    `${curX - 1},${curY + 1}`,
    `${curX},${curY + 1}`,
    `${curX + 1},${curY + 1}`,
    `${curX + 1},${curY}`
  ];
  let oddPossibleChoices = [
    `${curX},${curY - 1}`,
    `${curX - 1},${curY - 1}`,
    `${curX - 1},${curY}`,
    `${curX},${curY + 1}`,
    `${curX + 1},${curY}`,
    `${curX + 1},${curY - 1}`
  ];
  let possibleChoices =
    curX % 2 == 0 ? evenPossibleChoices : oddPossibleChoices;
  //console.log("Possible choices:", possibleChoices);

  let availablePossibleChoices = [];
  // Close, but need to do different stuff for even / odd columns
  for (let i = 0; i < possibleChoices.length; i++) {
    if (
      allSpaces.indexOf(possibleChoices[i]) > -1 &&
      possibleChoices[i] != `${curX},${curY}`
    ) {
      availablePossibleChoices.push(possibleChoices[i]);
    }
  }

  return availablePossibleChoices;
}

async function moveToSpace(gameID) {
  let playerStats = await summary.methods
    .currentPlayerStats(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });
  const maxSpaces = Number(playerStats.movement);
  //
  // console.log("Player stats:", playerStats);
  // console.log("Max spaces:", maxSpaces);
  let spaceChoices = [];
  for (let i = 0; i < maxSpaces; i++) {
    spaceChoices.push(`${i + 1}`);
  }
  let questions = [];
  questions.push({
    type: "list",
    name: "spacesToMove",
    message: "How many spaces do you want to move?",
    choices: spaceChoices,
    default: spaceChoices[0]
  });
  let answers = await inquirer.prompt(questions);
  const spacesToMove = answers.spacesToMove;
  console.log(`Moving ${spacesToMove}`);

  const availableSpaces = await hexplorationBoard.methods
    .getZoneAliases()
    .call();

  currentSpace = await summary.methods
    .currentLocation(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });

  let movementChoices = [];
  // TODO: update to get available space choices from function
  let availableSpaceChoices = getAvailableSpaceChoices(
    currentSpace,
    availableSpaces,
    maxSpaces
  );

  for (let i = 0; i < spacesToMove; i++) {
    // update to show available choices only after each choice made
    answers = await inquirer.prompt({
      type: "list",
      name: `destination`,
      message: "which spaces to move through?",
      choices: availableSpaceChoices,
      default: availableSpaceChoices[0]
    });
    movementChoices.push(answers.destination);
    if (i < spacesToMove - 1) {
      availableSpaceChoices = getAvailableSpaceChoices(
        answers.destination,
        availableSpaces,
        maxSpaces - (i + 1)
      );
    } // otherwise is at last space choice, doesn't need to update this
  }

  await submitAction("Move", movementChoices, gameID);
  //console.log(`Moving through spaces: ${movementChoices}`);
  // try {
  //   let tx = await hexplorationController.methods
  //     .moveThroughPath(movementChoices, gameID, hexplorationBoard._address)
  //     .send({ from: currentAccount, gas: "5000000" });
  //   console.log("Gas used:", tx.gasUsed);
  // } catch (err) {
  //   console.log(err.message);
  // }
}

async function equipItem(gameID) {
  console.log("Equip item...");

  let inventoryChoices = [];
  let excluded = ["Campsite"];
  if (submitLeftHand) {
    excluded.push(submitLeftHand);
  }
  if (submitRightHand) {
    excluded.push(submitRightHand);
  }
  for (let i = 0; i < inventory.itemBalances.length; i++) {
    if (
      Number(inventory.itemBalances[i]) > 0 &&
      excluded.indexOf(inventory.itemTypes[i]) < 0
    ) {
      inventoryChoices.push(inventory.itemTypes[i]);
    }
  }
  inventoryChoices.push("Clear hand");

  let questions = [];
  questions.push({
    type: "list",
    name: "handToUse",
    message: "Which hand?",
    choices: ["Left", "Right"],
    default: "Left"
  });
  questions.push({
    type: "list",
    name: "itemToEquip",
    message: "Which item?",
    choices: inventoryChoices,
    default: inventoryChoices[0]
  });

  let answers = await inquirer.prompt(questions);

  if (answers.itemToEquip != "Clear hand") {
    console.log(
      `Equipping ${answers.itemToEquip} to ${answers.handToUse} hand`
    );
  } else {
    console.log(`Clearing ${answers.handToUse} hand`);
  }
  if (answers.handToUse == "Left") {
    submitLeftHand =
      answers.itemToEquip != "Clear hand" ? answers.itemToEquip : "none";
  } else {
    submitRightHand =
      answers.itemToEquip != "Clear hand" ? answers.itemToEquip : "none";
  }
  //console.log(`LH: ${submitLeftHand}, RH: ${submitRightHand}`);
}

async function setupCamp(gameID) {
  console.log("Setup camp...");
  // send to queue
  await submitAction("SetupCamp", [""], gameID);
}

async function breakDownCamp(gameID) {
  console.log("Break down camp");
  // send to queue
  await submitAction("BreakDownCamp", [""], gameID);
}

async function dig(gameID) {
  console.log("Digging...");
  // send to queue
  await submitAction("Dig", [""], gameID);
}

async function rest(gameID) {
  console.log("Resting......");
  // TODO:
  // Choose which attribute to rest
  await submitAction("Rest", [""], gameID);
}

/*
async function tradeItems() {
  console.log("Trade items...");
  // send to queue??
}

async function pickUpItems() {
  console.log("Pick up items...");
  // immediate action??
}
*/

export async function submitMoves(gameID, provider, account) {
  //web3 = provider;
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];

  hexplorationBoard = await Contract("board", provider);
  hexplorationController = await Contract("controller", provider);
  summary = await Contract("summary", provider);

  //////////////////
  // TEST METHOD //
  // Remove before deployment
  ////////////////////
  // await hexplorationController.methods
  //   .getTestInventory(gameID, hexplorationBoard._address)
  //   .send({
  //     from: currentAccount,
  //     gas: "5000000"
  //   });

  inventory = await summary.methods
    .inactiveInventory(hexplorationBoard._address, gameID)
    .call();
  //console.log(inventory);

  activeInventory = await summary.methods
    .activeInventory(hexplorationBoard._address, gameID)
    .call();

  let choices = ["Move to space"];

  let hasItems = false;
  for (let i = 0; i < inventory.itemBalances.length; i++) {
    if (
      i != inventory.itemTypes.indexOf("Campsite") &&
      Number(inventory.itemBalances[i]) > 0
    ) {
      hasItems = true;
      break;
    }
  }
  // TODO:
  // check if already at campsite

  const landingSite = await summary.methods
    .landingSite(hexplorationBoard._address, gameID)
    .call();
  if (!currentSpace) {
    currentSpace = await summary.methods
      .currentLocation(hexplorationBoard._address, gameID)
      .call({ from: currentAccount });
  }

  let isAtCampsite = await summary.methods
    .isAtCampsite(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });

  let isOnLandingZone = currentSpace == landingSite;
  let isOnRelicZone = false;

  let hasCampsiteInInventory = activeInventory.campsite;

  //////////////////////////
  // Not doing these yet
  let canTrade = false;
  let canPickupItems = false;
  //////////////////////////
  if (hasItems) {
    choices.push("Equip item");
  }
  if (isAtCampsite) {
    choices.push("Dig");
    choices.push("Rest");
    choices.push("Break down camp");
  } else if (hasCampsiteInInventory && !isOnLandingZone && !isOnRelicZone) {
    choices.push("Setup camp");
  }
  if (canPickupItems) {
    choices.push("Pick up items");
  }
  if (canTrade) {
    choices.push("Trade items");
  }
  choices.push("Cancel");
  const questions = [];
  questions.push({
    type: "list",
    name: "move",
    message: "Which move do you want to make?",
    choices: choices,
    default: "Move to space"
  });
  const answers = await inquirer.prompt(questions);
  switch (answers.move) {
    case "Move to space":
      await moveToSpace(gameID);
      break;
    case "Setup camp":
      await setupCamp(gameID);
      break;
    case "Dig":
      await dig(gameID);
      break;
    case "Rest":
      await rest(gameID);
      break;
    case "Break down camp":
      await breakDownCamp(gameID);
      break;
    case "Equip item":
      await equipItem(gameID);
      break;
    case "Trade items":
      await tradeItems();
      break;
    case "Pick up items":
      await pickUpItems();
      break;
    case "Cancel":
    default:
      console.log("Cancel move.");
      break;
  }
}
