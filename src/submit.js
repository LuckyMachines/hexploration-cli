import chalk from "chalk";
import inquirer from "inquirer";

let currentAccount;

async function moveToSpace() {
  console.log("Move to space...");
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
