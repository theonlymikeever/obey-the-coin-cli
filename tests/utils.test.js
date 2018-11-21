const { basePath, createTimeStamp, createDatedLogName } = require('../lib/utils');

describe('Util functions', () => {
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
    const minutes = dateObj.getMinutes();
    const amPm = hour > 12 ? 'pm' : 'am';
    hour = hour > 12 ? `0${hour-12}` : hour;

    const currentTime = `${month}/${day}/${shortYear} ${hour}:${minutes} ${amPm}`

    expect(createTimeStamp()).toEqual(currentTime);
  })

  it('createDatedLogName returns proper log name for day', () => {
    const newDate = `${month}-${day}-${shortYear}`;
    const logName = `${basePath}/${newDate}.log.json`

    expect(createDatedLogName(basePath)).toEqual(logName);
  })
});

