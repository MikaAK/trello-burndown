#!/usr/bin/env node

import meow from 'meow'
import chalk from 'chalk'
import loadDotenv from './lib/loadDotenv'
import HELP_TEXT from './lib/helpText'
import FLAG_COMMANDS from './lib/flagCommands'
import build from './lib/build'
import start from './lib/start'
import test from './lib/test'

var CLI = {
  COMMAND_TABLE: {build, start, test},
  program: meow(HELP_TEXT, {
    alias: {
      p: 'production',
      d: 'development',
      s: 'staging'
    }
  }),

  main() {
    var {program} = CLI,
        command = CLI.COMMAND_TABLE[program.input[0]]

    for (let opt of Object.keys(program.flags))
      if (FLAG_COMMANDS[opt])
        FLAG_COMMANDS[opt]()

    if (!process.env.NODE_ENV)
      FLAG_COMMANDS.development()

    /* eslint-disable */
    console.log(`${chalk.green('ENV')}: ${chalk.magenta(process.env.NODE_ENV)}`)
    /* eslint-enable */


    if (!command)
      program.showHelp()
    else
      command()
  }
}

loadDotenv()
  .then(CLI.main)
