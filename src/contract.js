const Ethers = require("ethers");

import GameRegistry from "@luckymachines/game-core/contracts/abi/v0.0/GameRegistry.json";

// Game-core ABIs
import GameSummary from "@luckymachines/game-core/games/hexploration/abi/GameSummary.json";
import PlayerSummary from "@luckymachines/game-core/games/hexploration/abi/PlayerSummary.json";
import HexplorationController from "@luckymachines/game-core/games/hexploration/abi/HexplorationController.json";

// Extra ABIs for admin functionality
import HexplorationBoard from "hexploration/abi/HexplorationBoard.json";
import Queue from "hexploration/abi/HexplorationQueue.json";
import Gameplay from "hexploration/abi/HexplorationGameplay.json";
import GameSetup from "hexploration/abi/GameSetup.json";

import Addresses from "../settings/ContractAddresses.json";
import Network from "../settings/Network.json";
// const Addresses = require(`${process.cwd()}/settings/ContractAddresses.json`);
// console.log("Addresses", Addresses);

const network =
  Network.network == "hardhat"
    ? "hh"
    : Network.network == "hh-lan"
    ? "hh"
    : Network.network;

const boardAddress = Addresses[network].HEXPLORATION_BOARD;
const controllerAddress = Addresses[network].HEXPLORATION_CONTROLLER;
const summaryAddress = Addresses[network].GAME_SUMMARY;
const playerSummaryAddress = Addresses[network].PLAYER_SUMMARY;
const registryAddress = Addresses[network].GAME_REGISTRY;
const queueAddress = Addresses[network].GAME_QUEUE;
const gameplayAddress = Addresses[network].GAMEPLAY;
const gameSetupAddress = Addresses[network].GAME_SETUP;

const contract = async (contractName, provider, ethersWallet) => {
  let c;
  switch (contractName) {
    case "board":
      c = ethersWallet
        ? new Ethers.Contract(boardAddress, HexplorationBoard, ethersWallet)
        : new provider.eth.Contract(HexplorationBoard, boardAddress);
      break;
    case "controller":
      c = ethersWallet
        ? new Ethers.Contract(
            controllerAddress,
            HexplorationController,
            ethersWallet
          )
        : new provider.eth.Contract(HexplorationController, controllerAddress);
      break;
    case "gameSetup":
      c = ethersWallet
        ? new Ethers.Contract(gameSetupAddress, GameSetup, ethersWallet)
        : new provider.eth.Contract(GameSetup, gameSetupAddress);
      break;
    case "summary":
    case "gameSummary":
      c = ethersWallet
        ? new Ethers.Contract(summaryAddress, GameSummary, ethersWallet)
        : new provider.eth.Contract(GameSummary, summaryAddress);
      break;
    case "playerSummary":
      c = ethersWallet
        ? new Ethers.Contract(playerSummaryAddress, PlayerSummary, ethersWallet)
        : new provider.eth.Contract(PlayerSummary, playerSummaryAddress);
      break;
    case "registry":
      c = ethersWallet
        ? new Ethers.Contract(registryAddress, GameRegistry, ethersWallet)
        : new provider.eth.Contract(GameRegistry, registryAddress);
      break;
    case "queue":
      c = ethersWallet
        ? new Ethers.Contract(queueAddress, Queue, ethersWallet)
        : new provider.eth.Contract(Queue, queueAddress);
      break;
    case "gameplay":
      c = ethersWallet
        ? new Ethers.Contract(gameplayAddress, Gameplay, ethersWallet)
        : new provider.eth.Contract(Gameplay, gameplayAddress);
      break;
    default:
      break;
  }
  return c;
};

export default contract;
