import HexplorationBoard from "hexploration-deployments/artifacts/contracts/HexplorationBoard.sol/HexplorationBoard.json";
import Queue from "hexploration-deployments/artifacts/contracts/HexplorationQueue.sol/HexplorationQueue.json";
import Gameplay from "hexploration-deployments/artifacts/contracts/HexplorationGameplay.sol/HexplorationGameplay.json";
import GameRegistry from "@luckymachines/game-core/contracts/abi/v0.0/GameRegistry.json";

// The following are the ABI, not an object with an ABI property
import GameSummary from "@luckymachines/game-core/games/hexploration/abi/GameSummary.json";
import HexplorationController from "@luckymachines/game-core/games/hexploration/abi/HexplorationController.json";
import Addresses from "../settings/ContractAddresses.js";

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
  Addresses.GANACHE_HEXPLORATION_BOARD,
  Addresses.MUMBAI_HEXPLORATION_BOARD,
  Addresses.BINANCE_TEST_HEXPLORATION_BOARD
];

const controllerAddresses = [
  Addresses.GANACHE_HEXPLORATION_CONTROLLER,
  Addresses.MUMBAI_HEXPLORATION_CONTROLLER,
  Addresses.BINANCE_TEST_HEXPLORATION_CONTROLLER
];

const summaryAddresses = [
  Addresses.GANACHE_GAME_SUMMARY,
  Addresses.MUMBAI_GAME_SUMMARY,
  Addresses.BINANCE_TEST_GAME_SUMMARY
];

const registryAddresses = [
  Addresses.GANACHE_GAME_REGISTRY,
  Addresses.MUMBAI_GAME_REGISTRY,
  Addresses.BINANCE_TEST_GAME_REGISTRY
];

const queueAddresses = [
  Addresses.GANACHE_HEXPLORATION_QUEUE,
  Addresses.MUMBAI_HEXPLORATION_QUEUE,
  Addresses.BINANCE_TEST_HEXPLORATION_QUEUE
];

const gameplayAddresses = [
  Addresses.GANACHE_HEXPLORATION_GAMEPLAY,
  Addresses.MUMBAI_HEXPLORATION_GAMEPLAY,
  Addresses.BINANCE_TEST_HEXPLORATION_GAMEPLAY
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
