/*  
  TO DO

  - Save results to file
  - Break out printing functions
  - Tests? (why not)
  - Themes! (for result colors)
  - Better Animation!

  */

const chalk = require('chalk');
const { createSpinner } = require('./spinner');
 
const randomOneZero = () => Math.round(Math.random());

function flip(argv) {
  const flipCount = argv.num;

  // Start initial animation
  let spinner = createSpinner(flipCount);
  let spinTime = 1000; // ms
  spinner = spinner.start();

  // Calculate results
  const flips = Array.from({length: flipCount}, randomOneZero);
  let headsCount = flips.filter(i => i).length;
  let tailsCount = flipCount - headsCount;

  // Manage a tie
  if (flipCount % 2 === 0 && headsCount === flipCount/2) {
    const extraFlipIsHeads = randomOneZero();
    if (extraFlipIsHeads) headsCount++;
    else tailsCount++;

    setTimeout(() => {
      spinner.color = 'yellow';
      spinner.text = 'Tie! Flipping one more time for good luck...';
    }, spinTime);
  
    spinTime += 1000;
  
    setTimeout(() => {
      console.log(chalk.yellow(` ${extraFlipIsHeads ? 'Heads' : 'Tails'}`));
    }, spinTime);
  }

  const finalResult = headsCount > tailsCount ? 'Heads' : 'Tails';

  // Animation and result output!
  setTimeout(() => {
    spinner.stopAndPersist({
      text: `${headsCount} Heads`,
      symbol: '🧠 '
    });
  }, spinTime);
  
  spinTime += 1000;

  setTimeout(() => {
    spinner.stopAndPersist({
      text: `${tailsCount} Tails`,
      symbol: '🍑'
    });
  }, spinTime);

  spinTime += 1000;
  
  setTimeout(() => {
    spinner.stop();
    console.log(chalk.grey('\nYour final result:'));
    console.log(chalk.magenta(`
      ********************
      * *    ${chalk.blue(finalResult)}     * *
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