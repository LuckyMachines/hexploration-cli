import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract.js";

let currentAccount;
let controller;
let board;

export async function chooseLandingSite(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  controller = await Contract("controller", provider);
  board = await Contract("board", provider);
  const availableSpaces = await board.methods.getZoneAliases().call();

  const questions = {
    type: "list",
    name: `landingZone`,
    message: "Where do we land this thing?",
    choices: availableSpaces,
    default: availableSpaces[0]
  };
  const answers = await inquirer.prompt(questions);
  try {
    let tx = await controller.methods
      .chooseLandingSite(answers.landingZone, gameID, board._address)
      .send({ from: currentAccount, gas: "2000000" });
    console.log(`Landing zone set to ${answers.landingZone}`);
    console.log("gas used:", tx.gasUsed);
  } catch (err) {
    console.log("Error setting landing site:", err.message);
  }
}
