const { printLog, removeLog } = require('./utils');

const logger = argv => {
  const deleteLog = argv.delete;
  if (deleteLog) {
    // Wipe all logs
    removeLog();
    // TODO: Wipe partial logs with options
  } else {
    printLog();
  }
};

module.exports = {
  builder: {
    delete: {
      alias: 'D',
      default: false
    }
  },
  handler: logger
};