const { printLog } = require('./utils');

const logger = argv => {
  const deleteLog = argv.delete;
  if (deleteLog) {
    // Wipe all logs or partial logs
  } else {
    printLog();
  }
};

module.exports = {
  builder: {
    delete: {
      alias: 'd',
      default: false
    }
  },
  handler: logger
};