import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract";

let currentAccount;
let summary;
let board;
let gameplay;

export async function progressPhase(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  summary = await Contract("summary", provider);
  board = await Contract("board", provider);
  gameplay = await Contract("gameplay", provider);

  // add self as verified controller for manual phase progression
  await gameplay.methods
    .addVerifiedController(currentAccount)
    .send({ from: currentAccount, gas: "5000000" });

  // get data to post if update ready...
  const qID = await summary.methods
    .currentGameplayQueue(board._address, gameID)
    .call();
  let updates = await gameplay.methods.shouldContinueProcessing(qID).call();
  console.log("Current update:");
  console.log("Needs update:", updates[0]);
  console.log("Values:", updates[1]);
  console.log("Strings:", updates[2]);

  let tx = await gameplay.methods
    .postProcessedGameState(qID, updates[1], updates[2])
    .send({ from: currentAccount, gas: "15000000" });
  console.log("Processed. Gas used:", tx.gasUsed);
}
