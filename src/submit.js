import chalk from "chalk";
import inquirer from "inquirer";

import Addresses from "../settings/ContractAddresses.js";
import Contract from "./contract.js";

let currentAccount;
let hexplorationBoard;
let hexplorationController;
let summary;

let inventory;
let submitLeftHand;
let submitRightHand;
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

async function moveToSpace(gameID) {
  // TODO: get this from a contract
  let playerStats = await summary.methods
    .currentPlayerStats(hexplorationBoard._address, gameID)
    .call();
  const maxSpaces = Number(playerStats.movement);
  //
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
  //TODO (maybe): filter list down to only possible spaces within movement
  //let availableSpaces = ["0,0", "0,1", "1,1", "1,0"];

  questions = [];
  for (let i = 0; i < spacesToMove; i++) {
    questions.push({
      type: "list",
      name: `destination${i}`,
      message: "which spaces to move through?",
      choices: availableSpaces,
      default: availableSpaces[0]
    });
  }
  answers = await inquirer.prompt(questions);
  const possibleMovementChoices = [
    answers.destination0,
    answers.destination1,
    answers.destination2,
    answers.destination3,
    answers.destination4,
    answers.destination5,
    answers.destination6,
    answers.destination7,
    answers.destination8,
    answers.destination9
  ];

  const currentSpace = await summary.methods
    .currentLocation(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });

  let movementChoices = [currentSpace];
  for (let i = 0; i < spacesToMove; i++) {
    movementChoices.push(possibleMovementChoices[i]);
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
  // get inventory...
  // save locally to submitLeftHand or submitRightHand
}

async function setupCamp() {
  console.log("Setup camp...");
  // send to queue
  await submitAction("SetupCamp", [""], gameID);
}

async function breakDownCamp() {
  console.log("Break down camp");
  // send to queue
  await submitAction("BreakDownCamp", [""], gameID);
}

async function dig() {
  console.log("Digging...");
  // send to queue
  await submitAction("Dig", [""], gameID);
}

async function rest() {
  console.log("Resting......");
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

  inventory = await summary.methods
    .inactiveInventory(hexplorationBoard._address, gameID)
    .call();
  //console.log(inventory);

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
  // get balance of campsite tokens on zone
  let isAtCampsite = false;

  let hasCampsiteInInventory =
    Number(inventory.itemBalances[inventory.itemTypes.indexOf("Campsite")]) > 0;

  let isOnLandingZone = true;

  let isOnRelicZone = false;

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
      await setupCamp();
      break;
    case "Dig":
      await dig();
      break;
    case "Rest":
      await rest();
      break;
    case "Break down camp":
      await breakDownCamp();
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
