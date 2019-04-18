const fs = require('fs');
const appRoot = require('app-root-path');
const chalk = require('chalk');
const { format } = require('date-fns');

// Formating and math based Utils
const randomOneZero = () => Math.round(Math.random());

const createTimeStamp = () => format(new Date(), 'MM/DD/YY hh:mm a');

const createDatedLogName = (path) => {
  const timeStamp = format(new Date(), 'MM-DD-YY');
  return `${path}/${timeStamp}.log.json`;
};

// FS Based Utils
const basePath = `${appRoot}/logs`;

const readFile = (path, opts = 'utf8') => {
  return new Promise((res, rej) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) rej(err);
      else res(data);
    });
  });
};

const writeFile = (path, data, opts = 'utf8') => {
  return new Promise((res, rej) => {
    fs.writeFile(path, data, opts, err => {
      if (err) rej(err);
      else res();
    });
  });
};

const findOrCreateDir = path => {
  return new Promise((res, rej) => {
    const exists = fs.existsSync(path);
    if (exists) res();
    else {
      fs.mkdir(path, (err) => {
        if (err) rej();
        else res();
      });
    }
  });
};

const findOrCreateCurrentLog = path => {
  // Returns a promise
  const exists = fs.existsSync(path);
  if (exists) return readFile(path);
  const blankData = JSON.stringify({});
  return writeFile(path, blankData).then(() => readFile(path));
};

const writeToLogFile = (dataToWrite) => {
  // Make sure we have the logs directory
  findOrCreateDir(basePath)
    .then(() => {
      // Generate log name per date
      const datedLogName = createDatedLogName(basePath);

      // If todays file exists, write on that file or create new
      findOrCreateCurrentLog(datedLogName)
        .then((data) => {
          let currentTime = format(new Date(), 'hh:mm:ssa');
          let updatedData = data ? JSON.parse(data) : {};

          // New object key for currentTime with current data
          updatedData[currentTime] = dataToWrite;
          updatedData = JSON.stringify(updatedData, null, 2);

          // Write it all to file
          return writeFile(datedLogName, updatedData, 'utf8', err => {
            if (err) throw new Error(err.message);
          });
        });
    })
    .catch(console.log);
};

const removeLog = (options) => {
  /*
    Fnc to remove specific log(s)
    Options:
    - By day
    - By name
  */
  const files = fs.readdirSync(basePath).map(file => file);
  files.forEach(filename => {
    // Clean way to make sure we're completely deleting file in same process
    let path = `${basePath}/${filename}`;
    let tempFile = fs.openSync(path, 'r');
    fs.closeSync(tempFile);
    fs.unlinkSync(path);
  });
  console.log(chalk.red('All logs deleted'));
};

const formatedLog = ({headsCount, tailsCount, ties, flipCount}) => {
  const title = chalk.yellow('Your flip stats:');
  const headsDisplay = chalk.magenta(`# of Yeses (Heads): ${chalk.cyan(formatNumber(headsCount))}`);
  const tailsDisplay = chalk.magenta(`# of Noes (Tails): ${chalk.cyan(formatNumber(tailsCount))}`);
  const tieDisplay = chalk.magenta(`# of Ties: ${chalk.cyan(formatNumber(ties))}`);
  const totalDisplay = chalk.magenta(`Grand total of flips: ${chalk.green(formatNumber(flipCount))}`);
  const line = chalk.yellow('-'.repeat(totalDisplay.length - 20)); // Grow based on how large total is

  const output = [title, headsDisplay, tailsDisplay, tieDisplay, line, totalDisplay].join('\n');
  console.log(output);
};

const printLog = options => {
  /*
    TODO
    specific logs/stats by opts. probably need cache
    Options:
    - By day
    - By name
    - Sort by 'heads'/'tails'
  */

  const stats = {
    headsCount: '0',
    tailsCount: '0',
    flipCount: '0',
    ties: '0'
  };

  const exists = fs.existsSync(basePath);
  if (!exists) {
    formatedLog(stats);
    return;
  }

  const files = fs.readdirSync(basePath).map(file => file);
  files.forEach(file => {
    // Parsed Data from each day
    const data = JSON.parse(fs.readFileSync(`${basePath}/${file}`, 'utf8'));
    // Array of the objects
    const dataArray = Object.keys(data).map(key => data[key]);
    // Iterate through the array and update stats
    dataArray.forEach(({flipCount, headsCount, tailsCount, tie}) => {
      if (tie) {
        stats.ties = largeAddition(stats.ties, 1);
      }
      stats.flipCount = largeAddition(stats.flipCount, flipCount);
      stats.tailsCount = largeAddition(stats.tailsCount, tailsCount);
      stats.headsCount = largeAddition(stats.headsCount, headsCount);
    });
  });

  // Final print
  formatedLog(stats);
};

// An algo that's as old as JS to manage nums larger than 53 bits
// Reference https://medium.com/@nitinpatel_20236/javascript-adding-extremely-large-numbers-and-extra-long-factorials-229b6055cb1a
const largeAddition = (n1, n2) => {
  let numOne = typeof n1 === 'string' ? n1 : n1.toString();
  let numTwo = typeof n2 === 'string' ? n2 : n2.toString();
  // Need to start with larger num on top
  if (numTwo.length > numOne.length) {
    let temp = numTwo;
    numOne = numTwo;
    numTwo = temp;
  }
  
  let result = '';
  let carry = 0;
  let a;
  let b;
  let temp;
  let digitSum;
  for (let i = 0; i < numOne.length; i++) {
    // Iterate and grab the ith digit from the right
    a = parseInt(numOne.charAt(numOne.length - 1 - i));
    b = parseInt(numTwo.charAt(numTwo.length - 1 - i));
    b = (b) ? b : 0; // In the case numTwo is shorter than numOne
    temp = (carry + a + b).toString();
    digitSum = temp.charAt(temp.length - 1);
    carry = parseInt(temp.substr(0, temp.length - 1));
    carry = (carry) ? carry : 0;
    // Add the digit sum to final result until left most is reached then append carry as well
    result = (i === numOne.length - 1) ? temp + result : digitSum + result;
  }
  return result;
};

// Fantastic reference for managing commas in large number strings
// http://www.mredkj.com/javascript/numberFormat.html#addcommas
const formatNumber = n => {
  if (typeof n !== 'string') {
    n = n.toString();
  }
  let split = n.split('.');
  let x1 = split[0];
  let x2 = split.length > 1 ? '.' + split[1] : '';
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};

module.exports = {
  writeToLogFile,
  randomOneZero,
  createTimeStamp,
  printLog,
  removeLog,
  formatNumber
};
