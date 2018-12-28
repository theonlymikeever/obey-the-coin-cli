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

const formatedLog = stats => {
  // TODO: This is ugly
  console.log(chalk.yellow('Your flip stats:'));
  console.log(chalk.magenta(`# of Yeses (Heads): ${chalk.cyan(stats.headsCount)}`));
  console.log(chalk.magenta(`# of Noes (Tails): ${chalk.cyan(stats.tailsCount)}`));
  console.log(chalk.magenta(`# of Ties: ${chalk.cyan(stats.ties)}\n${chalk.yellow('-------------------------')}`));
  console.log(chalk.magenta(`Grand total of flips: ${chalk.green(stats.flipCount)}`));
}

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
    headsCount: 0,
    tailsCount: 0,
    flipCount: 0,
    ties: 0
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
    dataArray.forEach(data => {
      if (data.tie) ++stats.ties;
      stats.flipCount += data.flipCount;
      stats.tailsCount += data.tailsCount;
      stats.headsCount += data.headsCount;
    });
  });

  // Final print
  formatedLog(stats);
};

module.exports = {
  writeToLogFile,
  randomOneZero,
  createTimeStamp,
  printLog,
  removeLog
};
