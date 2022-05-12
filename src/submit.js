import chalk from "chalk";
import inquirer from "inquirer";
import HexplorationBoard from "hexploration/build/contracts/HexplorationBoard.json";
import HexplorationController from "hexploration/build/contracts/HexplorationController.json";
import Addresses from "../settings/ContractAddresses.js";

let currentAccount;
let hexplorationBoard;
let hexplorationController;
let web3;

async function moveToSpace() {
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
  let movementChoices = [];
  for (let i = 0; i < spacesToMove; i++) {
    movementChoices.push(possibleMovementChoices[i]);
  }
  console.log(`Moving through spaces: ${movementChoices}`);

  // submit movement choices to controller
}

async function setupCamp() {
  console.log("Setup camp...");
}

async function campsiteActivity() {
  console.log("Campsite activity...");
}

async function equipItem() {
  console.log("Equip item...");
}

async function tradeItems() {
  console.log("Trade items...");
}

export async function submitMoves(gameID, provider, account) {
  web3 = provider;
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];

  hexplorationBoard = new provider.eth.Contract(
    HexplorationBoard.abi,
    Addresses.GANACHE_HEXPLORATION_BOARD
  );
  hexplorationController = new provider.eth.Contract(
    HexplorationController.abi,
    Addresses.GANACHE_HEXPLORATION_CONTROLLER
  );

  const questions = [];
  questions.push({
    type: "list",
    name: "move",
    message: "Which move do you want to make?",
    choices: [
      "Move to space",
      "Setup camp",
      "Campsite activity",
      "Equip item",
      "Trade items",
      "Cancel"
    ],
    default: "Move to space"
  });
  const answers = await inquirer.prompt(questions);
  switch (answers.move) {
    case "Move to space":
      await moveToSpace();
      break;
    case "Setup camp":
      await setupCamp();
      break;
    case "Campsite activity":
      await campsiteActivity();
      break;
    case "Equip item":
      await equipItem();
      break;
    case "Trade items":
      await tradeItems();
      break;
    case "Cancel":
    default:
      console.log("Cancel move.");
      break;
  }
}
