/*
Note:
Choosing a landing site is now done automatically once all players join a game.
Do not use these methods any more
*/

import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract.js";

let currentAccount;
let controller;
let board;

const startPlayersOnLandingSite = async (gameID) => {
  //console.log("Checking game needs update");
  try {
    let tx = await controller.methods
      .startGame(gameID, board._address)
      .send({ from: currentAccount, gas: "5000000" });
    console.log("Players moved to landing site. The game has begun.");
    //console.log("Gas used:", tx.gasUsed);
  } catch (err) {
    console.log(err.message);
  }
  // locks registration
  // // players already registered can continue their existing game with more credits,
  // // but new players can't join an already started game.
};

export async function chooseLandingSite(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  controller = await Contract("controller", provider);
  board = await Contract("board", provider);

  //console.log("Board:", board._address);
  //console.log("Controller:", controller.methods);

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
    //console.log("gas used:", tx.gasUsed);

    await startPlayersOnLandingSite(gameID);
  } catch (err) {
    console.log("Error setting landing site:", err.message);
  }
}
