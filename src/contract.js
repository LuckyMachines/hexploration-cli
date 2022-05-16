import HexplorationBoard from "hexploration/build/contracts/HexplorationBoard.json";
import HexplorationController from "hexploration/build/contracts/HexplorationController.json";
import GameSummary from "hexploration/build/contracts/GameSummary.json";
import BoardWallet from "hexploration/build/contracts/BoardWallet.json";
import ZoneWallet from "hexploration/build/contracts/ZoneWallet.json";
import PlayerWallet from "hexploration/build/contracts/PlayerWallet.json";
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
      break;
    case "registry":
      c = new provider.eth.Contract(
        GameRegistry,
        Addresses.GANACHE_GAME_REGISTRY
      );
      break;
    case "boardWallet":
      c = new provider.eth.Contract(
        BoardWallet.abi,
        Addresses.GANACHE_BOARD_WALLET
      );
      break;
    case "zoneWallet":
      c = new provider.eth.Contract(
        ZoneWallet.abi,
        Addresses.GANACHE_ZONE_WALLET
      );
      break;
    case "playerWallet":
      c = new provider.eth.Contract(
        PlayerWallet.abi,
        Addresses.GANACHE_PLAYER_WALLET
      );
      break;
    default:
      break;
  }
  return c;
};

export default contract;
