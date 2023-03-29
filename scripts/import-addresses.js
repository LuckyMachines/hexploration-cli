// import addresses from some deployments.json
// into settings/ContractAddresses.json

// pass: deployments.json

const fs = require("fs");
const deploymentsFile = process.argv[2];
const network = process.argv[3] ? process.argv[3] : "all";
const DeploymentSource = require(`${deploymentsFile}`);
const addressesPath = `${process.cwd()}/settings/ContractAddresses.json`;
const addressesDestination = require(addressesPath);

if (network == "all" || network == "goerli") {
  addressesDestination.goerli.GAME_REGISTRY =
    DeploymentSource.goerli.GAME_REGISTRY;
  addressesDestination.goerli.HEXPLORATION_BOARD =
    DeploymentSource.goerli.HEXPLORATION_BOARD;
  addressesDestination.goerli.HEXPLORATION_CONTROLLER =
    DeploymentSource.goerli.HEXPLORATION_CONTROLLER;
  addressesDestination.goerli.GAME_SUMMARY =
    DeploymentSource.goerli.GAME_SUMMARY;
  addressesDestination.goerli.PLAYER_SUMMARY =
    DeploymentSource.goerli.PLAYER_SUMMARY;
  addressesDestination.goerli.PLAY_ZONE_SUMMARY =
    DeploymentSource.goerli.PLAY_ZONE_SUMMARY;
  addressesDestination.goerli.GAME_QUEUE = DeploymentSource.goerli.GAME_QUEUE;
  addressesDestination.goerli.GAMEPLAY = DeploymentSource.goerli.GAMEPLAY;
  addressesDestination.goerli.GAME_SETUP = DeploymentSource.goerli.GAME_SETUP;
}

if (network == "all" || network == "mumbai") {
  addressesDestination.mumbai.GAME_REGISTRY =
    DeploymentSource.mumbai.GAME_REGISTRY;
  addressesDestination.mumbai.HEXPLORATION_BOARD =
    DeploymentSource.mumbai.HEXPLORATION_BOARD;
  addressesDestination.mumbai.HEXPLORATION_CONTROLLER =
    DeploymentSource.mumbai.HEXPLORATION_CONTROLLER;
  addressesDestination.mumbai.GAME_SUMMARY =
    DeploymentSource.mumbai.GAME_SUMMARY;
  addressesDestination.mumbai.PLAYER_SUMMARY =
    DeploymentSource.mumbai.PLAYER_SUMMARY;
  addressesDestination.mumbai.PLAY_ZONE_SUMMARY =
    DeploymentSource.mumbai.PLAY_ZONE_SUMMARY;
  addressesDestination.mumbai.GAME_QUEUE = DeploymentSource.mumbai.GAME_QUEUE;
  addressesDestination.mumbai.GAMEPLAY = DeploymentSource.mumbai.GAMEPLAY;
  addressesDestination.mumbai.GAME_SETUP = DeploymentSource.mumbai.GAME_SETUP;
}

if (network == "all" || network == "hh" || network == "hardhat") {
  addressesDestination.hh.GAME_REGISTRY = DeploymentSource.hh.GAME_REGISTRY;
  addressesDestination.hh.HEXPLORATION_BOARD =
    DeploymentSource.hh.HEXPLORATION_BOARD;
  addressesDestination.hh.HEXPLORATION_CONTROLLER =
    DeploymentSource.hh.HEXPLORATION_CONTROLLER;
  addressesDestination.hh.GAME_SUMMARY = DeploymentSource.hh.GAME_SUMMARY;
  addressesDestination.hh.PLAYER_SUMMARY = DeploymentSource.hh.PLAYER_SUMMARY;
  addressesDestination.hh.PLAY_ZONE_SUMMARY =
    DeploymentSource.hh.PLAY_ZONE_SUMMARY;
  addressesDestination.hh.GAME_QUEUE = DeploymentSource.hh.GAME_QUEUE;
  addressesDestination.hh.GAMEPLAY = DeploymentSource.hh.GAMEPLAY;
  addressesDestination.hh.GAME_SETUP = DeploymentSource.hh.GAME_SETUP;
}

if (network == "all" || network == "ganache") {
  addressesDestination.ganache.GAME_REGISTRY =
    DeploymentSource.ganache.GAME_REGISTRY;
  addressesDestination.ganache.HEXPLORATION_BOARD =
    DeploymentSource.ganache.HEXPLORATION_BOARD;
  addressesDestination.ganache.HEXPLORATION_CONTROLLER =
    DeploymentSource.ganache.HEXPLORATION_CONTROLLER;
  addressesDestination.ganache.GAME_SUMMARY =
    DeploymentSource.ganache.GAME_SUMMARY;
  addressesDestination.ganache.PLAYER_SUMMARY =
    DeploymentSource.ganache.PLAYER_SUMMARY;
  addressesDestination.ganache.PLAY_ZONE_SUMMARY =
    DeploymentSource.ganache.PLAY_ZONE_SUMMARY;
  addressesDestination.ganache.GAME_QUEUE = DeploymentSource.ganache.GAME_QUEUE;
  addressesDestination.ganache.GAMEPLAY = DeploymentSource.ganache.GAMEPLAY;
  addressesDestination.ganache.GAME_SETUP = DeploymentSource.ganache.GAME_SETUP;
}

if (network == "all" || network == "godwoken_test") {
  addressesDestination.godwoken_test.GAME_REGISTRY =
    DeploymentSource.godwoken_test.GAME_REGISTRY;
  addressesDestination.godwoken_test.HEXPLORATION_BOARD =
    DeploymentSource.godwoken_test.HEXPLORATION_BOARD;
  addressesDestination.godwoken_test.HEXPLORATION_CONTROLLER =
    DeploymentSource.godwoken_test.HEXPLORATION_CONTROLLER;
  addressesDestination.godwoken_test.GAME_SUMMARY =
    DeploymentSource.godwoken_test.GAME_SUMMARY;
  addressesDestination.godwoken_test.PLAYER_SUMMARY =
    DeploymentSource.godwoken_test.PLAYER_SUMMARY;
  addressesDestination.godwoken_test.PLAY_ZONE_SUMMARY =
    DeploymentSource.godwoken_test.PLAY_ZONE_SUMMARY;
  addressesDestination.godwoken_test.GAME_QUEUE =
    DeploymentSource.godwoken_test.GAME_QUEUE;
  addressesDestination.godwoken_test.GAMEPLAY =
    DeploymentSource.godwoken_test.GAMEPLAY;
  addressesDestination.godwoken_test.GAME_SETUP =
    DeploymentSource.godwoken_test.GAME_SETUP;
}

if (network == "all" || network == "sepolia") {
  addressesDestination.sepolia.GAME_REGISTRY =
    DeploymentSource.sepolia.GAME_REGISTRY;
  addressesDestination.sepolia.HEXPLORATION_BOARD =
    DeploymentSource.sepolia.HEXPLORATION_BOARD;
  addressesDestination.sepolia.HEXPLORATION_CONTROLLER =
    DeploymentSource.sepolia.HEXPLORATION_CONTROLLER;
  addressesDestination.sepolia.GAME_SUMMARY =
    DeploymentSource.sepolia.GAME_SUMMARY;
  addressesDestination.sepolia.PLAYER_SUMMARY =
    DeploymentSource.sepolia.PLAYER_SUMMARY;
  addressesDestination.sepolia.PLAY_ZONE_SUMMARY =
    DeploymentSource.sepolia.PLAY_ZONE_SUMMARY;
  addressesDestination.sepolia.GAME_QUEUE = DeploymentSource.sepolia.GAME_QUEUE;
  addressesDestination.sepolia.GAMEPLAY = DeploymentSource.sepolia.GAMEPLAY;
  addressesDestination.sepolia.GAME_SETUP = DeploymentSource.sepolia.GAME_SETUP;
}

const finalAddresses = JSON.stringify(addressesDestination, null, 4);

fs.writeFile(addressesPath, finalAddresses, (err) => {
  if (!err) {
    console.log("done");
    process.exit();
  } else {
    console.log("error: unable to save hexploration deployments");
    process.exit();
  }
});
