#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const initCmd = require('../commands/init');
const cleanCmd = require('../commands/clean');

/**
 * Parse command line arguments using Yargs.
 */
const argv = yargs(hideBin(process.argv))
  .command(initCmd.command, initCmd.desc, initCmd.builder || (() => {}), initCmd.handler)
  .command(cleanCmd.command, cleanCmd.desc, cleanCmd.builder, cleanCmd.handler)
  .help()
  .alias('h', 'help')
  .strictCommands(true)
  .demandCommand(
    1,
    'You need to specify a command like "init" or "clean" with appropriate options.'
  )
  .wrap(null)
  .fail(function (msg, err, yargs) {
    if (err) throw err; // preserve stack trace
    console.error(msg); // print errors to stderr
    console.info(yargs.help());
    process.exit(1);
  }).argv;
