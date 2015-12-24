import path from 'path'
import {spawnSync} from 'child_process'

const WEBPACK_DEV_SERVER = path.resolve(__dirname, '../../../node_modules/.bin/webpack-dev-server'),
      CONTENT_BASE = 'app',
      PORT = 4000,
      stdio = 'inherit'

export default function() {
  console.log(WEBPACK_DEV_SERVER)
  return spawnSync(WEBPACK_DEV_SERVER, [
    '--content-base', CONTENT_BASE,
    '--port', PORT,
    '--colors', '--inline',
    '--hot', '--progress',
    '--history-api-fallback'
  ], {stdio})
}
