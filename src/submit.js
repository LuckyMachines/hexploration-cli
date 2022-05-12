import chalk from "chalk";
import inquirer from "inquirer";

let currentAccount;

async function moveToSpace() {
  console.log("Move to space...");
  // TODO: get this from a contract
  const maxSpaces = 3;
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

  //TODO: get list of actual spaces to choose from
  // can start with full list for ease of testing
  let availableSpaces = ["0,0", "0,1", "1,1", "1,0"];

  questions = [];
  for (let i = 0; i < spacesToMove; i++) {
    questions.push({
      type: "list",
      name: `destination${i}`,
      message: "which spaces to move through?",
      choices: availableSpaces,
      default: availableSpaces[0]
    });
  }
  answers = await inquirer.prompt(questions);
  const possibleMovementChoices = [
    answers.destination0,
    answers.destination1,
    answers.destination2,
    answers.destination3,
    answers.destination4,
    answers.destination5,
    answers.destination6,
    answers.destination7,
    answers.destination8,
    answers.destination9
  ];
  let movementChoices = [];
  for (let i = 0; i < spacesToMove; i++) {
    movementChoices.push(possibleMovementChoices[i]);
  }
  console.log(`Moving through spaces: ${movementChoices}`);

  // submit movement choices to controller
}

async function setupCamp() {
  console.log("Setup camp...");
}

async function takeDownCamp() {
  console.log("Take down camp...");
}

async function useItem() {
  console.log("Use item...");
}

export async function submitMoves(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  const questions = [];
  questions.push({
    type: "list",
    name: "move",
    message: "Which move do you want to make?",
    choices: [
      "Move to space",
      "Setup camp",
      "Take down camp",
      "Use item",
      "Cancel"
    ],
    default: "Move to space"
  });
  const answers = await inquirer.prompt(questions);
  switch (answers.move) {
    case "Move to space":
      await moveToSpace();
      break;
    case "Setup camp":
      await setupCamp();
      break;
    case "Take down camp":
      await takeDownCamp();
      break;
    case "Use item":
      await useItem();
      break;
    case "Cancel":
    default:
      console.log("Cancel move.");
      break;
  }
}
