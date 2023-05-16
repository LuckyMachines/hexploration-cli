import Contract from "./contract";

let currentAccount;
let summary;
let playerSummary;
let board;
let controller;
let gameplay;
let gameSetup;
let gameQueue;

let showGas = false;
let saveGas;

export async function runServices(
  network,
  gameID,
  ethersProvider,
  ethersWallet,
  _showGas,
  _saveGas
) {
  showGas = _showGas;
  saveGas = _saveGas;
  // const accounts = await provider.eth.getAccounts();
  // currentAccount = account ? account : accounts[0];
  summary = await Contract(network, "summary", ethersProvider, ethersWallet);
  playerSummary = await Contract(
    network,
    "playerSummary",
    ethersProvider,
    ethersWallet
  );
  board = await Contract(network, "board", ethersProvider, ethersWallet);
  gameplay = await Contract(network, "gameplay", ethersProvider, ethersWallet);
  controller = await Contract(
    network,
    "controller",
    ethersProvider,
    ethersWallet
  );
  gameSetup = await Contract(
    network,
    "gameSetup",
    ethersProvider,
    ethersWallet
  );
  gameQueue = await Contract(network, "queue", ethersProvider, ethersWallet);

  console.log("Gameplay address:", gameplay.address);

  // Progress / timeout turn + request mock randomness
  let turnUpkeep = await controller.checkUpkeep("0x");
  let { 0: turnUpkeepNeeded, 1: turnPerformData } = turnUpkeep;

  if (turnUpkeepNeeded) {
    console.log("Turn upkeep needed. Attempting to progress turn...");
    console.log("Perform data:", turnPerformData);
    let tx = await controller.performUpkeep(turnPerformData);
    let receipt = await tx.wait();
    console.log("Turn progressed.");
    if (showGas) {
      console.log("Gas used:", receipt.gasUsed.toString());
      saveGas("progressTurn", receipt.gasUsed);
    }
  } else {
    console.log("Turn not ready to progress");
  }

  // Deliver mock randomness
  let setupMockRandomnessRequests = await gameSetup.getMockRequests();
  console.log(
    "Game setup randomness requests:",
    setupMockRandomnessRequests.toString()
  );
  if (setupMockRandomnessRequests.length > 0) {
    console.log("Delivering mock randomness to game setup...");
    let tx = await gameSetup.fulfillMockRandomness({ gasLimit: "10000000" });
    let receipt = await tx.wait();
    console.log("delivered mock randomness");
    if (showGas) {
      console.log("gas used: ", receipt.gasUsed.toString());
      saveGas("start", receipt.gasUsed);
    }
  }

  let queueMockRandomnessRequests = await gameQueue.getMockRequests();
  console.log(
    "Game queue randomness requests:",
    queueMockRandomnessRequests.toString()
  );
  if (queueMockRandomnessRequests.length > 0) {
    console.log("Delivering mock randomness to game queue...");
    let tx = await gameQueue.fulfillMockRandomness();
    let receipt = await tx.wait();
    console.log("mock randomness delivered");
    if (showGas) {
      console.log("gas: ", receipt.gasUsed.toString());
      saveGas("deliverRandomness", receipt.gasUsed);
    }
  }

  // Perform Player action upkeep
  let upkeep = await gameplay.checkUpkeep("0x");
  let { 0: upkeepNeeded, 1: performData } = upkeep;

  if (upkeepNeeded) {
    console.log("1st upkeep needed. Attempting perform upkeep...");
    console.log("Perform data:", performData);
    let tx = await gameplay.performUpkeep(performData);
    let receipt = await tx.wait();
    console.log("1st upkeep performed.");
    if (showGas) {
      console.log("Gas used: ", receipt.gasUsed.toString());
      saveGas("processing1", receipt.gasUsed);
    }
  } else {
    console.log("No 1st upkeep needed");
  }

  // Perform day phase upkeep
  let upkeep2 = await gameplay.checkUpkeep("0x");
  let { 0: upkeepNeeded2, 1: performData2 } = upkeep2;

  if (upkeepNeeded2) {
    console.log("2nd upkeep needed. Attempting perform upkeep...");
    console.log("Perform data:", performData2);
    let tx = await gameplay.performUpkeep(performData2);
    let receipt = await tx.wait();
    console.log("2nd upkeep performed.");
    if (showGas) {
      console.log("Gas used:", receipt.gasUsed.toString());
      saveGas("processing2", receipt.gasUsed);
    }
  } else {
    console.log("No 2nd upkeep needed");
  }
}
