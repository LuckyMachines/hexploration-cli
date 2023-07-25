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

const displayHorizontalTexts = (texts) => {
  // take two arrays of strings and display them side by side, using \n as delimiter
  const string1 = texts[0];
  const string2 = texts[1];
  const string1Lines = string1.split("\n");
  const string2Lines = string2.split("\n");
  const string1Length = string1Lines.length;
  const string2Length = string2Lines.length;
  const maxLength = Math.max(string1Length, string2Length);
  let output = "";

  //find the longest word in the all the lines
  let longestWord1 = 0;
  for (let i = 0; i < maxLength; i++) {
    if (string1Lines[i].length > longestWord1) {
      longestWord1 = string1Lines[i].length;
    }
  }

  for (let i = 0; i < maxLength; i++) {
    output += `${string1Lines[i]}\t\t${string2Lines[i]}\n`;
  }
  console.log(output);
};

const text1 = `This is 
a test
of the
emergency
broadcast
system.`;

const text2 = `
|-------------|
|             |
|             |
|             |
|-------------|`;

displayHorizontalTexts([text1, text2]);
