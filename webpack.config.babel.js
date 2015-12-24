/* eslint-env es6 */

// TS-Ignores
// 2403 - Subsequent variable declaration, 2300 - Duplicate identifier
// 2374 - Duplicate number index signature, 2375 - Duplicate string index signature

import path from 'path'
import webpack from 'webpack'

var context = path.resolve(__dirname),
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

var vendor = [
  'json3',
  'es5-shim',
  'es6-shim',
  'angular2/platform/browser',
  'angular2/platform/common_dom',
  'angular2/core',
  'angular2/router',
  'angular2/http',
  'rxjs',
  'angular2/bundles/angular2-polyfills.js'
]

var createPath = function(path) {
  return path.resolve(context, path)
}

const {NODE_ENV} = process.env,
      TS_IGNORES = [2403, 2300, 2374, 2375],
      BUILD_PATH = createPath('build')

var env = {
  __DEV__: NODE_ENV === 'development',
  __PROD__: NODE_ENV === 'production',
  __TEST__: NODE_ENV === 'test',
  __STAGING__: NODE_ENV === 'staging'
}

var config = {
  devtool: 'source-map',
  debug: !env.__PROD__,

  entry: {
    vendor,
    app: './app/boot.ts'
  },

  output: {
    path: BUILD_PATH,
    filename: env.__STAGING__ || env.__PROD__ ? '[name]-[hash].js' : '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['','.ts','.js','.json']
  },

  module: {
    preLoaders: [{test: /\.ts/, loader: 'tslint'}],
    noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/],
    loaders: [{
      test: /\.ts/,
      loader: 'ts',
      exclude: [/\.(test|e2e)\.ts/, /node_modules\/(?!(ng2-.+))/],
      query: {
        ignoreDiagnostics: TS_IGNORES
      }
    }, {
      test: /\.json/,
      loader: 'json-loader'
    }]
  },

  plugins: [
    new CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js', minChunks: Infinity}),
    new CommonsChunkPlugin({name: 'common', filename: 'common.js', minChunks: 2, chunks: ['app', 'vendor']})
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false
  },

  devServer: {
    publicPath: BUILD_PATH,
    // Sample Proxy Config
    //proxy: [{
      //path: '/api/*',
      //target: 'http://localhost:4000'
    //}],
    historyApiFallback: {
      // If you have multiple entrypoints add them here
      rewrites: [{
        from: /.*/,
        to: '/index.html'
      }]
    }
  }
}

if (env.__DEV__) {
  var WebpackNotifierPlugin = require('webpack-notifier')

  config.plugins.push(new WebpackNotifierPlugin({
    title: 'Angular2 App',
    contentImage: createPath('./favicon.png')
  }))
}

if (env.__TEST__) {
  config.resolve.cache = false
  config.stats = {
    colors: true,
    reasons: true
  }

  config.module.noParse = [
    /zone\.js\/dist\/zone-microtask\.js/,
    /zone\.js\/dist\/long-stack-trace-zone\.js/,
    /zone\.js\/dist\/jasmine-patch\.js/
  ]
}

if (!env.__PROD__)
  vendor.push('zone.js/lib/browser/long-stack-trace-zone')

module.exports = config
