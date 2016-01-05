#!/usr/bin/env node

import meow from 'meow'
import chalk from 'chalk'
import loadDotenv from './lib/loadDotenv'
import HELP_TEXT from './lib/helpText'
import FLAG_COMMANDS from './lib/flagCommands'
import build from './lib/build'
import start from './lib/start'
import test from './lib/test'

const COMMAND_TABLE = {build, start, test}

const cli = meow(HELP_TEXT, {
  alias: {
    p: 'production',
    d: 'development',
    s: 'staging'
  }
})

var command = COMMAND_TABLE[cli.input[0]]

loadDotenv()

for (let opt of Object.keys(cli.flags))
  if (FLAG_COMMANDS[opt])
    FLAG_COMMANDS[opt]()

if (!process.env.NODE_ENV)
  FLAG_COMMANDS.development()

/* eslint-disable */
console.log(`${chalk.green('ENV')}: ${chalk.magenta(process.env.NODE_ENV)}`)
/* eslint-enable */


if (!command)
  cli.showHelp()
else
  command()
