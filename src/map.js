import { drawMap } from "./hexText";
import Contract from "./contract.js";

//let controller;
let board;
let summary;
let playerSummary;
let currentAccount;

// TODO: get size of board from contract

export async function showMap(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  board = await Contract("board", provider);
  summary = await Contract("summary", provider);
  playerSummary = await Contract("playerSummary", provider);

  const startZone = await summary.methods
    .landingSite(board._address, gameID)
    .call();
  const activeZones = await summary.methods
    .activeZones(board._address, gameID)
    .call();
  const currentPlayerZone = await playerSummary.methods
    .currentLocation(board._address, gameID)
    .call({ from: currentAccount });
  const allPlayerZones = await summary.methods
    .allPlayerLocations(board._address, gameID)
    .call();
  const mapSize = await summary.methods.boardSize(board._address).call();
  const gamePhase = await summary.methods
    .currentPhase(board._address, gameID)
    .call();
  // console.log(summary.methods);
  const dayNumber = await summary.methods
    .currentDay(board._address, gameID)
    .call();
  //console.log("Map size:", mapSize);
  await drawMap(
    Number(mapSize.rows),
    Number(mapSize.columns),
    activeZones,
    startZone,
    currentPlayerZone,
    allPlayerZones,
    gamePhase,
    dayNumber
  );
}
