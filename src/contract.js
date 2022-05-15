import HexplorationBoard from "hexploration/build/contracts/HexplorationBoard.json";
import HexplorationController from "hexploration/build/contracts/HexplorationController.json";
import GameSummary from "hexploration/build/contracts/GameSummary.json";
import GameRegistry from "@luckymachines/game-core/contracts/abi/v0.0/GameRegistry.json";
import Addresses from "../settings/ContractAddresses.js";
//TODO: update for multiple chains
const contract = async (contractName, provider) => {
  let c;
  switch (contractName) {
    case "board":
      c = new provider.eth.Contract(
        HexplorationBoard.abi,
        Addresses.GANACHE_HEXPLORATION_BOARD
      );
      break;
    case "controller":
      c = new provider.eth.Contract(
        HexplorationController.abi,
        Addresses.GANACHE_HEXPLORATION_CONTROLLER
      );
      break;
    case "summary":
      c = new provider.eth.Contract(
        GameSummary.abi,
        Addresses.GANACHE_GAME_SUMMARY
      );
    case "registry":
      c = new provider.eth.Contract(
        GameRegistry,
        Addresses.GANACHE_GAME_REGISTRY
      );
    default:
      break;
  }
  return c;
};

export default contract;
