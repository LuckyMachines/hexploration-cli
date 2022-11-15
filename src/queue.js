import chalk from "chalk";
import inquirer from "inquirer";
import Contract from "./contract";

let currentAccount;
let board;
let queue;
let summary;

/*
    mapping(uint256 => bool) public inProcessingQueue; // game queue is in processing queue
    mapping(uint256 => ProcessingPhase) public currentPhase; // processingPhase
    mapping(uint256 => uint256) public queueID; // mapping from game ID to it's queue, updates to 0 when finished
    mapping(uint256 => uint256) public game; // mapping from queue ID to it's game ID
    mapping(uint256 => uint256[]) public players; // all players with moves to process
    mapping(uint256 => uint16) public totalPlayers; // total # of players who will be submitting

    // mappings from queue index => player id
    mapping(uint256 => mapping(uint256 => Action)) public submissionAction;
    mapping(uint256 => mapping(uint256 => string[])) public submissionOptions;
    mapping(uint256 => mapping(uint256 => string)) public submissionLeftHand;
    mapping(uint256 => mapping(uint256 => string)) public submissionRightHand;  
*/

export async function viewQueue(gameID, provider, account) {
  const accounts = await provider.eth.getAccounts();
  currentAccount = account ? account : accounts[0];

  console.log("View queue for game ID:", gameID);
  queue = await Contract("queue", provider);
  // console.log("Setting admin as queue controller");
  // await queue.methods
  //   .addVerifiedController(currentAccount)
  //   .send({ from: currentAccount, gas: "5000000" });

  summary = await Contract("summary", provider);
  board = await Contract("board", provider);
  let playerID = await summary.methods
    .getPlayerID(board._address, gameID, currentAccount)
    .call();
  console.log("Player ID:", playerID);

  const _queueID = await summary.methods
    .currentGameplayQueue(board._address, gameID)
    .call();

  console.log("Current queue:", _queueID);

  /// works to here

  let inProcessingQueue = await queue.methods
    .inProcessingQueue(_queueID)
    .call();
  let currentPhase = await queue.methods.currentPhase(_queueID).call();
  let queueID = await queue.methods.queueID(gameID).call();
  let game = await queue.methods.game(_queueID).call();

  let totalPlayers = await queue.methods.totalPlayers(_queueID).call();

  let players = await queue.methods.getAllPlayers(_queueID).call();

  let subAction = await queue.methods
    .submissionAction(_queueID, playerID)
    .call();
  let subOptions = await queue.methods
    .getSubmissionOptions(_queueID, playerID)
    .call();
  let subLeftHand = await queue.methods
    .submissionLeftHand(_queueID, playerID)
    .call();
  let subRightHand = await queue.methods
    .submissionRightHand(_queueID, playerID)
    .call();

  let playerSubmitted = await queue.methods
    .playerSubmitted(_queueID, playerID)
    .call();

  let isDayPhase = await queue.methods.isDayPhase(_queueID).call();

  let randomness = await queue.methods.getRandomness(_queueID).call();

  console.log("In processing queue:", inProcessingQueue);
  console.log("Is day phase:", isDayPhase);
  console.log("Current phase", currentPhase);
  console.log("Queue ID (from gameID)", queueID);
  console.log("Game ID (from queueID)", game);
  console.log("Total Players", totalPlayers);
  console.log("Players with moves:", players);
  console.log("Randomness:", randomness);

  console.log("submitted action:");
  console.log("Player Submitted:", playerSubmitted);
  console.log("Action:", subAction);
  console.log("Options", subOptions);
  console.log("LH:", subLeftHand);
  console.log("RH:", subRightHand);

  // simulate setting action for user
  /*
  const isDayPhase = ???
  await queue.methods
    .submitActionForPlayer(
      playerID,
      2,
      ["1,0", "1,1", "1,2", "1,3"],
      "Laser Sword",
      "Rusty Pistol",
      _queueID,
      isDayPhase
    )
    .send({ from: currentAccount, gas: "5000000" });
  subAction = await queue.methods.submissionAction(_queueID, playerID).call();
  subOptions = await queue.methods
    .getSubmissionOptions(_queueID, playerID)
    .call();
  subLeftHand = await queue.methods
    .submissionLeftHand(_queueID, playerID)
    .call();
  subRightHand = await queue.methods
    .submissionRightHand(_queueID, playerID)
    .call();

  playerSubmitted = await queue.methods
    .playerSubmitted(_queueID, playerID)
    .call();
  console.log("submitted action:");
  console.log("Player Submitted:", playerSubmitted);
  console.log("Action:", subAction);
  console.log("Options", subOptions);
  console.log("LH:", subLeftHand);
  console.log("RH:", subRightHand);
  */
}
