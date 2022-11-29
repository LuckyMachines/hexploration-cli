import Ethers from "ethers";

import GameRegistry from "@luckymachines/game-core/contracts/abi/v0.0/GameRegistry.json";

// Game-core ABIs
import GameSummary from "@luckymachines/game-core/games/hexploration/abi/GameSummary.json";
import PlayerSummary from "@luckymachines/game-core/games/hexploration/abi/PlayerSummary.json";
import HexplorationController from "@luckymachines/game-core/games/hexploration/abi/HexplorationController.json";

// Extra ABIs for admin functionality
import HexplorationBoard from "hexploration/abi/HexplorationBoard.json";
import Queue from "hexploration/abi/HexplorationQueue.json";
import Gameplay from "hexploration/abi/HexplorationGameplay.json";

import Addresses from "../settings/ContractAddresses.json";
// const Addresses = require(`${process.cwd()}/settings/ContractAddresses.json`);
// console.log("Addresses", Addresses);

//UNCOMMENT SELECTED CHAIN
// const selectedChain = 0; //Ganache
const selectedChain = 1; //Mumbai
// const selectedChain = 2; //Binance Test

// const selectedChain = 3; // Hardhat
// const selectedChain = 4; // Goerli
// const selectedChain = 5; // Polygon

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

const playerSummaryAddresses = [
  Addresses.ganache.PLAYER_SUMMARY,
  Addresses.mumbai.PLAYER_SUMMARY,
  Addresses.bnbTest.PLAYER_SUMMARY,
  Addresses.hardhat.PLAYER_SUMMARY,
  Addresses.goerli.PLAYER_SUMMARY,
  Addresses.polygon.PLAYER_SUMMARY
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

const contract = async (contractName, provider, ethersWallet) => {
  let c;
  switch (contractName) {
    case "board":
      c = ethersWallet
        ? new Ethers.Contract(
            boardAddresses[selectedChain],
            HexplorationBoard,
            ethersWallet
          )
        : new provider.eth.Contract(
            HexplorationBoard,
            boardAddresses[selectedChain]
          );
      break;
    case "controller":
      c = ethersWallet
        ? new Ethers.Contract(
            controllerAddresses[selectedChain],
            HexplorationController,
            ethersWallet
          )
        : new provider.eth.Contract(
            HexplorationController,
            controllerAddresses[selectedChain]
          );
      break;
    case "summary":
    case "gameSummary":
      c = ethersWallet
        ? new Ethers.Contract(
            summaryAddresses[selectedChain],
            GameSummary,
            ethersWallet
          )
        : new provider.eth.Contract(
            GameSummary,
            summaryAddresses[selectedChain]
          );
      break;
    case "playerSummary":
      c = ethersWallet
        ? new Ethers.Contract(
            playerSummaryAddresses[selectedChain],
            PlayerSummary,
            ethersWallet
          )
        : new provider.eth.Contract(
            PlayerSummary,
            playerSummaryAddresses[selectedChain]
          );
      break;
    case "registry":
      c = ethersWallet
        ? new Ethers.Contract(
            registryAddresses[selectedChain],
            GameRegistry,
            ethersWallet
          )
        : new provider.eth.Contract(
            GameRegistry,
            registryAddresses[selectedChain]
          );
      break;
    case "queue":
      c = ethersWallet
        ? new Ethers.Contract(
            queueAddresses[selectedChain],
            Queue,
            ethersWallet
          )
        : new provider.eth.Contract(Queue, queueAddresses[selectedChain]);
      break;
    case "gameplay":
      c = ethersWallet
        ? new Ethers.Contract(
            gameplayAddresses[selectedChain],
            Gameplay,
            ethersWallet
          )
        : new provider.eth.Contract(Gameplay, gameplayAddresses[selectedChain]);
      break;
    default:
      break;
  }
  return c;
};

export default contract;
