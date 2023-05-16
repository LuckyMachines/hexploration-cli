import { drawMap } from "./hexText";
import Contract from "./contract.js";

//let controller;
let board;
let summary;
let playerSummary;
let currentAccount;

export async function showMap(network, gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];
  board = await Contract(network, "board", provider);
  summary = await Contract(network, "summary", provider);
  playerSummary = await Contract(network, "playerSummary", provider);

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
  const playerID = await playerSummary.methods
    .getPlayerID(board._address, gameID, currentAccount)
    .call();
  const artifacts = await summary.methods
    .recoveredArtifacts(board._address, gameID)
    .call();
  const totalPlayers = await summary.methods
    .totalPlayers(board._address, gameID)
    .call();
  console.log(`Current Player: P${playerID}`);
  await drawMap(
    Number(mapSize.rows),
    Number(mapSize.columns),
    activeZones,
    startZone,
    currentPlayerZone,
    allPlayerZones,
    gamePhase,
    dayNumber,
    artifacts,
    totalPlayers
  );
}
