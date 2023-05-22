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

export async function deliverRandomness(
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
}
