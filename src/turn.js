import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract";

let currentAccount;
let controller;

export async function progressTurn(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  controller = await Contract("controller", provider);
  let upkeep = await controller.methods
    .checkUpkeep("0x")
    .call({ from: currentAccount });
  let { 0: upkeepNeeded, 1: performData } = upkeep;

  if (upkeepNeeded) {
    let tx = await controller.methods
      .performUpkeep(performData)
      .send({ from: currentAccount, gas: "5000000" });
    console.log("Turn progressed. Gas used:", tx.gasUsed);
    // await tx.wait();
    // let processingPhase = await GAME_QUEUE.currentPhase(qid);
    // expect(processingPhase).to.equal(PROCESSING_PHASE_PLAY_THROUGH);
  } else {
    console.log("Turn not ready to progress");
  }
}
