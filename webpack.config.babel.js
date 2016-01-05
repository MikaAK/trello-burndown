/* eslint-env es6 */

import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import extractTextWebpackPlugin from 'extract-text-webpack-plugin'
import IndexBuilder from './webpack-plugins/IndexBuilder'
import S3Plugin from 'webpack-s3-plugin'

var devtool,
    context = path.resolve(__dirname),
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

var vendor = [
  'json3',
  'es5-shim',
  'angular2/bundles/angular2-polyfills.js',
  'angular2/platform/browser',
  'angular2/platform/common_dom',
  'angular2/core',
  'angular2/router',
  'angular2/http',
  'rxjs'
]

var tsIngores = [
  2403,
  2300,
  2374,
  2375,
  1005
]

var createPath = function(nPath) {
  return path.resolve(context, nPath)
}

const {NODE_ENV, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET} = process.env,
      BUILD_PATH = createPath('build')

var env = {
  __DEV__: NODE_ENV === 'development',
  __PROD__: NODE_ENV === 'production',
  __TEST__: NODE_ENV === 'test',
  __STAGING__: NODE_ENV === 'staging'
}

var loaders = {
  javascript: {
    test: /\.ts/,
    loader: `babel!ts?${tsIngores.map(num => `ignoreDiagnostics[]=${num}`).join('&')}`,
    exclude: [/\.(test|e2e)\.ts/, /node_modules\/(?!(ng2-.+))/],
    include: [createPath('app')]
  },

  html: {
    test: /\.jade/,
    loader: 'jade',
    include: [createPath('app')]
  },

  css: {
    test: /\.css/,
    loader: 'raw!css&sourceMap!postcss'
  },

  json: {
    test: /\.json/,
    loader: 'json'
  }
}

if (env.__PROD__)
  devtool = false
else if (env.__DEV__)
  devtool = 'source-map'
else if (env.__STAGING__ || env.__TEST__)
  devtool = 'inline-source-map'

var config = {
  context,
  devtool,
  debug: !env.__PROD__ && !env.__STAGING__,

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
    extensions: ['', '.ts', '.js', '.json']
  },

  module: {
    //preLoaders: [{test: /\.ts/, loader: 'tslint'}],
    noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/],
    loaders: Object.values(loaders)
  },

  plugins: [
    new CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js', minChunks: Infinity}),
    new CommonsChunkPlugin({name: 'common', filename: 'common.js', minChunks: 2, chunks: ['app', 'vendor']}),
    new webpack.DefinePlugin(env),
    new HtmlWebpackPlugin({
      templateContent: IndexBuilder(context),
      favicon: path.resolve(__dirname, 'favicon.ico')
    })
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false
  },

  devServer: {
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
    contentImage: createPath('./favicon.ico')
  }))
} else if (env.__PROD__ || env.__STAGING__) {
  loaders.css.loader = extractTextWebpackPlugin('style', loaders.css.loader.replace('raw', ''))

  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),
    new webpack.optimize.UglifyJsPlugin()
  )
} else if (env.__TEST__) {
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
else
  config.plugins.push(
    new S3Plugin({
      exclude: /.*\.html$/,
      s3Options: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
      },
      s3UploadOptions: {
        Bucket: AWS_BUCKET,
        CacheControl: 'max-age=315360000, no-transform, public'
      },
      cdnizerOptions: {
        defaultCDNBase: 'https://s3-us-west-2.amazonaws.com/assets.mikakalathil.ca'
      }
    })
  )

module.exports = config
