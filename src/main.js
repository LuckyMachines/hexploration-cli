import chalk from "chalk";
import inquirer from "inquirer";
import { showMap } from "./map";
import { progressPhase } from "./phase";
import { submitMoves } from "./submit";
import { playerInfo } from "./player";
import GameRegistry from "@luckymachines/game-core/contracts/abi/v0.0/GameRegistry.json";
import Provider from "./provider";
import fs from "fs";

let web3; // provider

async function mainMenu(gameID) {
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
  // if game exists
  // if player is registered
  if (options.gameID != 0) {
    console.log("\n%s Hexploration via CLI", chalk.green.bold("Playing"));
    console.log(`${chalk.green.bold("Game ID:")} ${options.gameID}\n`);
    await mainMenu(options.gameID);
  }
}
