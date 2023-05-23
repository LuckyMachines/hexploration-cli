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
let landingSiteSet;
let adminMode = false;
let showGas = false;
let gameType = "1p";
let network;

async function mainMenu(gameID) {
  const questions = [];
  let choices = [];
  let canSubmitMove = await checkCanSubmitMove(gameID);
  if (canSubmitMove) {
    choices.push("Submit Move");
  }
  choices.push("View Map");
  if (landingSiteSet) {
    choices.push("Player Info");
  }
  if (adminMode) {
    choices.push("Run Services");
    choices.push("Deliver Randomness");
    choices.push("View Queue");
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
      await submitMoves(
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
  let canSubmitMove = true;
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
      console.log("Please confirm from MetaMask.");
      let tx = await gameController.registerForGame(gameID, gameBoard._address);
      // uncomment to force revert when ethers preventing execution
      // let tx = await gameController.registerForGame(
      //   gameID,
      //   gameBoard._address,
      //   { gasLimit: "4000000" }
      // );
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
    console.log("Please confirm from MetaMask.");
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

  let availableGames = await gameSummary.methods
    .getAvailableGames(gameBoard._address, gameRegistry._address)
    .call();

  let gameID;
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
    await checkForLandingSite(gameID);
    await mainMenu(gameID);
  } else {
    console.log("Game ID not found.");
    process.exit();
  }
}
