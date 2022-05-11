import chalk from "chalk";
import inquirer from "inquirer";

async function mainMenu() {
  const questions = [];
  questions.push({
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: ["Submit Move", "View Map", "Progress Phase", "Exit"],
    default: "Submit Move"
  });

  const answers = await inquirer.prompt(questions);
  switch (answers.choice) {
    case "Submit Move":
      console.log("Submitting move...");
      await mainMenu();
      break;
    case "View Map":
      console.log("Viewing map...");
      await mainMenu();
      break;
    case "Progress Phase":
      console.log("Progressing phase...");
      await mainMenu();
      break;
    case "Exit":
      console.log("Exiting...");
      break;
    default:
      break;
  }
  return true;
}

export async function runCLI(options) {
  console.log("\n%s Hexploration via CLI\n", chalk.green.bold("Playing"));
  await mainMenu();
}
