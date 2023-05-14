import arg from "arg";
import inquirer from "inquirer";
import { runCLI } from "./main";
import Contract from "./contract";
import Provider from "./provider";

let web3;
let accounts;
let summary;
let playerSummary;
let board;
let registry;

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--newGame": Boolean,
      "--adminMode": Boolean,
      "--showGas": Boolean,
      "-n": "--newGame",
      "-a": "--adminMode",
      "-g": "--showGas",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    newGame: args["--newGame"] || false,
    adminMode: args["--adminMode"] || false,
    gameID: args._[0],
    walletIndex: args._[1],
    showGas: args["--showGas"] || false,
  };
}

async function promptForMissingOptions(options) {
  console.log("in promptForMissingOptions", options);
  if (options.newGame) {
    return {
      ...options,
      gameID: 0,
    };
  }

  let availableGames = await summary.methods
    .getAvailableGames(board._address, registry._address)
    .call();

  const questions = [];
  if (!options.gameID && availableGames.gameIDs.length > 0) {
    questions.push({
      type: "number",
      name: "gameID",
      message: "Which game ID shall we play?",
      default: 0,
    });
    console.log("Available games:");
    let gameData = [];
    for (let i = 0; i < availableGames.gameIDs.length; i++) {
      gameData.push({
        "Game ID": availableGames.gameIDs[i].toString(),
        Players: `${availableGames.currentRegistrations[i]} / ${availableGames.maxPlayers[i]}`,
      });
    }
    console.table(gameData);
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      gameID: answers.gameID,
      newGame: false,
    };
  } else if (options.gameID) {
    return {
      ...options,
      gameID: options.gameID,
    };
  } else {
    return {
      ...options,
      newGame: true,
    };
  }
}

export async function cli(args) {
  try {
    console.log("cli block 1");
    web3 = await Provider();
    console.log("cli block 2");
    accounts = await web3.eth.getAccounts();
    console.log("cli block 3");
    summary = await Contract("summary", web3);
    console.log("cli block 4");
    playerSummary = await Contract("playerSummary", web3);
    console.log("cli block 5");
    board = await Contract("board", web3);
    registry = await Contract("registry", web3);
  } catch (err) {
    console.log("cli block error");
    console.error(err);
  }

  let options;
  try {
    options = parseArgumentsIntoOptions(args);
    console.log("options after parsed", options);
    console.log("Wallet Index:", options.walletIndex);
  } catch (err) {
    console.log("parseArgumentsIntoOptions error");
    console.error(err);
  }

  try {
    options = await promptForMissingOptions(options);

    console.log("promptForMissingOptions options:", options);
  } catch (err) {
    console.log("promptForMissingOptions error");
    console.error(err);
  }

  try {
    await runCLI(options);
  } catch (err) {
    console.log("runCLI error");
    console.error(err);
  }
}

//start this ourselves in packaged thing!)
console.log("SHOULD START CLI!!");
let args = process.argv;
console.log("args", args);
cli(args);
