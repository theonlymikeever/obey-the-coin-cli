const chalk = require('chalk');
const { createSpinner } = require('./spinner');
const { format } = require('date-fns'); 

const randomOneZero = () => Math.round(Math.random());

const createTimeStamp = () => format(new Date(), 'MM/DD/YY hh:mm a');

const calculateFlips = (flipCount) => {
  const flips = Array.from({length: flipCount}, randomOneZero);
  let headsCount = flips.filter(i => i).length;
  let tailsCount = flipCount - headsCount;
  return {
    flipCount,
    timeStamp: createTimeStamp(),
    headsCount,
    tailsCount,
    tie: false
  };
};

function flip(argv) {
  const flipCount = argv.num;

  // Start initial animation
  let spinner = createSpinner(flipCount);
  let spinTime = 1000; // ms
  spinner = spinner.start();

  // Calculate results
  const flipRes = calculateFlips(flipCount);

  // Manage a tie
  if (flipCount % 2 === 0 && flipRes.headsCount === flipCount/2) {
    flipRes.tie = true;
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
    console.log(flipRes)
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