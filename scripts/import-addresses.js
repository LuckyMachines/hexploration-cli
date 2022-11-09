// import addresses from some deployments.json
// into settings/ContractAddresses.json

// pass:

const fs = require("fs");
const deploymentsFile = process.argv[2];
const DeploymentSource = require(`${deploymentsFile}`);
const addressesPath = `${process.cwd()}/settings/ContractAddresses.json`;
const addressesDestination = require(addressesPath);

addressesDestination.goerli.GAME_REGISTRY =
  DeploymentSource.goerli.GAME_REGISTRY;
addressesDestination.goerli.HEXPLORATION_BOARD =
  DeploymentSource.goerli.HEXPLORATION_BOARD;
addressesDestination.goerli.HEXPLORATION_CONTROLLER =
  DeploymentSource.goerli.HEXPLORATION_CONTROLLER;
addressesDestination.goerli.GAME_SUMMARY = DeploymentSource.goerli.GAME_SUMMARY;
addressesDestination.goerli.GAME_QUEUE = DeploymentSource.goerli.GAME_QUEUE;
addressesDestination.goerli.GAMEPLAY = DeploymentSource.goerli.GAMEPLAY;

addressesDestination.mumbai.GAME_REGISTRY =
  DeploymentSource.mumbai.GAME_REGISTRY;
addressesDestination.mumbai.HEXPLORATION_BOARD =
  DeploymentSource.mumbai.HEXPLORATION_BOARD;
addressesDestination.mumbai.HEXPLORATION_CONTROLLER =
  DeploymentSource.mumbai.HEXPLORATION_CONTROLLER;
addressesDestination.mumbai.GAME_SUMMARY = DeploymentSource.mumbai.GAME_SUMMARY;
addressesDestination.mumbai.GAME_QUEUE = DeploymentSource.mumbai.GAME_QUEUE;
addressesDestination.mumbai.GAMEPLAY = DeploymentSource.mumbai.GAMEPLAY;

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
