const Ethers = require("ethers");

import GameRegistry from "@luckymachines/game-core/contracts/abi/v0.0/GameRegistry.json";
import PlayerRegistry from "@luckymachines/game-core/contracts/abi/v0.0/PlayerRegistry.json";

// Game-core ABIs
import GameSummary from "@luckymachines/game-core/games/hexploration/abi/GameSummary.json";
import PlayerSummary from "@luckymachines/game-core/games/hexploration/abi/PlayerSummary.json";
import PlayZoneSummary from "@luckymachines/game-core/games/hexploration/abi/PlayZoneSummary.json";
import HexplorationController from "@luckymachines/game-core/games/hexploration/abi/HexplorationController.json";
// Extra ABIs for admin functionality
// TODO: add these ABIs into game-core
import HexplorationBoard from "@luckymachines/game-core/games/hexploration/abi/HexplorationBoard.json";
import Queue from "@luckymachines/game-core/games/hexploration/abi/HexplorationQueue.json";
import Gameplay from "@luckymachines/game-core/games/hexploration/abi/HexplorationGameplay.json";
import GameSetup from "@luckymachines/game-core/games/hexploration/abi/GameSetup.json";

import Addresses from "@luckymachines/game-core/games/hexploration/deployments.json";

const contract = async (network, contractName, provider, ethersWallet) => {
  const boardAddress = Addresses[network].HEXPLORATION_BOARD;
  const controllerAddress = Addresses[network].HEXPLORATION_CONTROLLER;
  const summaryAddress = Addresses[network].GAME_SUMMARY;
  const playerSummaryAddress = Addresses[network].PLAYER_SUMMARY;
  const playZoneSummaryAddress = Addresses[network].PLAY_ZONE_SUMMARY;
  const registryAddress = Addresses[network].GAME_REGISTRY;
  const queueAddress = Addresses[network].GAME_QUEUE;
  const gameplayAddress = Addresses[network].GAMEPLAY;
  const gameSetupAddress = Addresses[network].GAME_SETUP;
  const playerRegistryAddress = Addresses[network].PLAYER_REGISTRY;
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
    case "playZoneSummary":
      c = ethersWallet
        ? new Ethers.Contract(
            playZoneSummaryAddress,
            PlayZoneSummary,
            ethersWallet
          )
        : new provider.eth.Contract(PlayZoneSummary, playZoneSummaryAddress);
      break;
    case "registry":
      c = ethersWallet
        ? new Ethers.Contract(registryAddress, GameRegistry, ethersWallet)
        : new provider.eth.Contract(GameRegistry, registryAddress);
      break;
    case "playerRegistry":
      c = ethersWallet
        ? new Ethers.Contract(
            playerRegistryAddress,
            PlayerRegistry,
            ethersWallet
          )
        : new provider.eth.Contract(PlayerRegistry, playerRegistryAddress);
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
