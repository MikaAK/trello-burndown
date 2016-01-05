import jade from 'jade'
import path from 'path'
import _ from 'lodash'

var isJSFile = function(file) {
  return /\.js$/.test(file)
}
var isCSSFile = function(file) {
  return /\.css$/.test(file)
}
var makeTag = function(file) {
  if (isCSSFile(file))
    return `\n<link rel='stylesheet' href='${file}'>`
  else if (isJSFile(file))
    return `\n<script src='${file}'></script>`
}

export default function(context, locals = {}) {
  const JADE_PATH = path.resolve(context, 'app/index.jade')

  return function(config) {
    var files = config.htmlWebpackPlugin.files

    var compiler = jade.compileFile(JADE_PATH, {
      pretty: true,
      doctype: 'html'
    })

    return compiler(_.merge(locals, {
      scripts: {
        head: files.css.map(makeTag),
        body: files.js.map(makeTag)
      }
    }))
  }
}
