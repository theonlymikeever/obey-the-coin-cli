const chalk = require('chalk');
const { createSpinner } = require('./spinner');
const { createTimeStamp, randomOneZero, writeToLogFile } = require('./utils');


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
      text: `${flipRes.headsCount} Heads`,
      symbol: '🧠 '
    });
  }, spinTime);
  
  spinTime += 1000;

  setTimeout(() => {
    spinner.stopAndPersist({
      text: `${flipRes.tailsCount} Tails`,
      symbol: '🍑'
    });
  }, spinTime);

  spinTime += 1000;
  
  setTimeout(() => {
    spinner.stop();
    console.log(chalk.grey('\nYour final result:'));
    console.log(chalk.magenta(`
      ********************
      * *    ${chalk.blue(flipRes.finalResult)}     * *
      ********************
    `));
  }, spinTime);
}

module.exports = {
  builder: {
    num: {
      alias: 't',
      default: 1
    }
  },
  handler: flip
};