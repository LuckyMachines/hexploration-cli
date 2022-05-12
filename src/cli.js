import arg from "arg";
import inquirer from "inquirer";
import { runCLI } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--newGame": Boolean,
      "-n": "--newGame"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    newGame: args["--newGame"] || false,
    gameID: args._[0],
    walletIndex: args._[1]
  };
}

async function promptForMissingOptions(options) {
  if (options.newGame) {
    return {
      ...options,
      gameID: 0
    };
  }

  const questions = [];
  if (!options.gameID) {
    questions.push({
      type: "number",
      name: "gameID",
      message: "Which game ID shall we play?",
      default: 0
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    gameID: options.gameID || answers.gameID
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  //console.log("Wallet Index:", options.walletIndex);
  options = await promptForMissingOptions(options);
  //console.log("Option:", options);
  await runCLI(options);
}
