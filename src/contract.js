// TODO: import from public hexploration repo, not hexploration-deployments
import HexplorationBoard from "hexploration-deployments/artifacts/contracts/HexplorationBoard.sol/HexplorationBoard.json";
import Queue from "hexploration-deployments/artifacts/contracts/HexplorationQueue.sol/HexplorationQueue.json";
import Gameplay from "hexploration-deployments/artifacts/contracts/HexplorationGameplay.sol/HexplorationGameplay.json";

import GameRegistry from "@luckymachines/game-core/contracts/abi/v0.0/GameRegistry.json";

// The following are the ABI, not an object with an ABI property
import GameSummary from "@luckymachines/game-core/games/hexploration/abi/GameSummary.json";
import HexplorationController from "@luckymachines/game-core/games/hexploration/abi/HexplorationController.json";

import Addresses from "../settings/ContractAddresses.json";

//UNCOMMENT SELECTED CHAIN
// const selectedChain = 0; //Ganache
const selectedChain = 1; //Mumbai
// const selectedChain = 2; //Binance Test

// const selectedChain = 3; // Hardhat
// const selectedChain = 4; // Goerli
// const selectedChain = 5; // Polygon

// TODO:
// Set Polygon, Hardhat, Goerli addresses

const boardAddresses = [
  Addresses.ganache.HEXPLORATION_BOARD,
  Addresses.mumbai.HEXPLORATION_BOARD,
  Addresses.bnbTest.HEXPLORATION_BOARD,
  Addresses.hardhat.HEXPLORATION_BOARD,
  Addresses.goerli.HEXPLORATION_BOARD,
  Addresses.polygon.HEXPLORATION_BOARD
];

const controllerAddresses = [
  Addresses.ganache.HEXPLORATION_CONTROLLER,
  Addresses.mumbai.HEXPLORATION_CONTROLLER,
  Addresses.bnbTest.HEXPLORATION_CONTROLLER,
  Addresses.hardhat.HEXPLORATION_CONTROLLER,
  Addresses.goerli.HEXPLORATION_CONTROLLER,
  Addresses.polygon.HEXPLORATION_CONTROLLER
];

const summaryAddresses = [
  Addresses.ganache.GAME_SUMMARY,
  Addresses.mumbai.GAME_SUMMARY,
  Addresses.bnbTest.GAME_SUMMARY,
  Addresses.hardhat.GAME_SUMMARY,
  Addresses.goerli.GAME_SUMMARY,
  Addresses.polygon.GAME_SUMMARY
];

const registryAddresses = [
  Addresses.ganache.GAME_REGISTRY,
  Addresses.mumbai.GAME_REGISTRY,
  Addresses.bnbTest.GAME_REGISTRY,
  Addresses.hardhat.GAME_REGISTRY,
  Addresses.goerli.GAME_REGISTRY,
  Addresses.polygon.GAME_REGISTRY
];

const queueAddresses = [
  Addresses.ganache.GAME_QUEUE,
  Addresses.mumbai.GAME_QUEUE,
  Addresses.bnbTest.GAME_QUEUE,
  Addresses.hardhat.GAME_QUEUE,
  Addresses.goerli.GAME_QUEUE,
  Addresses.polygon.GAME_QUEUE
];

const gameplayAddresses = [
  Addresses.ganache.GAMEPLAY,
  Addresses.mumbai.GAMEPLAY,
  Addresses.bnbTest.GAMEPLAY,
  Addresses.hardhat.GAMEPLAY,
  Addresses.goerli.GAMEPLAY,
  Addresses.polygon.GAMEPLAY
];

const contract = async (contractName, provider) => {
  let c;
  switch (contractName) {
    case "board":
      c = new provider.eth.Contract(
        HexplorationBoard.abi,
        boardAddresses[selectedChain]
      );
      break;
    case "controller":
      c = new provider.eth.Contract(
        HexplorationController,
        controllerAddresses[selectedChain]
      );
      break;
    case "summary":
      c = new provider.eth.Contract(
        GameSummary,
        summaryAddresses[selectedChain]
      );
      break;
    case "registry":
      c = new provider.eth.Contract(
        GameRegistry,
        registryAddresses[selectedChain]
      );
      break;
    case "queue":
      c = new provider.eth.Contract(Queue.abi, queueAddresses[selectedChain]);
      break;
    case "gameplay":
      c = new provider.eth.Contract(
        Gameplay.abi,
        gameplayAddresses[selectedChain]
      );
      break;
    default:
      break;
  }
  return c;
};

export default contract;
