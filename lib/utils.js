const fs = require('fs');
const { promisify } = require('util');
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
    Fnc to output specific logs/stats
    Options:
    - All
    - By day
    - By name
    - Sort by 'heads'/'tails'
  */
}

module.exports = {
  writeToLogFile,
  randomOneZero,
  createTimeStamp
};