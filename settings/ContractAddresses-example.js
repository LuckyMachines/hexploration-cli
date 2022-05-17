// Change the name of this to ContractAddresses.js and set your locally deployed addresses
const contractAddresses = {
  // in lm-game-workshop/settings/addresses.json
  GANACHE_GAME_REGISTRY: "",
  // in lm-game-workshop/hexploration/resources.json
  GANACHE_HEXPLORATION_BOARD: "",
  GANACHE_HEXPLORATION_CONTROLLER: "",
  // copy from command line during deployments
  GANACHE_GAME_SUMMARY: "",
  // FOR ADMIN ACCESS:
  GANACHE_HEXPLORATION_QUEUE: "",
  GANACHE_HEXPLORATION_GAMEPLAY: ""

  //ADD DEPLOYED CONTRACTS TO PLAY ON MORE CHAINS
  // _HEXPLORATION_BOARD: "",
  // _HEXPLORATION_CONTROLLER: "",
  // _GAME_REGISTRY: "",
  // _GAME_SUMMARY: "",
};

module.exports = contractAddresses;
