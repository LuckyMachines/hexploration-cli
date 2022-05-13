import chalk from "chalk";

export async function drawMap(rows, columns, showList) {
  // rows = 4, columns = 5, showList = ["1,0","2,2","3,0"];
  let highlights = showList ? showList : [];
  //console.log("Hightlights:", highlights);
  let grid = "";
  let x;
  let y;
  let xy;
  for (let i = 0; i < rows; i++) {
    // first hex is 5 rows, rest are 4
    const evenNumberOfColumns = columns % 2 == 0;
    const totalTextRows = i == 0 ? 5 : 4;
    const needsTopRow = totalTextRows == 5;
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
            grid += ` /`;
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
              grid +=
                needsTopRow || hexColumn == (columns + 1) / 2 - 1
                  ? ` /    \\     `
                  : ` /    \\ ${
                      highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                    } `;
            }
          }
          break;
        case 2:
          grid += `\n`;
          if (evenNumberOfColumns) {
            grid += `/`;
            for (
              let hexColumn = 0;
              hexColumn < (columns - 1) / 2;
              hexColumn++
            ) {
              grid +=
                needsTopRow && hexColumn == columns / 2 - 1
                  ? `      \\____ `
                  : `      \\____/`;
            }
          } else {
            grid += `/      \\`;
            for (
              let hexColumn = 0;
              hexColumn < (columns - 1) / 2;
              hexColumn++
            ) {
              grid += `____/      \\`;
            }
          }
          break;
        case 3:
          grid += `\n`;
          if (evenNumberOfColumns) {
            grid += `\\ `;
            for (let hexColumn = 0; hexColumn < columns / 2; hexColumn++) {
              x = hexColumn * 2;
              y = rows - i - 1;
              xy = `${x},${y}`;
              if (hexColumn == columns / 2 - 1) {
                //is last column
                if (i == rows - 1) {
                  //is also last row
                  grid += `${
                    highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                  }  /      `;
                } else {
                  grid += `${
                    highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                  }  /    \\ `;
                }
              } else {
                grid += `${
                  highlights.indexOf(xy) > -1 ? chalk.green.bold(xy) : xy
                }  /    \\ `;
              }
            }
          } else {
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
          break;
        case 4:
          grid += `\n`;
          if (evenNumberOfColumns) {
            grid += ` \\`;
            for (let hexColumn = 0; hexColumn < columns / 2; hexColumn++) {
              if (hexColumn == columns / 2 - 1) {
                //is last column
                if (i == rows - 1) {
                  //is also last row
                  grid += `____/        `;
                } else {
                  grid += `____/      \\`;
                }
              } else {
                grid += `____/      \\`;
              }
            }
          } else {
            for (
              let hexColumn = 0;
              hexColumn < (columns + 1) / 2;
              hexColumn++
            ) {
              grid += ` \\____/     `;
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