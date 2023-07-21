import chalk from "chalk";
import inquirer from "inquirer";
import { showMap } from "./map";
import { progressPhase } from "./phase";
import { submitMoves } from "./submit";
import { playerInfo } from "./player";
import { chooseLandingSite } from "./landingSite";
import { viewQueue } from "./queue";
import { progressTurn } from "./turn";
import { runServices } from "./services";
import { deliverRandomness } from "./randomness";
import Provider from "./provider";
import Contract from "./contract.js";
import fs from "fs";
import gasReport from "../gas-report.json";

let web3; // provider
let ethers; // ethers provider
let accounts;
let currentAccount;
let gameRegistry;
let playerRegistry;
let gameBoard;
let gameController;
let gameSummary;
let playerSummary;
let queue;
let gameEvents;
let landingSiteSet = false;
let adminMode = false;
let showGas = false;
let gameType = "1p";
let network;
let gameID;
let canSubmitMove = false;

function pause(time) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, time * 1000)
  );
}

async function waitForGameStart(gameID) {
  await checkForLandingSite(gameID);
  if (!landingSiteSet) {
    console.log("Searching for a safe landing site...");
    gameEvents.events
      .GameStart({
        filter: { gameID: gameID }
      })
      .once("data", async (event) => {
        console.log("Landing site found! Descending...");
        landingSiteSet = true;
        await pause(2);
      });
    while (!landingSiteSet) {
      await pause(1);
    }
  } else {
    console.log(`Joining game ${gameID}`);
  }
  // console.log("Start game callback result:", result);
  // GameStart(uint256 indexed gameID, uint256 timeStamp)

  await showMap(network, gameID, web3, currentAccount);
  await checkCanSubmitMove(gameID);
  if (!canSubmitMove) {
    console.log("Waiting for next turn to start...");
    while (!canSubmitMove) {
      await checkCanSubmitMove(gameID);
      await pause(1);
      // TODO: check if game is over or player is dead
    }
    await mainMenu(gameID);
  } else {
    await mainMenu(gameID);
  }
}

async function submitMovesCallback(result) {
  if (result) {
    canSubmitMove = false;
    // console.log("Submit moves callback result:", result);
    console.log("Waiting for all moves to be submitted...");

    let turnProcessed = false;

    const processingPhases = [
      "Start",
      "Submission",
      "Processing",
      "PlayThrough",
      "Processed",
      "Closed",
      "Failed"
    ];
    let processingPhase = 0;
    // console.log(
    //   `subscribing to TurnProcessingStart event for gameID ${gameID}, from block ${result.blockNumber}...`
    // );
    // gameEvents.events
    //   .TurnProcessingStart({
    //     filter: { gameID: gameID },
    //     fromBlock: result.blockNumber
    //   })
    //   .once("data", async (event) => {
    // console.log("All turns submitted. Processing 50%.");
    // console.log("TurnProcessingStart event emitted");
    // console.log("TurnProcessingStart event:", event);
    // console.log(
    //   "TurnProcessingStart event return values:",
    //   event.returnValues
    // );
    // console.log(
    //   "TurnProcessingStart event return values gameID:",
    //   event.returnValues.gameID
    // );
    // console.log(
    //   "TurnProcessingStart event return values timeStamp:",
    //   event.returnValues.timeStamp
    // );
    // });
    // gameEvents.events
    //   .ProcessingPhaseChange({
    //     filter: {
    //       gameID: gameID,
    //       newPhase: processingPhases.indexOf("PlayThrough")
    //     },
    //     fromBlock: result.blockNumber
    //   })
    //   .once("data", async (event) => {
    //     console.log("Processing 75%.");
    //   });
    gameEvents.events
      .ProcessingPhaseChange({
        filter: {
          gameID: gameID,
          newPhase: processingPhases.indexOf("Processed")
        },
        fromBlock: result.blockNumber
      })
      .once("data", async (event) => {
        console.log("All moves processed.");
      });
    gameEvents.events
      .ProcessingPhaseChange({
        filter: {
          gameID: gameID,
          newPhase: processingPhases.indexOf("Submission")
        },
        fromBlock: result.blockNumber
      })
      .once("data", async (event) => {
        console.log("Digital remapping in progress...");
        turnProcessed = true;
      });

    while (!turnProcessed) {
      await pause(1);
    }

    // make sure we're at a future block
    const previousBlock = result.blockNumber;
    let currentBlock = await web3.eth.getBlockNumber();
    const update1 = "Sending data back to ship...";
    const update2 = "Sensors calibrating...";
    const update3 = "Calculating new coordinates...";
    const update4 = "Predicting weather patterns...";
    const update5 = "Eating a snack...";
    let update1Shown = false;
    let update2Shown = false;
    let update3Shown = false;
    let update4Shown = false;
    let update5Shown = false;
    const update1Block = previousBlock + 1;
    const update2Block = previousBlock + 2;
    const update3Block = previousBlock + 3;
    const update4Block = previousBlock + 4;
    const update5Block = previousBlock + 5;

    while (currentBlock <= previousBlock + 5) {
      currentBlock = await web3.eth.getBlockNumber();
      if (currentBlock == update1Block && !update1Shown) {
        console.log(update1);
        update1Shown = true;
      }
      if (currentBlock == update2Block && !update2Shown) {
        console.log(update2);
        update2Shown = true;
      }
      if (currentBlock == update3Block && !update3Shown) {
        console.log(update3);
        update3Shown = true;
      }
      if (currentBlock == update4Block && !update4Shown) {
        console.log(update4);
        update4Shown = true;
      }
      if (currentBlock == update5Block && !update5Shown) {
        console.log(update5);
        update5Shown = true;
      }
      await pause(1);
    }

    // await checkForLandingSite(gameID);

    // TODO: also check for completed queue (finished game)
    let queueIsUpdated = false;
    const queueID = await queue.methods.queueID(gameID).call();
    const currentPhase = await queue.methods.currentPhase(queueID).call();
    if (Number(currentPhase) == 1) {
      queueIsUpdated = true;
    }
    if (!queueIsUpdated) {
      console.log("Finalizing compartment upgrade modularization...");
      while (!queueIsUpdated) {
        const queueID = await queue.methods.queueID(gameID).call();
        const currentPhase = await queue.methods.currentPhase(queueID).call();
        if (Number(currentPhase) == 1) {
          queueIsUpdated = true;
        }
        await pause(1);
      }
    }

    await playerInfo(network, gameID, web3, currentAccount);
    await showMap(network, gameID, web3, currentAccount);

    await checkCanSubmitMove(gameID);
    if (!canSubmitMove) {
      console.log("Waiting for next turn to start...");
      while (!canSubmitMove) {
        await checkCanSubmitMove(gameID);
        await pause(1);
        // TODO: check if game is over or player is dead
      }
      await mainMenu(gameID);
    } else {
      await mainMenu(gameID);
    }
  } else {
    await mainMenu(gameID);
  }
}

async function mainMenu(gameID) {
  const questions = [];
  let choices = [];
  // let canSubmitMove = await checkCanSubmitMove(gameID);
  if (canSubmitMove) {
    choices.push("Submit Move");
  }

  if (adminMode) {
    choices.push("Run Services");
    choices.push("Deliver Randomness");
    choices.push("View Queue");
    choices.push("View Map");
    if (landingSiteSet) {
      choices.push("Player Info");
    }
  }
  choices.push("Exit");
  questions.push({
    type: "list",
    name: "choice",
    message: `\n${chalk.blue.underline("Dashboard")}`,
    choices: choices,
    default: choices[0]
  });

  const answers = await inquirer.prompt(questions);
  switch (answers.choice) {
    case "Submit Move":
      let canSubmit = await checkCanSubmitMove(gameID);
      if (canSubmit) {
        await submitMoves(
          network,
          gameID,
          web3,
          currentAccount,
          showGas,
          addValueToGasReport,
          submitMovesCallback
        );
      } else {
        console.log("Unable to submit move. You may have already submitted.");
      }
      break;
    case "Player Info":
      await playerInfo(network, gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "View Map":
      await showMap(network, gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Deliver Randomness":
      await deliverRandomness(
        network,
        gameID,
        ethers.provider,
        ethers.wallet,
        showGas,
        addValueToGasReport
      );
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Progress Turn":
      await progressTurn(
        gameID,
        web3,
        currentAccount,
        showGas,
        addValueToGasReport
      );
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Run Services":
      await runServices(
        network,
        gameID,
        ethers.provider,
        ethers.wallet,
        showGas,
        addValueToGasReport
      );
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Choose Landing Site":
      await chooseLandingSite(
        network,
        gameID,
        web3,
        currentAccount,
        showGas,
        addValueToGasReport
      );
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "View Queue":
      await viewQueue(network, gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Exit":
      console.log("Goodbye!");
      process.exit();
      break;
    default:
      break;
  }
  return true;
}

async function checkCanSubmitMove(gameID) {
  // console.log("Check can submit move");
  const queueID = await queue.methods.queueID(gameID).call();
  const playerID = await playerSummary.methods
    .getPlayerID(gameBoard._address, gameID, currentAccount)
    .call();

  const currentPhase = await queue.methods.currentPhase(queueID).call();
  // check if in submission phase
  if (Number(currentPhase) == 1) {
    // check if player already submitted
    const playerSubmitted = await queue.methods
      .playerSubmitted(queueID, playerID)
      .call();
    canSubmitMove = !playerSubmitted;
  } else {
    canSubmitMove = false;
  }
  return canSubmitMove;
}

async function registerPlayerIfNeeded(gameID) {
  // console.log("Register player if needed. Game type:", gameType);
  let isRegistered = await playerSummary.methods
    .isRegistered(gameBoard._address, gameID, currentAccount)
    .call();

  if (!isRegistered) {
    console.log(`Registering player: ${currentAccount}`);
    try {
      // get available registrations...
      // if last player to register, save to registerAndPreStart
      let gasValue = "register";
      const totalRegistrations = await playerRegistry.methods
        .totalRegistrations(gameID)
        .call();
      const registrationLimit = await playerRegistry.methods
        .registrationLimit(gameID)
        .call();
      if (Number(registrationLimit) == Number(totalRegistrations) + 1) {
        // this is the last player to register
        gasValue = "registerAndPreStart";
      }
      console.log("Registering for game.");
      console.log("Please confirm in MetaMask app.");
      // let tx = await gameController.registerForGame(gameID, gameBoard._address);
      // uncomment to force revert when ethers preventing execution
      let tx = await gameController.registerForGame(
        gameID,
        gameBoard._address,
        { gasLimit: "4000000" }
      );
      let receipt = await tx.wait();
      if (showGas) {
        console.log("Registered player with gas:", receipt.gasUsed.toString());
        addValueToGasReport(gasValue, receipt.gasUsed);
      }
      isRegistered = await playerSummary.methods
        .isRegistered(gameBoard._address, gameID, currentAccount)
        .call();
      console.log("Player registered. Entering game.");
      // console.log(`${chalk.cyan.bold("\nPlaying Hexploration via CLI")}`);
      console.log(`${chalk.green.bold("Game ID:")} ${gameID}`);
      console.log(`${chalk.blue.bold("Player:")} ${currentAccount}`);
      console.log(`${adminMode ? chalk.red.bold("Admin mode enabled") : ""}`);
    } catch (err) {
      console.log("Error registering:", err.message);
    }
  } else {
    console.log("Player registered. Entering game.");
    // console.log(`${chalk.cyan.bold("\nPlaying Hexploration via CLI")}`);
    console.log(`${chalk.green.bold("Game ID:")} ${gameID}`);
    console.log(`${chalk.blue.bold("Player:")} ${currentAccount}`);
    console.log(`${adminMode ? chalk.red.bold("Admin mode enabled") : ""}`);
  }
}

async function checkForLandingSite(gameID) {
  // board . mapping(uint256 => string) public initialPlayZone;
  if (!landingSiteSet) {
    // console.log("methods", gameBoard.methods);
    const initialPlayZone = await gameBoard.methods
      .initialPlayZone(gameID)
      .call();
    // console.log("Initial play zone:", initialPlayZone);
    landingSiteSet = initialPlayZone != "";
  }
}

async function registerNewGame(numberPlayers) {
  // console.log(gameController);
  // TODO: prompt for how many players
  const numPlayers = numberPlayers ? numberPlayers : 4;

  try {
    console.log("Creating new game.");
    console.log("Please confirm in MetaMask app.");
    let tx = await gameController["requestNewGame(address,address,uint256)"](
      gameRegistry._address,
      gameBoard._address,
      numPlayers
    );
    let receipt = await tx.wait();
    if (showGas) {
      console.log(`Created ${gameType} game with gas: ${receipt.gasUsed}`);
      addValueToGasReport("createGame", receipt.gasUsed);
    }

    let newGameID = await gameController.latestGame(
      gameRegistry._address,
      gameBoard._address
    );
    return newGameID;
  } catch (err) {
    console.log("Unable to create game.");
  }
}

function addValueToGasReport(valueName, gasAmount) {
  const gameValues = [
    "preStart",
    "start",
    "progressTurn",
    "deliverRandomness",
    "processing1",
    "processing2",
    "createGame"
  ];
  const playerValues = ["register", "registerAndPreStart", "submitMove"];
  let category;
  if (gameValues.indexOf(valueName) >= 0) {
    category = "gameActions";
  }
  if (playerValues.indexOf(valueName) >= 0) {
    category = "playerActions";
  }
  if (category) {
    console.log("Saving to category:", category);
    console.log("Value", valueName);
    console.log("Game Type:", gameType);
    if (
      Number(gasAmount) < gasReport[category][valueName][gameType].low ||
      gasReport[category][valueName][gameType].low == 0
    ) {
      gasReport[category][valueName][gameType].low = Number(gasAmount);
    }
    if (
      Number(gasAmount) > gasReport[category][valueName][gameType].high ||
      gasReport[category][valueName][gameType].high == 0
    ) {
      gasReport[category][valueName][gameType].high = Number(gasAmount);
    }
    saveGasReport();
  } else {
    console.log("Error: gas report value not found:", valueName);
  }
}

function saveGasReport() {
  const savePath = `${process.cwd()}/gas-report.json`;
  fs.writeFileSync(savePath, JSON.stringify(gasReport, null, 4), (err) => {
    if (err) {
      console.log("error: unable to save gas report", err.message);
    } else {
      console.log("Saved gas to report");
    }
  });
}

export async function runCLI(options, ethereum, ntwk) {
  network = ntwk;
  // console.log(gasReport);
  web3 = await Provider(ethereum);
  accounts = await web3.eth.getAccounts();
  showGas = options.showGas;
  let overrideWallet = false;
  if (options.walletIndex) {
    if (options.walletIndex < accounts.length) {
      overrideWallet = true;
    }
  }
  currentAccount = overrideWallet ? accounts[options.walletIndex] : accounts[0];

  adminMode = options.adminMode;

  ethers = await Provider(ethereum, "ethers");

  gameSummary = await Contract(network, "summary", web3);
  playerSummary = await Contract(network, "playerSummary", web3);
  gameBoard = await Contract(network, "board", web3);
  gameRegistry = await Contract(network, "registry", web3);
  gameController = await Contract(
    network,
    "controller",
    ethers.provider,
    ethers.wallet
  );
  playerRegistry = await Contract(network, "playerRegistry", web3);
  queue = await Contract(network, "queue", web3);
  gameEvents = await Contract(network, "events", web3);

  let availableGames = await gameSummary.methods
    .getAvailableGames(gameBoard._address, gameRegistry._address)
    .call();

  // Create new game if requested
  let questions = {
    type: "list",
    name: "choice",
    message: `\n${chalk.blue.underline("Number of players")}`,
    choices: ["1", "2", "3", "4"],
    default: "4"
  };

  if (options.newGame) {
    const answers = await inquirer.prompt(questions);
    const numPlayers = answers.choice;
    gameType = `${numPlayers}p`;
    gameID = await registerNewGame(numPlayers);
  } else {
    gameID = options.gameID;
    const registrationLimit = await playerRegistry.methods
      .registrationLimit(gameID)
      .call();
    gameType = `${Number(registrationLimit)}p`;
  }

  // check that game is registered
  const latestGame = await gameRegistry.methods
    .latestGame(gameBoard._address)
    .call();

  //console.log("Latest Game:", latestGame);
  // console.log("0");
  if (gameID != 0 && Number(latestGame) >= Number(gameID)) {
    await registerPlayerIfNeeded(gameID);
    await waitForGameStart(gameID);
  } else {
    console.log("Game ID not found.");
    process.exit();
  }
}
