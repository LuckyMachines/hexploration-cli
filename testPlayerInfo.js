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
  console.log("Inside displayCard");
  console.log("card type:", card.cardType);
  console.log("card title:", card.cardTitle);
  console.log("card text:", card.cardText);
  console.log("outcomes:", card.cardOutcomes);
  console.log("outcome roll thresholds:", card.cardRollThresholds);
  console.log("roll type:", card.cardRollType);
  console.log("outcome index:", card.cardOutcomeIndex);

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
      if (i == 0) {
        console.log("|" + centerPadText(textLines[j], cardWidth) + "|");
      } else {
        console.log("|" + rightPadText(textLines[j], cardWidth) + "|");
      }
    }
    if (i == 0) {
      console.log(emptyLine);
      console.log(
        "|" + rightPadText(` Roll Type: ${card.cardRollType}`, cardWidth) + "|"
      );
    }
    console.log(emptyLine);
  }

  console.log("+" + "-".repeat(cardWidth) + "+");
};

const displayPlayerInfo = (
  playerID,
  name,
  badge,
  movement,
  totalMovement,
  agility,
  totalAgility,
  dexterity,
  totalDexterity,
  campsite,
  leftHand,
  rightHand,
  status,
  artifact,
  relic,
  shield,
  teamRole
) => {
  // Generate ASCII art
  console.log(`
          _-----_        ______________________________
         /  MMM  \\      |o| ${rightPadText(
           `Player ${playerID}${name == "" ? "" : " - " + name}`,
           24
         )} |o|
        |  /o o\\  |     |o|                          |o|
        | (  C  ) |     |o| Movement Range:${leftPadText(
          `${movement}/${totalMovement}`,
          9
        )} |o|
         \\ \\_W_/ /      |o| Agility:${leftPadText(
           `${agility}/${totalAgility}`,
           16
         )} |o|
        _/=======\\_     |o| Dexterity:${leftPadText(
          `${dexterity}/${totalDexterity}`,
          14
        )} |o|
       /           \\    |o|                          |o|
      / ${centerPadText(`[${badge}]`, 12)}\\   |o| Campsite:${leftPadText(
    campsite,
    15
  )} |o|
     /  /|       |\\  \\  |o| Left Hand:${leftPadText(leftHand, 14)} |o|
    (===)\\=======/(===) |o| Right Hand:${leftPadText(rightHand, 13)} |o|
      \\_|    |    |_/   |o| Status:${leftPadText(status, 17)} |o|
        |   / \\   |     |o| Artifact:${leftPadText(artifact, 15)} |o|
        |  |   |  |     |o| Relic:${leftPadText(relic, 18)} |o|
        |  |   |  |     |o| Shield:${leftPadText(shield, 17)} |o|
        \\__/   \\__/     |o|                          |o|
        (==)   (==)     |o| ${rightPadText(teamRole, 24)} |o|
       (____) (____)    |o|__________________________|o|
        """"   """"`);
};

displayPlayerInfo(
  1,
  "Test",
  "A",
  2,
  6,
  3,
  6,
  5,
  6,
  "Set Up (in game)",
  "None",
  "None",
  "Healthy",
  "None",
  "None",
  "None",
  "Fearless Leader"
);

let card = {
  cardType: "Event",
  cardTitle: "Mysterious Signal",
  cardText:
    "Your equipment picks up a strange signal. It could be a distress call or something more sinister...",
  cardOutcomes: [
    "You hear the signal, but it's too faint to locate its origin or understand its meaning.",
    "You try to decipher the strange signal but it remains a mystery.",
    "You trace the strange signal and find a hidden cache of alien technology. +1 MOV"
  ],
  cardRollThresholds: ["0", "2", "5"],
  cardRollType: "Agility",
  cardOutcomeIndex: 0
};

displayCard(card);
