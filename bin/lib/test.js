import path from 'path'
import {spawnSync} from 'child_process'

const CONTEXT = path.resolve(__dirname, '../../../'),
      KARMA = path.resolve(CONTEXT, 'node_modules/.bin/karma')

export default function() {
  process.env.NODE_ENV = 'test'

  spawnSync(KARMA, ['start'], {stdio: 'inherit', cwd: CONTEXT})
}
