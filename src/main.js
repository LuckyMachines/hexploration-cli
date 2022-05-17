import chalk from "chalk";
import inquirer from "inquirer";
import { showMap } from "./map";
import { progressPhase } from "./phase";
import { submitMoves } from "./submit";
import { playerInfo } from "./player";
import { chooseLandingSite } from "./landingSite";
import { viewQueue } from "./queue";
import Provider from "./provider";
import Contract from "./contract.js";

let web3; // provider
let accounts;
let currentAccount;
let gameRegistry;
let gameBoard;
let gameController;
let gameSummary;
let landingSiteSet;
let adminMode = false;

async function mainMenu(gameID) {
  const questions = [];
  let choices = landingSiteSet
    ? ["Submit Move", "View Map", "Player Info"]
    : ["Choose Landing Site", "View Map"];
  if (adminMode) {
    choices.push("Progress Phase");
    choices.push("View Queue");
  }
  choices.push("Exit");
  questions.push({
    type: "list",
    name: "choice",
    message: `\n${chalk.blue.underline("Dashboard")}`,
    choices: choices,
    default: "Submit Move"
  });

  const answers = await inquirer.prompt(questions);
  switch (answers.choice) {
    case "Submit Move":
      await submitMoves(gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Player Info":
      await playerInfo(gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "View Map":
      await showMap(gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Progress Phase":
      await progressPhase(gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Choose Landing Site":
      await chooseLandingSite(gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "View Queue":
      await viewQueue(gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Exit":
      console.log("Goodbye!");
      process.exit();
      break;
    default:
      break;
  }
  return true;
}

async function registerPlayerIfNeeded(gameID) {
  let isRegistered = await gameSummary.methods
    .isRegistered(gameBoard._address, gameID, currentAccount)
    .call();

  if (!isRegistered) {
    console.log(`Registering player: ${currentAccount}`);
    try {
      await gameController.methods
        .registerForGame(gameID, gameBoard._address)
        .send({ from: currentAccount, gas: "5000000" });
    } catch (err) {
      console.log("Error registering:", err.message);
    }
  }

  isRegistered = await gameSummary.methods
    .isRegistered(gameBoard._address, gameID, currentAccount)
    .call();
  if (isRegistered) {
    console.log("Player registered. Entering game.");
    console.log(`${chalk.cyan.bold("\nPlaying Hexploration via CLI")}`);
    console.log(`${chalk.green.bold("Game ID:")} ${gameID}`);
    console.log(`${chalk.blue.bold("Player:")} ${currentAccount}`);
    console.log(`${adminMode ? chalk.red.bold("Admin mode enabled") : ""}`);
  } else {
    console.log("Unable to register player.");
    process.exit();
  }
}

async function checkForLandingSite(gameID) {
  // board . mapping(uint256 => string) public initialPlayZone;
  if (!landingSiteSet) {
    const initialPlayZone = await gameBoard.methods
      .initialPlayZone(gameID)
      .call();
    //console.log("Initial play zone:", initialPlayZone);
    landingSiteSet = initialPlayZone != "";
  }
}

async function registerNewGame() {
  await gameController.methods
    .requestNewGame(gameRegistry._address, gameBoard._address)
    .send({ from: currentAccount, gas: "2000000" });
  let newGameID = gameController.methods
    .latestGame(gameRegistry._address, gameBoard._address)
    .call();
  return newGameID;
}

export async function runCLI(options) {
  web3 = await Provider();
  accounts = await web3.eth.getAccounts();
  adminMode = options.adminMode;

  let overrideWallet = false;
  if (options.walletIndex) {
    if (options.walletIndex < accounts.length) {
      overrideWallet = true;
    }
  }
  currentAccount = overrideWallet ? accounts[options.walletIndex] : accounts[0];

  gameSummary = await Contract("summary", web3);
  gameBoard = await Contract("board", web3);
  gameRegistry = await Contract("registry", web3);
  gameController = await Contract("controller", web3);

  let gameID;
  if (options.newGame) {
    gameID = await registerNewGame();
  } else {
    gameID = options.gameID;
  }

  // check that game is registered
  const latestGame = await gameRegistry.methods
    .latestGame(gameBoard._address)
    .call();
  //console.log("Latest Game:", latestGame);

  if (gameID != 0 && Number(latestGame) >= Number(gameID)) {
    await registerPlayerIfNeeded(gameID);
    await checkForLandingSite(gameID);

    await mainMenu(gameID);
  } else {
    console.log("Game ID not found.");
    process.exit();
  }
}
