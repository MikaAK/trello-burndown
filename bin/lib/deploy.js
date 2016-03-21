import path from 'path'
import chalk from 'chalk'
import {spawnPromise} from './spawn_promise.js'

const CONTEXT = path.resolve(__dirname, '../../..'),
      MIGRATION_PATH = 'server/priv/repo/migrations'

const trelloCommand = (command) => `rel/bin/trello-burndown ${command}`

export default function({input}) {
  let [, serverName] = input

  if (!serverName)
    return Promise.reject('no input')

  return spawnPromise('rsync', ['-zLr', path.resolve(CONTEXT, 'server/rel'), `${serverName}:~/`], CONTEXT)
    .then(() => console.log(`${chalk.green('OK')}: Synced rel directory`))
    .then(() => spawnPromise('rsync', [
      '-zLr',
       path.resolve(CONTEXT, MIGRATION_PATH),
       `${serverName}:~/trello-burndown/${MIGRATION_PATH}`
    ], CONTEXT))
    .then(() => console.log(`${chalk.green('OK')}: Synced migrations directory`))
    .then(() => console.log(`${chalk.green('OK')}: Completed migrations`))
    .then(() => spawnPromise('ssh', [serverName, `${trelloCommand('stop')} && ${trelloCommand('start')}`]))
    .then(() => console.log(`${chalk.green('OK')}: Restarted Server`))
    .catch((e) => console.log(`${chalk.red('ERROR')}: An Error occured while deploying`, e))
}
