function pause(time) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, time * 1000)
  );
}

const main = async () => {
  const updateLines = async () => {
    process.stdout.write("Hello, World");
    await pause(2);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("Goodbye, World");
    await pause(2);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("Hello, again");
    await pause(2);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("yO, World .");
    await pause(1);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("yO, World ..");
    await pause(1);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("yO, World ...");
    await pause(1);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("yO, World .");
    await pause(1);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("yO, World ..");
    await pause(1);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("yO, World ...");
  };
  await updateLines();
};

main();
