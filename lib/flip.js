const chalk = require('chalk');
const { createSpinner } = require('./spinner');
const { createTimeStamp, randomOneZero, writeToLogFile, formatNumber } = require('./utils');
const { headsArt, tailsArt } = require('./art');

const calculateFlips = flipCount => {
  let headsCount = 0;
  let tailsCount = 0;

  for (let idx = 0; idx < flipCount; idx++) {
    let flip = randomOneZero();
    if (flip) ++headsCount;
    else ++tailsCount;
  }

  const tie = headsCount === tailsCount ? true : false;
  const timeStamp = createTimeStamp();

  return {
    flipCount,
    timeStamp,
    headsCount,
    tailsCount,
    tie
  };
};

const flip = argv => {
  const flipCount = argv.num;

  // Start initial animation
  let spinner = createSpinner(flipCount);
  let spinTime = 1000; // ms
  spinner = spinner.start();

  // Calculate results
  const flipRes = calculateFlips(flipCount);

  // Manage a tie
  if (flipRes.tie) {
    const extraFlipIsHeads = randomOneZero();
    if (extraFlipIsHeads) flipRes.headsCount++;
    else flipRes.tailsCount++;

    setTimeout(() => {
      spinner.color = 'yellow';
      spinner.text = 'Tie! Flipping one more time for good luck...';
    }, spinTime);
  
    spinTime += 1000;
  
    setTimeout(() => {
      console.log(chalk.yellow(` ${extraFlipIsHeads ? 'Heads' : 'Tails'}`));
    }, spinTime);
  }

  flipRes.finalResult = flipRes.headsCount > flipRes.tailsCount ? 'Heads' : 'Tails';

  // Logging
  writeToLogFile(flipRes);

  // Animation and result output!
  setTimeout(() => {
    spinner.stopAndPersist({
      text: ` ${formatNumber(flipRes.headsCount)} Heads`, // note the left padded space
      symbol: headsArt
    });
  }, spinTime);
  
  spinTime += 1000;

  setTimeout(() => {
    spinner.stopAndPersist({
      text: ` ${formatNumber(flipRes.tailsCount)} Tails`,  // note the left padded space
      symbol: tailsArt
    });
  }, spinTime);

  spinTime += 1000;
  
  setTimeout(() => {
    spinner.stop();
    const isYesNo = s => s === 'Heads' ? chalk.cyan('YES') : chalk.yellow('NO');
    const starCount = flipRes.finalResult === 'Heads'  ? 14 : 13;
  
    const title = chalk.grey('\nFinal result:');
    const starRow = chalk.magenta(`${'*'.repeat(starCount)}`);
    // const resultRow = chalk.magenta(`**  ${chalk.blue(flipRes.finalResult)}   *  ${isYesNo(flipRes.finalResult)}   **`);
    const resultRow = chalk.magenta(` ${chalk.blue(flipRes.finalResult)} => ${isYesNo(flipRes.finalResult)}`);
    const output = [title, starRow, resultRow, starRow].join('\n');
    console.log(output);
  }, spinTime);
};

module.exports = {
  builder: {
    num: {
      alias: 't',
      default: 1
    }
  },
  handler: flip
};