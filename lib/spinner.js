const cliSpinners = require('cli-spinners');
const Ora = require('ora');

const createSpinner = (flipCount) => {
  const options = {
    spinner: cliSpinners.circle,
    text: `Flipping ${flipCount} time${flipCount > 1 ? 's' : ''}...`
  
  };
  
  const spinner = new Ora(options);
  return spinner;
};

module.exports = {
  createSpinner
};
