const fs = require('fs');
const chalk = require('chalk');
const { format } = require('date-fns');

const createDatedLogName = () => {
  const timeStamp = format(new Date(), 'MM-DD-YY');
  return `logs/${timeStamp}.log.json`;
};

const findOrCreateDir = () => {
  fs.exists('logs', exists => {
    if (exists) return true;
    return fs.mkdir('logs', err => {
      if (err) throw new Error(err.message);
      console.log(chalk.green('created logs!'));
    });
  });
};

const findOrCreateCurrentLog = (name) => {
  fs.exists(name, exists => {
    if (!exists){
      fs.writeFile(name, JSON.stringify({}), 'utf8', err => {
        if (err) throw new Error(err.message);
      });
    }
  });
};

const writeToLogFile = (dataToWrite) => {
  // Make sure we have the logs directory
  findOrCreateDir();
  const datedLogName = createDatedLogName();
  // Make sure we have a log file for current day
  findOrCreateCurrentLog(datedLogName);

  fs.readFile(datedLogName,'utf8', (err, currentData) => {
    let currentTime = format(new Date(), 'hh:mm:ssa');
    let updatedData = JSON.parse(currentData);

    // New object key for currentTime with current data
    updatedData[currentTime] = dataToWrite;
    updatedData = JSON.stringify(updatedData, null, 2);

    // Write it all to file
    fs.writeFile(datedLogName, updatedData, 'utf8', err => {
      if (err) throw new Error(err.message);
    });
  });
};

module.exports = {
  writeToLogFile
};