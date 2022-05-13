import { drawMap } from "./hexText";
import Contract from "./contract.js";

let controller;
let board;
let currentAccount;

export async function showMap(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  console.log("Show Map of Hexploration World with ID:", gameID);
  const startZone = await board.methods.initialPlayZone(gameID).call();
  // get active zones
  // get player locations
  // send all that to draw map

  let currentPlayerZone = "";
  let allPlayerZones = [];
  await drawMap(
    10,
    10,
    ["2,3", "3,4", "4,3", "3,3", "4,2", "4,1", "5,1"],
    startZone,
    currentPlayerZone,
    allPlayerZones
  );
}
