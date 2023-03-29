import chalk from "chalk";

function playerCount(zoneToCheck, allPlayerZones) {
  const playerIDs = allPlayerZones[0];
  const playerZones = allPlayerZones[1];
  let count = 0;
  for (let i = 0; i < playerIDs.length; i++) {
    if (playerZones[i] == zoneToCheck) {
      count++;
    }
  }
  return count;
}

function playerString(zone, allPlayerZones) {
  const pc = playerCount(zone, allPlayerZones);
  let playerIcons = "";
  for (let i = 0; i < allPlayerZones.playerIDs.length; i++) {
    // if p1 is on the space
    let playerID;
    if (allPlayerZones.playerZones[i] == zone) {
      playerID = allPlayerZones.playerIDs[i];
    }
    switch (playerID) {
      case "1":
        playerIcons += chalk.red.bold("X");
        break;
      case "2":
        playerIcons += chalk.magenta.bold("X");
        break;
      case "3":
        playerIcons += chalk.blue.bold("X");
        break;
      case "4":
        playerIcons += chalk.yellow.bold("X");
        break;
      default:
        break;
    }
  }
  let line = "";
  for (let i = 0; i < 4 - pc; i++) {
    line += "_";
  }
  return playerIcons + line;
}

function tileType(zoneToCheck, activeZones) {
  let tileIndex = activeZones.zones.indexOf(zoneToCheck);
  let type;
  if (tileIndex > -1) {
    const tileEnum = activeZones.tiles[tileIndex];
    /*
    Default,
        Jungle,
        Plains,
        Desert,
        Mountain,
        LandingSite,
        RelicMystery
        Relic1,
        Relic2,
        Relic3,
        Relic4,
        Relic5
    */
    switch (tileEnum) {
      case "0":
        type = " ";
        break;
      case "1":
        type = "J";
        break;
      case "2":
        type = "P";
        break;
      case "3":
        type = "D";
        break;
      case "4":
        type = "M";
        break;
      case "5":
        type = "L";
        break;
      case "6":
        type = "?";
        break;
      case "7":
        type = "1";
        break;
      case "8":
        type = "2";
        break;
      case "9":
        type = "3";
        break;
      case "10":
        type = "4";
        break;
      case "11":
        type = "5";
        break;
      case "12":
        type = "!";
        break;
      default:
        type = "*";
        break;
    }
  } else {
    type = " ";
  }
  return type;
}

export async function drawMap(
  rows,
  columns,
  activeZones,
  startingZone,
  currentPlayerZone,
  allPlayerZones,
  gamePhase,
  dayNumber,
  artifacts,
  totalPlayers
) {
  // rows = 4, columns = 5, showList = ["1,0","2,2","3,0"];
  // activeZones.tiles has types of tiles
  let showList = activeZones.zones;
  let campsiteZones = [];
  for (let i = 0; i < showList.length; i++) {
    if (activeZones.campsites[i]) {
      campsiteZones.push(showList[i]);
    }
  }
  let highlights = showList ? showList : [];
  //console.log("Hightlights:", highlights);
  //console.log("start zone:", startingZone);
  console.log("Current Zone:", currentPlayerZone);
  console.log("Game Phase:", gamePhase);
  console.log(`Day #${dayNumber}`);
  console.log(`Artifacts Recovered: (${artifacts.length}/${totalPlayers})`);
  let artifactsString = "";
  for (let i = 0; i < artifacts.length; i++) {
    artifactsString += `- ${artifacts[i]}`;
    if (i != artifacts.length - 1) {
      artifactsString += ",\n";
    }
  }
  console.log(artifactsString);
  //console.log("all player zones:", allPlayerZones);
  //console.log("active zones:", showList);
  //console.log("active zone tiles:", activeZones.tiles);
  // let totalPlayers = allPlayerZones.playerIDs.length;

  // Key:
  console.log(
    `P1:${chalk.red.bold("X")}${
      totalPlayers > 1 ? `, P2:${chalk.magenta.bold("X")}` : ""
    }${totalPlayers > 2 ? `, P3:${chalk.blue.bold("X")}` : ""}${
      totalPlayers > 3 ? `, P4:${chalk.yellow.bold("X")}` : ""
    }`
  );

  let grid = "";
  let x;
  let y;
  let xy;
  let xy2;
  for (let i = 0; i < rows + 1; i++) {
    // first hex is 5 rows, rest are 4
    const evenNumberOfColumns = columns % 2 == 0;
    const totalTextRows = i == 0 ? 5 : 4;
    const needsTopRow = totalTextRows == 5;
    const isBottomRow = i == rows;
    let tType = "";
    for (let textRow = 0; textRow < totalTextRows; textRow++) {
      const currentRow = needsTopRow ? textRow : textRow + 1;
      switch (currentRow) {
        case 0:
          if (evenNumberOfColumns) {
            for (let hexColumn = 0; hexColumn < columns / 2; hexColumn++) {
              grid += `  ____      `;
            }
          } else {
            for (
              let hexColumn = 0;
              hexColumn < (columns + 1) / 2;
              hexColumn++
            ) {
              grid += `  ____      `;
            }
          }
          break;
        case 1:
          grid += `\n`;
          if (evenNumberOfColumns) {
            grid += isBottomRow ? `  ` : ` /`;
            for (let hexColumn = 0; hexColumn < columns / 2; hexColumn++) {
              x = hexColumn * 2 + 1;
              y = rows - i;
              xy = `${x},${y}`;
              xy2 = `${x - 1},${y - 1}`;
              if (needsTopRow || hexColumn == (columns + 1) / 2 - 1) {
                if (needsTopRow && hexColumn == columns / 2 - 1) {
                  // TOP RIGHT CORNER
                  grid += ` ${
                    campsiteZones.indexOf(xy2) > -1
                      ? chalk.red.bold("/\\")
                      : "  "
                  } \\       `;
                } else {
                  // TOP ROW
                  grid += ` ${
                    campsiteZones.indexOf(xy2) > -1
                      ? chalk.red.bold("/\\")
                      : "  "
                  } \\      /`;
                }
              } else {
                // EVEN COLUMNS
                grid += ` ${
                  campsiteZones.indexOf(xy2) > -1 ? chalk.red.bold("/\\") : "  "
                } \\ ${
                  highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                }  /`;
              }
            }
          } else {
            for (
              let hexColumn = 0;
              hexColumn < (columns + 1) / 2;
              hexColumn++
            ) {
              x = hexColumn * 2 + 1;
              y = rows - i;
              xy = `${x},${y}`;
              if (!isBottomRow) {
                grid += ` /`;
              } else {
                grid += x == 1 ? `  ` : ` /`;
              }
              if (isBottomRow && hexColumn == (columns + 1) / 2 - 1) {
                `          `;
              } else {
                xy2 = `${x - 1},${y - 1}`;
                grid +=
                  needsTopRow || hexColumn == (columns + 1) / 2 - 1
                    ? ` ${
                        campsiteZones.indexOf(xy2) > -1
                          ? chalk.red.bold("/\\")
                          : "  "
                      } \\     `
                    : ` ${
                        campsiteZones.indexOf(xy2) > -1
                          ? chalk.red.bold("/\\")
                          : "  "
                      } \\ ${
                        highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                      } `;
              }
            }
          }
          break;
        case 2:
          grid += `\n`;
          if (evenNumberOfColumns) {
            grid += isBottomRow ? ` ` : `/`;
            for (
              let hexColumn = 0;
              hexColumn < (columns - 1) / 2;
              hexColumn++
            ) {
              x = hexColumn * 2;
              y = rows - i - 1;
              xy = `${x},${y}`;
              tType = tileType(xy, activeZones);
              let zoneCoords = `${x + 1},${y + 1}`;
              let players = playerString(zoneCoords, allPlayerZones);
              if (needsTopRow && hexColumn == columns / 2 - 1) {
                grid += !isBottomRow
                  ? `  ${tType}   \\${players} `
                  : `      \\${players} `;
              } else {
                grid += !isBottomRow
                  ? `  ${tType}   \\${players}/`
                  : `      \\${players}/`;
              }
            }
          } else {
            y = rows - i - 1;
            xy = `${0},${y}`;
            tType = tileType(xy, activeZones);
            grid += !isBottomRow ? `/  ${tType}   \\` : `       \\`;
            for (
              let hexColumn = 0;
              hexColumn < (columns - 1) / 2;
              hexColumn++
            ) {
              x = hexColumn * 2 + 2;
              xy = `${x},${y}`;
              tType = tileType(xy, activeZones);
              let zoneCoords = `${x - 1},${y + 1}`;
              let players = playerString(zoneCoords, allPlayerZones);

              if (isBottomRow && hexColumn == (columns - 1) / 2 - 1) {
                grid += `${players}/       `;
              } else {
                grid += !isBottomRow
                  ? `${players}/  ${tType}   \\`
                  : `${players}/      \\`;
              }
            }
          }
          break;
        case 3:
          grid += `\n`;
          if (evenNumberOfColumns) {
            if (!isBottomRow) {
              grid += `\\ `;
              for (let hexColumn = 0; hexColumn < columns / 2; hexColumn++) {
                x = hexColumn * 2;
                y = rows - i - 1;
                xy = `${x},${y}`;
                xy2 = `${x + 1},${y}`;
                if (hexColumn == columns / 2 - 1) {
                  //RIGHT COLUMN
                  grid += `${
                    highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                  }  / ${
                    campsiteZones.indexOf(xy2) > -1
                      ? chalk.red.bold("/\\")
                      : "  "
                  } \\ `;
                } else {
                  // ODD COLUMNS (MINUS RIGHT)
                  grid += `${
                    highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                  }  / ${
                    campsiteZones.indexOf(xy2) > -1
                      ? chalk.red.bold("/\\")
                      : "  "
                  } \\ `;
                }
              }
            }
          } else {
            if (!isBottomRow) {
              for (
                let hexColumn = 0;
                hexColumn < (columns + 1) / 2;
                hexColumn++
              ) {
                x = hexColumn * 2;
                y = rows - i - 1;
                xy = `${x},${y}`;
                xy2 = `${x + 1},${y}`;
                grid += `\\ ${
                  highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                }  / ${
                  campsiteZones.indexOf(xy2) > -1 ? chalk.red.bold("/\\") : "  "
                } `;
              }
            }
          }
          break;
        case 4:
          grid += `\n`;
          if (evenNumberOfColumns) {
            if (!isBottomRow) {
              grid += ` \\`;
              for (let hexColumn = 0; hexColumn < columns / 2; hexColumn++) {
                x = hexColumn * 2 + 1;
                y = rows - i - 1;
                xy = `${x},${y}`;
                tType = tileType(xy, activeZones);
                let zoneCoords = `${x - 1},${y}`;
                let players = playerString(zoneCoords, allPlayerZones);
                grid += `${players}/  ${tType}   \\`;
              }
            }
          } else {
            if (!isBottomRow) {
              for (
                let hexColumn = 0;
                hexColumn < (columns + 1) / 2;
                hexColumn++
              ) {
                x = hexColumn * 2 + 1;
                y = rows - i - 1;
                xy = `${x},${y}`;
                let zoneCoords = `${x - 1},${y}`;
                let players = playerString(zoneCoords, allPlayerZones);
                tType = tileType(xy, activeZones);
                grid +=
                  x != columns
                    ? ` \\${players}/  ${tType}  `
                    : ` \\${players}/     `;
              }
            }
          }
          break;

        default:
          break;
      }
    }
  }
  console.log(grid);

  let hexGrid = `
  ____        ____        ____        ____        ____  
 /    \\      /    \\      /    \\      /    \\      /    \\ 
/      \\____/      \\____/      \\____/      \\____/      \\
\\      /    \\      /    \\      /    \\      /    \\      /
 \\____/      \\____/      \\____/      \\____/      \\____/ 
 /    \\      /    \\      /    \\      /    \\      /    \\ 
/      \\____/      \\____/      \\____/      \\____/      \\
\\      /    \\      /    \\      /    \\      /    \\      /
 \\____/      \\____/      \\____/      \\____/      \\____/ 
 /    \\      /    \\      /    \\      /    \\      /    \\ 
/      \\____/      \\____/      \\____/      \\____/      \\
\\      /    \\      /    \\      /    \\      /    \\      /
 \\____/      \\____/      \\____/      \\____/      \\____/ `;

  //console.log(hexGrid);
}
