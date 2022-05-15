import chalk from "chalk";
import inquirer from "inquirer";

import { equipItem } from "./equip";

import Addresses from "../settings/ContractAddresses.js";
import Contract from "./contract.js";

let currentAccount;
let hexplorationBoard;
let hexplorationController;
let summary;
//let web3;

async function moveToSpace(gameID) {
  // TODO: get this from a contract
  const maxSpaces = 3;
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
  console.log(`Moving through spaces: ${movementChoices}`);
  try {
    let tx = await hexplorationController.methods
      .moveThroughPath(movementChoices, gameID, hexplorationBoard._address)
      .send({ from: currentAccount, gas: "5000000" });
    console.log("Gas used:", tx.gasUsed);
  } catch (err) {
    console.log(err.message);
  }
}

async function setupCamp() {
  console.log("Setup camp...");
}

async function takeDownCamp() {
  console.log("Take down camp");
}

async function dig() {
  console.log("Digging...");
}

async function rest() {
  console.log("Resting......");
}

async function tradeItems() {
  console.log("Trade items...");
}

async function pickUpItems() {
  console.log("Pick up items...");
}

export async function submitMoves(gameID, provider, account) {
  //web3 = provider;
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];

  hexplorationBoard = await Contract("board", provider);
  hexplorationController = await Contract("controller", provider);
  summary = await Contract("summary", provider);

  let choices = ["Equip item", "Move to space"];
  let isAtCampsite = false;
  let canTrade = false;
  let canPickupItems = false;
  if (isAtCampsite) {
    choices.push("Dig");
    choices.push("Rest");
    choices.push("Take down camp");
  } else {
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
    case "Take down camp":
      await takeDownCamp();
      break;
    case "Equip item":
      await equipItem(gameID, provider, account);
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
