import path from 'path'
import {spawnSync} from 'child_process'

var context = path.resolve(__dirname, '../../..')

const WEBPACK_DEV_SERVER = path.resolve(context, 'node_modules/.bin/webpack-dev-server'),
      CONFIG_PATH = path.resolve(context, 'webpack.config.babel.js'),
      stdio = 'inherit'

export default function() {
  return spawnSync(WEBPACK_DEV_SERVER, [
    '--config', CONFIG_PATH,
    '--colors', '--inline',
    '--hot', '--progress',
    '--history-api-fallback'
  ], {stdio, cwd: context, env: process.env})
}
