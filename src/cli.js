import arg from "arg";
import inquirer from "inquirer";
import { runCLI } from "./main";
import Contract from "./contract";
import Provider from "./provider";

let web3;
let accounts;
let summary;
let board;
let registry;

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--newGame": Boolean,
      "--adminMode": Boolean,
      "-n": "--newGame",
      "-a": "--adminMode",
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
  };
}

async function promptForMissingOptions(options) {
  if (options.newGame) {
    return {
      ...options,
      gameID: 0,
    };
  }

  let availableGameIDs = await summary.methods
    .getAvailableGameIDs(board._address, registry._address)
    .call();

  const questions = [];
  if (!options.gameID) {
    questions.push({
      type: "number",
      name: "gameID",
      message: "Which game ID shall we play?",
      default: 0,
    });
  }
  console.log("Available games:");
  console.log(availableGameIDs);
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    gameID: options.gameID || answers.gameID,
  };
}

export async function cli(args) {
  web3 = await Provider();
  accounts = await web3.eth.getAccounts();
  summary = await Contract("summary", web3);
  board = await Contract("board", web3);
  registry = await Contract("registry", web3);

  let options = parseArgumentsIntoOptions(args);
  //console.log("Wallet Index:", options.walletIndex);

  options = await promptForMissingOptions(options);

  //console.log("Option:", options);
  await runCLI(options);
}
