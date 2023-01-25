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
  addressesDestination.goerli.GAME_QUEUE = DeploymentSource.goerli.GAME_QUEUE;
  addressesDestination.goerli.GAMEPLAY = DeploymentSource.goerli.GAMEPLAY;
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
  addressesDestination.mumbai.GAME_QUEUE = DeploymentSource.mumbai.GAME_QUEUE;
  addressesDestination.mumbai.GAMEPLAY = DeploymentSource.mumbai.GAMEPLAY;
}

if (network == "all" || network == "hh" || network == "hardhat") {
  addressesDestination.hh.GAME_REGISTRY = DeploymentSource.hh.GAME_REGISTRY;
  addressesDestination.hh.HEXPLORATION_BOARD =
    DeploymentSource.hh.HEXPLORATION_BOARD;
  addressesDestination.hh.HEXPLORATION_CONTROLLER =
    DeploymentSource.hh.HEXPLORATION_CONTROLLER;
  addressesDestination.hh.GAME_SUMMARY = DeploymentSource.hh.GAME_SUMMARY;
  addressesDestination.hh.PLAYER_SUMMARY = DeploymentSource.hh.PLAYER_SUMMARY;
  addressesDestination.hh.GAME_QUEUE = DeploymentSource.hh.GAME_QUEUE;
  addressesDestination.hh.GAMEPLAY = DeploymentSource.hh.GAMEPLAY;
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
