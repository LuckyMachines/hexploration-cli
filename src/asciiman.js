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
// Constants
const name = "Rick Sanchez";
const badge = "RICK!";
const movement = 6;
const totalMovement = 9;
const agility = 6;
const totalAgility = 9;
const dexterity = 6;
const totalDexterity = 9;
const campsite = "Setup";
const leftHand = "Laser Sword";
const rightHand = "None";
const status = "Healthy";
const artifact = "Portal Gun";
const relic = "Relic 4";
const shield = "None";
const teamRole = "The Rickest Rick";

// Generate ASCII art
console.log(`
        _-----_        ______________________________
       /  MMM  \\      |o| ${rightPadText(`Player 4 - ${name}`, 24)} |o|
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
