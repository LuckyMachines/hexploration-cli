import arg from "arg";
import inquirer from "inquirer";
import { runCLI } from "./main";
import Contract from "./contract";
import Provider from "./provider";
import MetaMaskSDK from "@metamask/sdk";

let web3;
let accounts;
let summary;
let playerSummary;
let board;
let registry;

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--newGame": Boolean,
      "--adminMode": Boolean,
      "--showGas": Boolean,
      "-n": "--newGame",
      "-a": "--adminMode",
      "-g": "--showGas"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    newGame: args["--newGame"] || false,
    adminMode: args["--adminMode"] || false,
    gameID: args._[0],
    walletIndex: args._[1],
    showGas: args["--showGas"] || false
  };
}

async function promptForMissingOptions(options) {
  if (options.newGame) {
    return {
      ...options,
      gameID: 0
    };
  }

  let availableGames = await summary.methods
    .getAvailableGames(board._address, registry._address)
    .call();

  const questions = [];
  if (!options.gameID && availableGames.gameIDs.length > 0) {
    questions.push({
      type: "number",
      name: "gameID",
      message: "Which game ID shall we play?",
      default: 0
    });
    console.log("Available games:");
    let gameData = [];
    for (let i = 0; i < availableGames.gameIDs.length; i++) {
      gameData.push({
        "Game ID": availableGames.gameIDs[i].toString(),
        Players: `${availableGames.currentRegistrations[i]} / ${availableGames.maxPlayers[i]}`
      });
    }
    console.table(gameData);
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      gameID: answers.gameID,
      newGame: false
    };
  } else if (options.gameID) {
    return {
      ...options,
      gameID: options.gameID
    };
  } else {
    return {
      ...options,
      newGame: true
    };
  }
}

const sdk = new MetaMaskSDK({
  shouldShimWeb3: false,
  showQRCode: true,
  dappMetadata: {
    name: "Hexploration",
    url: "https://luckymachines.io"
  }
});
const metamask_ethereum = sdk.getProvider();

// console.log("metamask_ethereum", metamask_ethereum);
const startMetamask = async () => {
  const accounts = await metamask_ethereum.request({
    method: "eth_requestAccounts",
    params: []
  });
};

export async function cli(args) {
  // Choose network
  let questions = [
    {
      type: "list",
      name: "whichNetwork",
      message: "Which network?",
      choices: ["sepolia", "godwoken_test"],
      default: "sepolia"
    }
  ];
  const answers = await inquirer.prompt(questions);
  let network = answers.whichNetwork;

  let options = parseArgumentsIntoOptions(args);
  //console.log("Wallet Index:", options.walletIndex);

  //console.log("Option:", options);
  await startWithMetaMask(options, network);
}

const startWithMetaMask = async (options, network) => {
  // connect to metamask
  await startMetamask();
  web3 = await Provider(metamask_ethereum);
  // accounts = await web3.eth.getAccounts();
  summary = await Contract(network, "summary", web3);
  playerSummary = await Contract(network, "playerSummary", web3);
  board = await Contract(network, "board", web3);
  registry = await Contract(network, "registry", web3);

  options = await promptForMissingOptions(options);
  try {
    await runCLI(options, metamask_ethereum, network);
  } catch (err) {
    if (
      err.message ==
      "MetaMask is not connected/installed, please call eth_requestAccounts to connect first."
    ) {
      console.log("MetaMask disconnected. Please reconnect.");
      await startWithMetaMask(options, network);
    } else {
      console.log(err.message);
      await startWithoutMetaMask(options, network);
    }
  }
};

const startWithoutMetaMask = async (options, network) => {
  try {
    await runCLI(options, metamask_ethereum, network);
  } catch (err) {
    if (
      err.message ==
      "MetaMask is not connected/installed, please call eth_requestAccounts to connect first."
    ) {
      console.log("MetaMask disconnected. Please reconnect.");
      await startWithMetaMask(options, network);
    } else {
      console.log(err.message);
      startWithoutMetaMask(options, network);
    }
  }
};

//start this ourselves in packaged thing!)
console.log("SHOULD START CLI!!");
let args = process.argv;
console.log("args", args);
cli(args);
