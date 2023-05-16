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
let landingSiteSet;
let adminMode = false;
let showGas = false;
let gameType = "1p";

async function mainMenu(gameID) {
  const questions = [];
  let choices = landingSiteSet
    ? ["Submit Move", "View Map", "Player Info"]
    : ["View Map"];
  if (adminMode) {
    choices.push("Run Services");
    choices.push("Progress Phase");
    choices.push("Progress Turn");
    choices.push("View Queue");
  }
  choices.push("Exit");
  questions.push({
    type: "list",
    name: "choice",
    message: `\n${chalk.blue.underline("Dashboard")}`,
    choices: choices,
    default: "Submit Move"
  });

  const answers = await inquirer.prompt(questions);
  switch (answers.choice) {
    case "Submit Move":
      await submitMoves(
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
      await playerInfo(gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "View Map":
      await showMap(gameID, web3, currentAccount);
      await checkForLandingSite(gameID);
      await mainMenu(gameID);
      break;
    case "Progress Phase":
      await progressPhase(
        gameID,
        web3,
        currentAccount,
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
      await viewQueue(gameID, web3, currentAccount);
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
      console.log(`${chalk.cyan.bold("\nPlaying Hexploration via CLI")}`);
      console.log(`${chalk.green.bold("Game ID:")} ${gameID}`);
      console.log(`${chalk.blue.bold("Player:")} ${currentAccount}`);
      console.log(`${adminMode ? chalk.red.bold("Admin mode enabled") : ""}`);
    } catch (err) {
      console.log("Error registering:", err.message);
    }
  } else {
    console.log("Player registered. Entering game.");
    console.log(`${chalk.cyan.bold("\nPlaying Hexploration via CLI")}`);
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
    console.log("Initial play zone:", initialPlayZone);
    landingSiteSet = initialPlayZone != "";
  }
}

async function registerNewGame(numberPlayers) {
  // console.log(gameController);
  // TODO: prompt for how many players
  const numPlayers = numberPlayers ? numberPlayers : 4;
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

export async function runCLI(options) {
  // console.log(gasReport);
  web3 = await Provider();
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

  ethers = await Provider(
    null,
    "ethers",
    overrideWallet ? options.walletIndex : 0
  );

  gameSummary = await Contract("summary", web3);
  playerSummary = await Contract("playerSummary", web3);
  gameBoard = await Contract("board", web3);
  gameRegistry = await Contract("registry", web3);
  gameController = await Contract("controller", ethers.provider, ethers.wallet);
  playerRegistry = await Contract("playerRegistry", web3);

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
