import chalk from "chalk";

// Draws a character sheet for a player in ASCII art
const leftPadText = (text, length) => {
  if (text.length > length) {
    text = text.substring(0, length);
  }
  let spaces = length - text.length;
  return " ".repeat(spaces > 0 ? spaces : 0) + text;
};
const rightPadText = (text, length) => {
  if (text.length > length) {
    text = text.substring(0, length);
  }
  let spaces = length - text.length;
  return text + " ".repeat(spaces > 0 ? spaces : 0);
};
const centerPadText = (text, length) => {
  if (text.length > length) {
    text = text.substring(0, length);
  }
  let spaces = length - text.length;
  let leftSpace = Math.floor(spaces / 2);
  let rightSpace = spaces - leftSpace;
  return (
    " ".repeat(leftSpace > 0 ? leftSpace : 0) +
    text +
    " ".repeat(rightSpace > 0 ? rightSpace : 0)
  );
};

const splitText = (text, length) => {
  let words = text.split(" ");
  let lines = [];
  let line = "";

  for (let i = 0; i < words.length; i++) {
    if ((line + words[i] + " ").length <= length) {
      line += words[i] + " ";
    } else {
      lines.push(` ${line.trim()}`);
      line = words[i] + " ";
    }

    if (i === words.length - 1) {
      lines.push(` ${line.trim()}`);
    }
  }

  return lines;
};

/*
+-------------------------------------+
|                                     |
|                 Event               |
|                                     |
+=====================================+
|                                     | 
|          Mysterious Signal          |
|                                     |
|                                     |
|  Your equipment picks up a strange  |
| signal. It could be a distress call |
|    or something more sinister...    |
|                                     |
| 0-1 You hear the signal, but it's   |
| too faint to locate its origin or   |
| understand its meaning.             |
|                                     |
| 2-4 You try to decipher the strange |
| signal but it remains a mystery.    |
|                                     |
| 5+  You trace the strange signal    |
| and find a hidden cache of alien    |
| technology. +1 MOV                  |
|                                     |
+-------------------------------------+
*/

const displayCard = (card) => {
  // console.log("Inside displayCard");
  // console.log("card type:", card.cardType);
  // console.log("card title:", card.cardTitle);
  // console.log("card text:", card.cardText);
  // console.log("outcomes:", card.cardOutcomes);
  // console.log("outcome roll thresholds:", card.cardRollThresholds);
  // console.log("roll type:", card.cardRollType);
  // console.log("outcome index:", card.cardOutcomeIndex);

  let cardWidth = 37; // change to your desired card width
  const emptyLine = "|" + rightPadText("", cardWidth) + "|";
  let cardBodyTexts = [
    card.cardText,
    `${card.cardRollThresholds[0]}-${Number(card.cardRollThresholds[1]) - 1} ${
      card.cardOutcomes[0]
    }`,
    `${card.cardRollThresholds[1]}-${Number(card.cardRollThresholds[2]) - 1} ${
      card.cardOutcomes[1]
    }`,
    `${card.cardRollThresholds[2]}+ ${card.cardOutcomes[2]}`
  ];

  console.log("+" + "-".repeat(cardWidth) + "+");
  console.log(emptyLine);
  console.log("|" + centerPadText(card.cardType, cardWidth) + "|");
  console.log(emptyLine);
  console.log("+" + "=".repeat(cardWidth) + "+");
  console.log(emptyLine);
  console.log("|" + centerPadText(card.cardTitle, cardWidth) + "|");
  console.log(emptyLine);
  for (let i = 0; i < cardBodyTexts.length; i++) {
    let textLines = splitText(cardBodyTexts[i], cardWidth);
    for (let j = 0; j < textLines.length; j++) {
      let textBlock;
      if (i == 0) {
        textBlock = "|" + centerPadText(textLines[j], cardWidth) + "|";
      } else {
        textBlock = "|" + rightPadText(textLines[j], cardWidth) + "|";
      }
      if (i > 0 && i != card.cardOutcomeIndex + 1) {
        textBlock = chalk.gray(textBlock);
      }
      if (i == 0 || (i > 0 && i < 3 && card.cardType != "Treasure") || i == 3) {
        console.log(textBlock);
      }
    }
    if (i == 0 && card.cardType != "Treasure") {
      console.log(emptyLine);
      console.log(
        "|" + rightPadText(` Roll Type: ${card.cardRollType}`, cardWidth) + "|"
      );
    }
    console.log(emptyLine);
  }

  console.log("+" + "-".repeat(cardWidth) + "+");
};

// display an array of cards
const displayCards = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    displayCard(cards[i]);
  }
};

const displayPlayerInfo = (playerProfile) => {
  // Generate ASCII art
  const playerColors = { 1: "red", 2: "magenta", 3: "blue", 4: "yellow" };
  const colorBadge = chalk[playerColors[playerProfile.playerID]].bold(
    centerPadText("[" + playerProfile.badge + "]", 12)
  );

  console.log(`
          _-----_        ______________________________
         /  MMM  \\      |o| ${rightPadText(
           `Player ${playerProfile.playerID}${
             playerProfile.name == "" ? "" : " - " + playerProfile.name
           }`,
           24
         )} |o|
        |  /o o\\  |     |o|                          |o|
        | (  C  ) |     |o| Movement Range:${leftPadText(
          `${playerProfile.movement}/${playerProfile.totalMovement}`,
          9
        )} |o|
         \\ \\_W_/ /      |o| Agility:${leftPadText(
           `${playerProfile.agility}/${playerProfile.totalAgility}`,
           16
         )} |o|
        _/=======\\_     |o| Dexterity:${leftPadText(
          `${playerProfile.dexterity}/${playerProfile.totalDexterity}`,
          14
        )} |o|
       /           \\    |o|                          |o|
      / ${colorBadge}\\   |o| Campsite:${leftPadText(
    playerProfile.campsite,
    15
  )} |o|
     /  /|       |\\  \\  |o| Left Hand:${leftPadText(
       playerProfile.leftHand,
       14
     )} |o|
    (===)\\=======/(===) |o| Right Hand:${leftPadText(
      playerProfile.rightHand,
      13
    )} |o|
      \\_|    |    |_/   |o| Status:${leftPadText(playerProfile.status, 17)} |o|
        |   / \\   |     |o| Artifact:${leftPadText(
          playerProfile.artifact,
          15
        )} |o|
        |  |   |  |     |o| Relic:${leftPadText(playerProfile.relic, 18)} |o|
        |  |   |  |     |o| Shield:${leftPadText(playerProfile.shield, 17)} |o|
        \\__/   \\__/     |o|                          |o|
        (==)   (==)     |o| ${rightPadText(playerProfile.teamRole, 24)} |o|
       (____) (____)    |o|__________________________|o|
        """"   """"`);
};

const displayStats = (data) => {
  // console.log("Inside displayStats...");
  if (data.inventoryChanges && data.inventoryChanges.length >= 3) {
    if (data.inventoryChanges[0] != "") {
      console.log("Item loss:", data.inventoryChanges[0]);
    }
    if (data.inventoryChanges[1] != "") {
      console.log("Item gain:", data.inventoryChanges[1]);
    }
    if (data.inventoryChanges[2] != "") {
      console.log("Hand loss:", data.inventoryChanges[2]);
    }
  } else {
    console.log("Inventory changes is undefined");
  }

  // console.log("Stat Updates:", data.statUpdates);
  // check if statUpdates is defined and has at least 3 elements
  if (data.statUpdates && data.statUpdates.length >= 3) {
    if (
      data.statUpdates[0] != 0 ||
      data.statUpdates[1] != 0 ||
      data.statUpdates[2] != 0
    ) {
      console.log("Stat Updates:");
    }
    if (data.statUpdates[0] > 0) {
      console.log(`Movement: +${data.statUpdates[0]}`);
    } else if (data.statUpdates[0] < 0) {
      console.log(`Movement: ${data.statUpdates[0]}`);
    }

    if (data.statUpdates[1] > 0) {
      console.log(`Agility: +${data.statUpdates[1]}`);
    } else if (data.statUpdates[1] < 0) {
      console.log(`Agility: ${data.statUpdates[1]}`);
    }

    if (data.statUpdates[2] > 0) {
      console.log(`Dexterity: +${data.statUpdates[2]}`);
    } else if (data.statUpdates[2] < 0) {
      console.log(`Dexterity: ${data.statUpdates[2]}`);
    }
  }
};

export { displayPlayerInfo, displayCard, displayCards, displayStats };
