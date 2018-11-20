const fs = require('fs');
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
const basePath = 'logs';

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
  const exists = fs.existsSync(path);
  if (exists) return true;
  return fs.mkdirSync(path);
};

const findOrCreateCurrentLog = path => {
  // Returns a promise
  const exists = fs.existsSync(path);
  if (exists) return readFile(path);
  return writeFile(path, JSON.stringify({})).then(() => {
    return readFile(path);
  });
};

const writeToLogFile = (dataToWrite) => {
  // Make sure we have the logs directory
  findOrCreateDir(basePath);
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
    })
    .catch(console.log);
};

const removeLog = (options) => {
  /* 
    Fnc to remove specific log(s)
    Options:
    - All
    - By day
    - By name
  */
};

const printLog = (options) => {
  /* 
    TODO
    specific logs/stats Options:
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
  console.log(chalk.yellow('Your flip stats:'));
  console.log(chalk.magenta(`# of Yeses (Heads): ${chalk.cyan(stats.headsCount)}`));
  console.log(chalk.magenta(`# of Noes (Tails): ${chalk.cyan(stats.tailsCount)}`));
  console.log(chalk.magenta(`# of Ties: ${chalk.cyan(stats.ties)}\n${chalk.yellow('-------------------------')}`));
  console.log(chalk.magenta(`Grand total of flips: ${chalk.green(stats.flipCount)}`));
};

module.exports = {
  writeToLogFile,
  randomOneZero,
  createTimeStamp,
  printLog
};