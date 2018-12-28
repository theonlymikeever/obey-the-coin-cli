const fs = require('fs');
const { basePath, createTimeStamp, createDatedLogName, writeToLogFile, findOrCreateDir, findOrCreateCurrentLog } = require('../lib/utils');
const { calculateFlips } = require('../lib/flip');

describe('Date Util functions', () => {
  let dateObj, month, day, year, shortYear;
  beforeEach(() => {
    dateObj = new Date();
    month = dateObj.getUTCMonth() + 1;
    day = dateObj.getUTCDate();
    year = dateObj.getUTCFullYear();
    shortYear = parseFloat(year.toString().slice(2)); // woof
  })
  it('createTimeStamp generates proper timestamp', () => {
    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const amPm = hour >= 12 ? 'pm' : 'am';
    hour = hour >= 12 ? `0${hour-12}` : hour;

    const currentTime = `${month}/${day}/${shortYear} ${hour}:${minutes} ${amPm}`

    expect(createTimeStamp()).toEqual(currentTime);
  })

  it('createDatedLogName returns proper log name for day', () => {
    const newDate = `${month}-${day}-${shortYear}`;
    const logName = `${basePath}/${newDate}.log.json`

    expect(createDatedLogName(basePath)).toEqual(logName);
  })
});

describe('Logging Util Functions', () => {
  xit('writeToLogFile creates a new log file', () => {

    // findOrCreateDir(basePath)
    //   .then(() => {
    //     const datedLogName = createDatedLogName(basePath);
    //     findOrCreateCurrentLog(datedLogName)
    //       .then(data => {
    //         console.log(data)
    //       })
    //   })
    //   .catch(console.log)

      // const tempData = calculateFlips();

      // writeToLogFile(tempData);
      // const newFiles = fs.readdirSync(basePath).map(file => file);

      // expect(startingLength).toBeLessThan(newFiles.length);
  });
});
