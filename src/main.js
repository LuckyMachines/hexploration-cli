import chalk from "chalk";
import inquirer from "inquirer";
import { showMap } from "./map";
import { progressPhase } from "./phase";
import { submitMoves } from "./submit";
import { playerInfo } from "./player";
import { chooseLandingSite } from "./landingSite";
import GameRegistry from "@luckymachines/game-core/contracts/abi/v0.0/GameRegistry.json";
import PlayerRegistry from "@luckymachines/game-core/contracts/abi/v0.0/PlayerRegistry.json";
import GameBoard from "hexploration/build/contracts/HexplorationBoard.json";
import Provider from "./provider";
import Addresses from "../settings/ContractAddresses.js";

let web3; // provider
let accounts;
let currentAccount;
let gameRegistry;
let gameBoard;
let playerRegistry;
let landingSiteSet;

async function mainMenu(gameID) {
  const questions = [];
  const choices = landingSiteSet
    ? ["Submit Move", "View Map", "Player Info", "Progress Phase", "Exit"]
    : ["Choose Landing Site", "View Map", "Exit"];
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
      await mainMenu(gameID);
      break;
    case "Player Info":
      await playerInfo(gameID, web3, currentAccount);
      await mainMenu(gameID);
      break;
    case "View Map":
      await showMap(gameID, web3, currentAccount);
      await mainMenu(gameID);
      break;
    case "Progress Phase":
      await progressPhase(gameID, web3, currentAccount);
      await mainMenu(gameID);
      break;
    case "Choose Landing Site":
      await chooseLandingSite(gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
    case "Exit":
      console.log("Exiting...");
      process.exit();
      break;
    default:
      break;
  }
  return true;
}

async function registerPlayerIfNeeded(gameID) {
  const playerRegistryAddress = Addresses.GANACHE_PLAYER_REGISTRY;
  playerRegistry = new web3.eth.Contract(PlayerRegistry, playerRegistryAddress);

  let isRegistered = await playerRegistry.methods
    .isRegistered(gameID, currentAccount)
    .call();

  if (!isRegistered) {
    console.log(`Registering player: ${currentAccount}`);
    try {
      await playerRegistry.methods
        .register(gameID)
        .send({ from: currentAccount, gas: "5000000" });
    } catch (err) {
      console.log("Error registering:", err.message);
    }
  }

  isRegistered = await playerRegistry.methods
    .isRegistered(gameID, currentAccount)
    .call();
  if (isRegistered) {
    console.log("Player registered. Entering game.");
    console.log(`${chalk.cyan.bold("\nPlaying Hexploration via CLI")}`);
    console.log(`${chalk.green.bold("Game ID:")} ${gameID}`);
    console.log(`${chalk.blue.bold("Player:")} ${currentAccount}\n`);
  } else {
    console.log("Unable to register player.");
    process.exit();
  }
}

async function checkForLandingSite(gameID) {
  // board . mapping(uint256 => string) public initialPlayZone;
  const initialPlayZone = await gameBoard.methods
    .initialPlayZone(gameID)
    .call();
  console.log("Initial play zone:", initialPlayZone);
  landingSiteSet = initialPlayZone != "";
}

export async function runCLI(options) {
  web3 = await Provider();
  accounts = await web3.eth.getAccounts();
  let overrideWallet = false;
  if (options.walletIndex) {
    if (options.walletIndex < accounts.length) {
      overrideWallet = true;
    }
  }
  currentAccount = overrideWallet ? accounts[options.walletIndex] : accounts[0];

  const gameRegistryAddress = Addresses.GANACHE_GAME_REGISTRY;
  const gameBoardAddress = Addresses.GANACHE_HEXPLORATION_BOARD;
  gameBoard = new web3.eth.Contract(GameBoard.abi, gameBoardAddress);
  gameRegistry = new web3.eth.Contract(GameRegistry, gameRegistryAddress);
  // check that game is registered
  const latestGame = await gameRegistry.methods
    .latestGame(gameBoardAddress)
    .call();
  //console.log("Latest Game:", latestGame);

  if (options.gameID != 0 && Number(latestGame) >= Number(options.gameID)) {
    await registerPlayerIfNeeded(options.gameID);
    await checkForLandingSite(options.gameID);
    // TODO: check game status, if 0 or 1, run loop until finished.
    await mainMenu(options.gameID);
  } else {
    console.log("Game ID not found.");
    process.exit();
  }
}
