import path from 'path'
import {spawnSync} from 'child_process'

const WEBPACK = path.resolve(__dirname, '../../../node_modules/.bin/webpack'),
      stdio = 'inherit'

export default function() {
  return spawnSync(WEBPACK, [
    '--colors',
    '--progress'
  ], {stdio})
}
