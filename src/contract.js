import HexplorationBoard from "hexploration/build/contracts/HexplorationBoard.json";
import HexplorationController from "hexploration/build/contracts/HexplorationController.json";
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
    default:
      break;
  }
  return c;
};

export default contract;
