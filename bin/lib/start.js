import path from 'path'
import {spawnSync} from 'child_process'

var context = path.resolve(__dirname, '../../..')

const WEBPACK_DEV_SERVER = path.resolve(context, 'node_modules/.bin/webpack-dev-server'),
      SERVER_PATH = path.resolve(context, 'server'),
      CONFIG_PATH = path.resolve(context, 'webpack.config.babel.js'),
      stdio = 'inherit'

export default function({input}) {
  var [, type] = input

  if (type === 'client')
    return spawnSync(WEBPACK_DEV_SERVER, [
      '--config', CONFIG_PATH,
      '--colors', '--inline',
      '--hot', '--progress',
      '--history-api-fallback'
    ], {stdio, cwd: context, env: process.env})
  else if (type === 'server')
    return spawnSync('mix', ['phoenix.server'], {stdio, cwd: SERVER_PATH, env: process.env})
  else
    throw new Error('Must provide valid type [server/client]')
}
