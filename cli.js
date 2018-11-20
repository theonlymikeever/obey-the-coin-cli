#!/usr/bin/env node

const chalk = require('chalk');

const argv = require('yargs')
  .version()
  .usage('Usage: flip <command> [options]')
  .command(['times [num]'], 'flip that coin x times. once by default.', require('./lib/flip'))
  .command(['stats [del]'], 'print out your flipping stats', require('./lib/logging'))
  .check(function(argv) {
    if (argv._[0] === 'times' && argv.num > 1000000) {
      return false;
    } 
    return true;
  })
  .fail(function(msg, err, yargs) {
    if (err) throw err; // preserve stack
    console.error(chalk.red('Are you trying to crash node? (hint: the limit is one milli times!)'));
    console.error('You should be doing', yargs.help());
    process.exit(1);
  })
  .command('*', 'flip that coin once.', require('./lib/flip'))
  .example('otc flip 100', 'flip a coin 100 times. if there\'s a tie, another flip will be made.')
  .help('h')
  .alias('h', 'help')
  .argv;