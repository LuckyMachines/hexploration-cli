import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract";

let currentAccount;
let summary;
let playerSummary;
let board;
let gameplay;

export async function progressPhase(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  summary = await Contract("summary", provider);
  playerSummary = await Contract("playerSummary", provider);
  board = await Contract("board", provider);
  gameplay = await Contract("gameplay", provider);

  console.log("Gameplay address:", gameplay._address);
  // add self as verified controller for manual phase progression
  // await gameplay.methods
  //   .addVerifiedController(currentAccount)
  //   .send({ from: currentAccount, gas: "5000000" });

  // get data to post if update ready...
  // const qid = await summary.methods
  //   .currentGameplayQueue(board._address, gameID)
  //   .call();

  let upkeep = await gameplay.methods
    .checkUpkeep("0x")
    .call({ from: currentAccount, gas: "5000000" });
  let { 0: upkeepNeeded, 1: performData } = upkeep;

  if (upkeepNeeded) {
    let tx = await gameplay.methods
      .performUpkeep(performData)
      .send({ from: currentAccount, gas: "5000000" });
    console.log("Upkeep performed. Gas used:", tx.gasUsed);
    // await tx.wait();
    // let processingPhase = await GAME_QUEUE.currentPhase(qid);
    // expect(processingPhase).to.equal(PROCESSING_PHASE_PLAY_THROUGH);
  } else {
    console.log("No upkeep needed");
  }
  // expect(processingPhase).to.equal(PROCESSING_PHASE_PROCESSED);

  /*

  // check for updates available, should return queue in bytecode
  let upkeepInfo = await gameplay.methods.needsUpkeep().call();
  let needsUpkeep = upkeepInfo[0];
  let performData = upkeepInfo[1];

  console.log("Current queue:", qID);
  console.log("Needs upkeep:", needsUpkeep);
  console.log("Perform data:", performData);

  // if updates available, perform upkeep, check gas costs
  // come on under 5,000,000...

  if (needsUpkeep) {
    console.log("Performing upkeep...");
    try {
      let tx = await gameplay.methods
        .doUpkeep(performData)
        .send({ from: currentAccount, gas: "5000000" });
    } catch (err) {
      console.log(err.message);
    }
    //console.log("Gas used for phase update:", tx.gasUsed);
  }

  // do second time for playthrough phase
*/
  /*
  upkeepInfo = await gameplay.methods.needsUpkeep().call();
  needsUpkeep = upkeepInfo[0];
  performData = upkeepInfo[1];
  console.log("Needs upkeep:", needsUpkeep);
  console.log("Perform data:", performData);
  if (needsUpkeep) {
    console.log("Performing upkeep...");
    let tx = await gameplay.methods
      .doUpkeep(performData)
      .send({ from: currentAccount, gas: "5000000" });
    //console.log("Gas used for phase update:", tx.gasUsed);
  }
  */

  /*
  previous way of updating
  let updates = await gameplay.methods.shouldContinueProcessing(qID).call();
  console.log("Current update:");
  console.log("Needs update:", updates[0]);
  console.log("Values:", updates[1]);
  console.log("Strings:", updates[2]);

  console.log("Posting game state updates");
  let tx = await gameplay.methods
    .postProcessedGameState(qID, updates[1], updates[2])
    .send({ from: currentAccount, gas: "15000000" });
  console.log("Processed. Gas used:", tx.gasUsed);
  */
}
