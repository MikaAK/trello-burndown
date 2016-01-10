// Karma configuration
// Generated on Sun Jan 10 2016 02:44:09 GMT-0800 (PST)
require('babel-register')
var _ = require('lodash'),
    path = require('path'),
    webpackConfig = require('./webpack.config.babel.js')

delete webpackConfig.entry

var paths = {
  boot: path.resolve(__dirname, 'spec.bundle.js'),
  test: path.resolve(__dirname, 'app/**/*.spec.ts')
}

var preprocessors = {},
    preprocessor = ['webpack', 'sourcemap']

preprocessors[paths.boot] = preprocessor
preprocessors[paths.test] = preprocessor

module.exports = function(config) {
  config.set({
    webpack: webpackConfig,
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['phantomjs-shim', 'jasmine'],


    // list of files / patterns to load in the browser
    files: _(paths).values().flatten().value(),


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: preprocessors,


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
