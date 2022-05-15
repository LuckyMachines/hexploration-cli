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
        type = "?";
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
        type = "!";
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
      default:
        type = "*";
        break;
    }
  } else {
    type = "-";
  }
  return type;
}

export async function drawMap(
  rows,
  columns,
  activeZones,
  startingZone,
  currentPlayerZone,
  allPlayerZones
) {
  // rows = 4, columns = 5, showList = ["1,0","2,2","3,0"];
  // activeZones.tiles has types of tiles
  let showList = activeZones.zones;
  let highlights = showList ? showList : [];
  //console.log("Hightlights:", highlights);
  console.log("start zone:", startingZone);
  console.log("current player zone:", currentPlayerZone);
  console.log("all player zones:", allPlayerZones);
  console.log("active zones:", showList);
  console.log("active zone tiles:", activeZones.tiles);
  let grid = "";
  let x;
  let y;
  let xy;
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
              if (needsTopRow || hexColumn == (columns + 1) / 2 - 1) {
                if (needsTopRow && hexColumn == columns / 2 - 1) {
                  grid += `    \\       `;
                } else {
                  grid += `    \\      /`;
                }
              } else {
                grid += `    \\ ${
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
                grid +=
                  needsTopRow || hexColumn == (columns + 1) / 2 - 1
                    ? `    \\     `
                    : `    \\ ${
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

              if (needsTopRow && hexColumn == columns / 2 - 1) {
                grid += !isBottomRow ? `  ${tType}   \\____ ` : `      \\____ `;
              } else {
                grid += !isBottomRow ? `  ${tType}   \\____/` : `      \\____/`;
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
              if (isBottomRow && hexColumn == (columns - 1) / 2 - 1) {
                grid += `____/       `;
              } else {
                grid += !isBottomRow ? `____/  ${tType}   \\` : `____/      \\`;
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
                if (hexColumn == columns / 2 - 1) {
                  //is last column
                  grid += `${
                    highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                  }  /    \\ `;
                } else {
                  grid += `${
                    highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                  }  /    \\ `;
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
                grid += `\\ ${
                  highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                }  /    `;
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
                grid += `____/  ${tType}   \\`;
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
                tType = tileType(xy, activeZones);
                grid += x != columns ? ` \\____/  ${tType}  ` : ` \\____/     `;
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
