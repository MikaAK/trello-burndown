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

var getIndexFromRegex = function(files, regex) {
  return files.reduce((match, file, i) => regex.test(file) ? i : match, null)
}

var sortJS = function(files) {
  var vendor = files.splice(getIndexFromRegex(files, /vendor/), 1),
      common = files.splice(getIndexFromRegex(files, /common/), 1)

  files.unshift(vendor)
  files.unshift(common)

  return files
}

export default function(context, locals = {}) {
  const JADE_PATH = path.resolve(context, 'index.jade')

  return function(config) {
    var files = config.htmlWebpackPlugin.files

    var compiler = jade.compileFile(JADE_PATH, {
      pretty: true,
      doctype: 'html'
    })

    console.log(sortJS(files.js).map(makeTag))
    return compiler(_.merge(locals, {
      scripts: {
        head: files.css.map(makeTag),
        body: sortJS(files.js).map(makeTag)
      }
    }))
  }
}
