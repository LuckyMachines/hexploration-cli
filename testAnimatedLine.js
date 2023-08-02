function pause(time) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, time * 1000)
  );
}

class AnimatedLine {
  constructor(line, animation, finalFrame, interval, loop = true) {
    this.line = line ? line : "";
    this.animation = animation ? animation : ["|", "/", "-", "\\"];
    this.animationIndex = 0;
    this.animationInterval = interval ? interval : 100;
    this.finalFrame = finalFrame ? finalFrame : "✔️";
    this.loop = loop;
    this.loopRuns = 0;
  }
  animate() {
    if (this.loop != true && this.animationIndex == 0 && this.loopRuns > 0) {
      // do nothing
    } else {
      this.animationInterval = setInterval(() => {
        this.animationIndex = (this.animationIndex + 1) % this.animation.length;
        this.update();
        this.loopRuns++;
      }, this.animationInterval);
    }
  }

  display() {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(this.line + this.animation[this.animationIndex]);
  }

  progressFrame() {
    if (this.loop != true && this.animationIndex == 0 && this.loopRuns > 0) {
      // do nothing
    } else {
      this.animationIndex = (this.animationIndex + 1) % this.animation.length;
      this.update();
      this.loopRuns++;
    }
  }

  update() {
    if (this.loop != true && this.animationIndex == 0 && this.loopRuns > 0) {
      this.stop();
    } else {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(this.line + this.animation[this.animationIndex]);
    }
  }
  stop() {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(this.line + this.finalFrame);
    clearInterval(this.animationInterval);
    console.log("\n");
  }
}

const main = async () => {
  const line = new AnimatedLine(
    "Loading ",
    ["|=>", "|==>", "|===>", "|====>"],
    "|====> Done!",
    null,
    true
  );
  // line.animate();
  line.display();
  await pause(1);
  line.progressFrame();
  await pause(1);
  line.progressFrame();
  await pause(1);
  line.progressFrame();
  await pause(1);
  line.progressFrame();
  await pause(1);
  line.progressFrame();
  await pause(0.75);
  line.progressFrame();
  await pause(0.75);
  line.progressFrame();
  await pause(0.75);
  line.progressFrame();
  await pause(0.75);
  line.progressFrame();
  await pause(0.5);
  line.progressFrame();
  await pause(0.5);
  line.progressFrame();
  await pause(0.5);
  line.progressFrame();
  await pause(0.5);
  line.progressFrame();
  line.animate();
  await pause(3);
  line.stop();
};

main();
