import path from 'path'
import {spawnPromise} from './spawn_promise.js'

const context = path.resolve(__dirname, '../../..'),
      WEBPACK = path.resolve(context, 'node_modules/.bin/webpack'),
      stdio = 'inherit'

const buildClient = () => spawnPromise(WEBPACK, [
  '--colors',
  '--progress'
], context)

const htmlBuildPath = path.resolve(context, 'server/priv/static/index.html'),
      htmlDestPath = path.resolve(context, 'server/web/templates/layout/app.html.eex')

export default function({input}) {
  var [, type] = input

  if (type === 'server')
    return buildClient()
      .then(() => spawnPromise('mv', [htmlBuildPath, htmlDestPath]))
      .then(() => spawnPromise('mix', ['do', 'compile,', 'release'], path.resolve(context, 'server')))
  else
    return buildClient()
}
