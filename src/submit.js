import chalk from "chalk";
import inquirer from "inquirer";

import Contract from "./contract.js";

import AnimatedLine from "./animatedLine.js";

let currentAccount;
let hexplorationBoard;
let hexplorationController;
let summary;
let playerSummary;
let gameSummary;
let queue;

let inventory;
let activeInventory;
let submitLeftHand;
let submitRightHand;

let currentSpace;
let web3;

let showGas = false;
let saveGas;

let activeAnimations = [];

function stopAnimations() {
  activeAnimations.forEach((animation) => {
    animation.stop();
  });
  activeAnimations = [];
}

async function submitAction(action, options, gameID) {
  const lh = submitLeftHand ? submitLeftHand : "";
  const rh = submitRightHand ? submitRightHand : "";
  const ActionType = [
    "Idle",
    "Move",
    "SetupCamp",
    "BreakDownCamp",
    "Dig",
    "Rest",
    "Help"
  ];
  const actionEnum = ActionType.indexOf(action);
  const pid = await playerSummary.methods
    .getPlayerID(hexplorationBoard._address, gameID, currentAccount)
    .call();

  // console.log(`Submitting ${action} action:`);
  // console.log(
  //   `playerID: ${pid}\nactionIndex:${actionEnum}\noptions:${options}\nlh:${lh} rh:${rh}`
  // );
  try {
    console.log("Please confirm in MetaMask app.");
    let nonce = await web3.eth.getTransactionCount(currentAccount);
    let tx = await hexplorationController.methods
      .submitAction(
        pid,
        actionEnum,
        options,
        lh,
        rh,
        gameID,
        hexplorationBoard._address
      )
      .send({ from: currentAccount, gas: "5000000", nonce: nonce });
    console.log("Action submitted to queue.");
    // console.log(`${action} action submitted to queue`);
    if (showGas) {
      console.log("Gas used:", tx.gasUsed);
      saveGas("submitMove", tx.gasUsed);
    }
    // call callback if provided
    return tx;
  } catch (err) {
    console.log("Unable to submit action to queue.");
    console.log(
      "Make sure you are submitting a valid move and have not already submitted."
    );
    // console.log(err);
    return false;
  }
}

function getAvailableSpaceChoices(currentSpace, allSpaces, maxMovement) {
  const curX = Number(currentSpace.split(",")[0]);
  const curY = Number(currentSpace.split(",")[1]);
  // let possibleXs = [Number(curX) - 1, Number(curX), Number(curX) + 1];
  // let possibleYs = [Number(curY) - 1, Number(curY), Number(curY) + 1];
  let evenPossibleChoices = [
    `${curX},${curY - 1}`,
    `${curX - 1},${curY}`,
    `${curX - 1},${curY + 1}`,
    `${curX},${curY + 1}`,
    `${curX + 1},${curY + 1}`,
    `${curX + 1},${curY}`
  ];
  let oddPossibleChoices = [
    `${curX},${curY - 1}`,
    `${curX - 1},${curY - 1}`,
    `${curX - 1},${curY}`,
    `${curX},${curY + 1}`,
    `${curX + 1},${curY}`,
    `${curX + 1},${curY - 1}`
  ];
  let possibleChoices =
    curX % 2 == 0 ? evenPossibleChoices : oddPossibleChoices;
  //console.log("Possible choices:", possibleChoices);

  let availablePossibleChoices = [];
  // Close, but need to do different stuff for even / odd columns
  for (let i = 0; i < possibleChoices.length; i++) {
    if (
      allSpaces.indexOf(possibleChoices[i]) > -1 &&
      possibleChoices[i] != `${curX},${curY}`
    ) {
      availablePossibleChoices.push(possibleChoices[i]);
    }
  }

  return availablePossibleChoices;
}

async function idle(gameID) {
  const tx = await submitAction("Idle", [""], gameID);
  return tx;
}

async function moveToSpace(gameID) {
  let playerStats = await playerSummary.methods
    .currentPlayerStats(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });
  const maxSpaces = Number(playerStats.movement);
  //
  // console.log("Player stats:", playerStats);
  // console.log("Max spaces:", maxSpaces);
  let spaceChoices = [];
  for (let i = 0; i < maxSpaces; i++) {
    spaceChoices.push(`${i + 1}`);
  }
  let questions = [];
  questions.push({
    type: "list",
    name: "spacesToMove",
    message: "How many spaces do you want to move?",
    choices: spaceChoices,
    default: spaceChoices[0]
  });
  let answers = await inquirer.prompt(questions);
  const spacesToMove = answers.spacesToMove;
  console.log(`Moving ${spacesToMove}`);

  const availableSpaces = await hexplorationBoard.methods
    .getZoneAliases()
    .call();

  currentSpace = await playerSummary.methods
    .currentLocation(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });

  let movementChoices = [];
  // TODO: update to get available space choices from function
  let availableSpaceChoices = getAvailableSpaceChoices(
    currentSpace,
    availableSpaces,
    maxSpaces
  );

  for (let i = 0; i < spacesToMove; i++) {
    // update to show available choices only after each choice made
    answers = await inquirer.prompt({
      type: "list",
      name: `destination`,
      message: "which spaces to move through?",
      choices: availableSpaceChoices,
      default: availableSpaceChoices[0]
    });
    movementChoices.push(answers.destination);
    if (i < spacesToMove - 1) {
      availableSpaceChoices = getAvailableSpaceChoices(
        answers.destination,
        availableSpaces,
        maxSpaces - (i + 1)
      );
    } // otherwise is at last space choice, doesn't need to update this
  }

  const tx = await submitAction("Move", movementChoices, gameID);
  return tx;
  //console.log(`Moving through spaces: ${movementChoices}`);
  // try {
  //   let tx = await hexplorationController.methods
  //     .moveThroughPath(movementChoices, gameID, hexplorationBoard._address)
  //     .send({ from: currentAccount, gas: "5000000" });
  //   console.log("Gas used:", tx.gasUsed);
  // } catch (err) {
  //   console.log(err.message);
  // }
}

export async function equipItem(network, gameID, provider, account) {
  web3 = provider;
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  console.log("Equip Item:");
  console.log("Getting inventory...");
  hexplorationBoard = await Contract(network, "board", provider);
  hexplorationController = await Contract(network, "controller", provider);
  summary = await Contract(network, "summary", provider);
  playerSummary = await Contract(network, "playerSummary", provider);
  gameSummary = await Contract(network, "gameSummary", provider);
  queue = await Contract(network, "queue", provider);

  inventory = await playerSummary.methods
    .inactiveInventory(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });
  // console.log(inventory);

  activeInventory = await playerSummary.methods
    .activeInventory(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });

  const _queueID = await summary.methods
    .currentGameplayQueue(hexplorationBoard._address, gameID)
    .call();

  let hasItems = false;
  for (let i = 0; i < inventory.itemBalances.length; i++) {
    if (
      i != inventory.itemTypes.indexOf("Campsite") &&
      Number(inventory.itemBalances[i]) > 0
    ) {
      hasItems = true;
      break;
    }
  }

  if (!hasItems) {
    console.log("No items to equip");
  } else {
    let inventoryChoices = [];
    let excluded = ["Campsite"];
    if (submitLeftHand) {
      excluded.push(submitLeftHand);
    }
    if (submitRightHand) {
      excluded.push(submitRightHand);
    }
    for (let i = 0; i < inventory.itemBalances.length; i++) {
      if (
        Number(inventory.itemBalances[i]) > 0 &&
        excluded.indexOf(inventory.itemTypes[i]) < 0
      ) {
        inventoryChoices.push(inventory.itemTypes[i]);
      }
    }
    inventoryChoices.push("Clear hand");

    let questions = [];
    questions.push({
      type: "list",
      name: "handToUse",
      message: "Which hand?",
      choices: ["Left", "Right"],
      default: "Left"
    });
    questions.push({
      type: "list",
      name: "itemToEquip",
      message: "Which item?",
      choices: inventoryChoices,
      default: inventoryChoices[0]
    });

    let answers = await inquirer.prompt(questions);

    if (answers.itemToEquip != "Clear hand") {
      console.log(
        `Equipping ${answers.itemToEquip} to ${answers.handToUse} hand`
      );
    } else {
      console.log(`Clearing ${answers.handToUse} hand`);
    }
    if (answers.handToUse == "Left") {
      submitLeftHand =
        answers.itemToEquip != "Clear hand" ? answers.itemToEquip : "None";
    } else {
      submitRightHand =
        answers.itemToEquip != "Clear hand" ? answers.itemToEquip : "None";
    }
  }
  //console.log(`LH: ${submitLeftHand}, RH: ${submitRightHand}`);
  return [submitLeftHand, submitRightHand];
}

async function setupCamp(gameID) {
  console.log("Setup camp...");
  // send to queue
  const tx = await submitAction("SetupCamp", [""], gameID);
  return tx;
}

async function breakDownCamp(gameID) {
  console.log("Break down camp");
  // send to queue
  const tx = await submitAction("BreakDownCamp", [""], gameID);
  return tx;
}

async function dig(gameID) {
  console.log("Digging...");
  // send to queue
  const tx = await submitAction("Dig", [""], gameID);
  return tx;
}

async function rest(gameID) {
  let questions = [];
  questions.push({
    type: "list",
    name: "restAttribute",
    message: "Which attribute to rest?",
    choices: ["Movement", "Agility", "Dexterity"],
    default: "Movement"
  });

  let answers = await inquirer.prompt(questions);
  const tx = await submitAction("Rest", [answers.restAttribute], gameID);
  return tx;
}

async function help(gameID) {
  // TODO: limit choices to stats > 1
  let availablePlayers = [];
  const playerLocations = await gameSummary.methods
    .allPlayerLocations(hexplorationBoard._address, gameID)
    .call();
  for (let i = 0; i < playerLocations.length; i++) {
    if (
      playerLocations.playerIDs[i] != pid &&
      playerLocations.playerZones[i] == currentSpace
    ) {
      availablePlayers.push(playerLocations.playerIDs[i].toString());
    }
  }

  let questions = [];
  questions.push({
    type: "list",
    name: "helpPlayer",
    message: "Which player to heal?",
    choices: availablePlayers,
    default: availablePlayers[0]
  });
  questions.push({
    type: "list",
    name: "helpAttribute",
    message: "Which attribute to heal?",
    choices: ["Movement", "Agility", "Dexterity"],
    default: "Movement"
  });

  let answers = await inquirer.prompt(questions);
  const tx = await submitAction(
    "Help",
    [answers.helpPlayer, answers.helpAttribute],
    gameID
  );
  return tx;
}

/*
async function tradeItems() {
  console.log("Trade items...");
  // send to queue??
}

async function pickUpItems() {
  console.log("Pick up items...");
  // immediate action??
}
*/

export async function submitMoves(
  network,
  gameID,
  provider,
  account,
  _showGas,
  _saveGas,
  callback,
  _submitLeftHand,
  _submitRightHand
) {
  submitLeftHand = _submitLeftHand;
  submitRightHand = _submitRightHand;
  const checkingMovesLine = new AnimatedLine(
    "Checking available moves ",
    [".", "..", "...", "....", "....."],
    [" ✔️"]
  );
  activeAnimations.push(checkingMovesLine);
  checkingMovesLine.animate();

  web3 = provider;
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  showGas = _showGas;
  saveGas = _saveGas; // function to call with ("value", gas used);

  hexplorationBoard = await Contract(network, "board", provider);
  hexplorationController = await Contract(network, "controller", provider);
  summary = await Contract(network, "summary", provider);
  playerSummary = await Contract(network, "playerSummary", provider);
  gameSummary = await Contract(network, "gameSummary", provider);
  queue = await Contract(network, "queue", provider);

  inventory = await playerSummary.methods
    .inactiveInventory(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });
  // console.log(inventory);

  activeInventory = await playerSummary.methods
    .activeInventory(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });

  let choices = ["Idle", "Move to space"];

  const _queueID = await summary.methods
    .currentGameplayQueue(hexplorationBoard._address, gameID)
    .call();
  let currentPhase = await queue.methods.currentPhase(_queueID).call();

  let isSubmissionPhase = currentPhase == 1;

  let hasItems = false;
  for (let i = 0; i < inventory.itemBalances.length; i++) {
    if (
      i != inventory.itemTypes.indexOf("Campsite") &&
      Number(inventory.itemBalances[i]) > 0
    ) {
      hasItems = true;
      break;
    }
  }

  const landingSite = await summary.methods
    .landingSite(hexplorationBoard._address, gameID)
    .call();

  currentSpace = await playerSummary.methods
    .currentLocation(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });

  let isAtCampsite = await playerSummary.methods
    .isAtCampsite(hexplorationBoard._address, gameID)
    .call({ from: currentAccount });

  let isOnLandingZone = currentSpace == landingSite;
  let isOnRelicZone = await hexplorationBoard.methods
    .isRelicSpace(gameID, currentSpace)
    .call();

  let hasCampsiteInInventory = activeInventory.campsite;

  const playerLocations = await gameSummary.methods
    .allPlayerLocations(hexplorationBoard._address, gameID)
    .call();

  const pid = await playerSummary.methods
    .getPlayerID(hexplorationBoard._address, gameID, currentAccount)
    .call();

  let canHelpPlayer = false;
  for (let i = 0; i < playerLocations.length; i++) {
    if (
      playerLocations.playerIDs[i] != pid &&
      playerLocations.playerZones[i] == currentSpace
    ) {
      canHelpPlayer = true;
      break;
    }
  }

  //////////////////////////
  // Not doing these yet
  let canTrade = false;
  let canPickupItems = false;
  //////////////////////////
  if (isSubmissionPhase) {
    // if (hasItems) {
    //   choices.push("Equip item");
    // }
    if (isAtCampsite) {
      choices.push("Dig");
      choices.push("Rest");
      choices.push("Break down camp");
    } else if (hasCampsiteInInventory && !isOnLandingZone && !isOnRelicZone) {
      choices.push("Setup camp");
    }
    if (canHelpPlayer) {
      choices.push("Help");
    }
    if (canPickupItems) {
      choices.push("Pick up items");
    }
    if (canTrade) {
      choices.push("Trade items");
    }
    choices.push("Cancel");
    const questions = [];
    questions.push({
      type: "list",
      name: "move",
      message: "Which move do you want to make?",
      choices: choices,
      default: "Idle"
    });
    stopAnimations();
    const answers = await inquirer.prompt(questions);
    let submissionFunction;
    switch (answers.move) {
      case "Idle":
        submissionFunction = idle;
        // await idle(gameID);
        break;
      case "Move to space":
        submissionFunction = moveToSpace;
        // await moveToSpace(gameID);
        break;
      case "Setup camp":
        submissionFunction = setupCamp;
        // await setupCamp(gameID);
        break;
      case "Dig":
        submissionFunction = dig;
        // await dig(gameID);
        break;
      case "Rest":
        submissionFunction = rest;
        // await rest(gameID);
        break;
      case "Help":
        submissionFunction = help;
        // await help(gameID);
        break;
      case "Break down camp":
        submissionFunction = breakDownCamp;
        // await breakDownCamp(gameID);
        break;
      // case "Equip item":
      //   submissionFunction = equipItem;
      //   // await equipItem(gameID);
      //   break;
      case "Trade items":
        // submissionFunction = tradeItems;
        // await tradeItems();
        break;
      case "Pick up items":
        // submissionFunction = pickUpItems;
        // await pickUpItems();
        break;
      case "Cancel":
      default:
        console.log("Cancel move.");
        break;
    }
    if (submissionFunction) {
      let result = await submissionFunction(gameID);
      if (callback) {
        await callback(result);
      }
    }
  } else {
    console.log("Not submission phase.");
  }
}
