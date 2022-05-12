import chalk from "chalk";
import inquirer from "inquirer";
import { showMap } from "./map";
import { progressPhase } from "./phase";
import { submitMoves } from "./submit";
import { playerInfo } from "./player";
import GameRegistry from "@luckymachines/game-core/contracts/abi/v0.0/GameRegistry.json";
import PlayerRegistry from "@luckymachines/game-core/contracts/abi/v0.0/PlayerRegistry.json";
import Provider from "./provider";
import Addresses from "../settings/ContractAddresses.js";
import fs from "fs";

let web3; // provider
let accounts;

async function mainMenu(gameID) {
  console.log(`${chalk.cyan.bold("\nPlaying Hexploration via CLI")}`);
  console.log(`${chalk.green.bold("Game ID:")} ${gameID}`);
  console.log(`${chalk.blue.bold("Player:")} ${accounts[0]}\n`);

  const questions = [];
  questions.push({
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "Submit Move",
      "View Map",
      "Player Info",
      "Progress Phase",
      "Exit"
    ],
    default: "Submit Move"
  });

  const answers = await inquirer.prompt(questions);
  switch (answers.choice) {
    case "Submit Move":
      await submitMoves(gameID, web3);
      await mainMenu(gameID);
      break;
    case "Player Info":
      await playerInfo(gameID, web3);
      await mainMenu(gameID);
      break;
    case "View Map":
      await showMap(gameID, web3);
      await mainMenu(gameID);
      break;
    case "Progress Phase":
      await progressPhase(gameID, web3);
      await mainMenu(gameID);
      break;
    case "Exit":
      console.log("Exiting...");
      process.exit();
      break;
    default:
      break;
  }
  return true;
}

export async function runCLI(options) {
  web3 = await Provider();
  accounts = await web3.eth.getAccounts();
  // check that game is registered
  const gameRegistryAddress = Addresses.GANACHE_GAME_REGISTRY;
  const playerRegistryAddress = Addresses.GANACHE_PLAYER_REGISTRY;
  const gameBoardAddress = Addresses.GANACHE_HEXPLORATION_BOARD;

  const gameRegistry = new web3.eth.Contract(GameRegistry, gameRegistryAddress);
  const latestGame = await gameRegistry.methods
    .latestGame(gameBoardAddress)
    .call();
  //console.log("Latest Game:", latestGame);

  if (options.gameID != 0 && Number(latestGame) >= Number(options.gameID)) {
    const playerRegistry = new web3.eth.Contract(
      PlayerRegistry,
      playerRegistryAddress
    );

    let isRegistered = await playerRegistry.methods
      .isRegistered(options.gameID, accounts[0])
      .call();

    if (isRegistered) {
      await mainMenu(options.gameID);
    } else {
      console.log(`Registering player: ${accounts[0]}`);
      try {
        await playerRegistry.methods
          .register(options.gameID)
          .send({ from: accounts[0], gas: "5000000" });
      } catch (err) {
        console.log("Error registering:", err.message);
      }
      isRegistered = await playerRegistry.methods
        .isRegistered(options.gameID, accounts[0])
        .call();
      if (isRegistered) {
        console.log("Player registered. Entering game.");
        await mainMenu(options.gameID);
      } else {
        console.log("Unable to register player.");
        process.exit();
      }
    }
  } else {
    console.log("Game ID not found.");
    process.exit();
  }
}
