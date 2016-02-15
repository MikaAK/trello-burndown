/* eslint-env es6 */

import _ from 'lodash'
import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import IndexBuilder from './webpack-plugins/IndexBuilder'
import S3Plugin from 'webpack-s3-plugin'

const CONTEXT = path.resolve(__dirname),
      DEV_SERVER_PORT = 4000,
      APP_ROOT = path.resolve(CONTEXT, 'app'),
      PUBLIC_PATH = path.resolve(CONTEXT, 'public')

var devtool,
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

var vendor = [
  'json3',
  'es5-shim',
  'reflect-metadata',
  'angular2/bundles/angular2-polyfills',
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
  return path.resolve(CONTEXT, nPath)
}

const {NODE_ENV, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_BUCKET} = process.env,
      BUILD_PATH = createPath('build')

var env = {
  __DEV__: NODE_ENV === 'development',
  __PROD__: NODE_ENV === 'production',
  __TEST__: NODE_ENV === 'test',
  __STAGING__: NODE_ENV === 'staging'
}


const IS_BUILD = env.__STAGING__ || env.__PROD__

var sassLoader = `${IS_BUILD ? 'postcss!' : ''}sass?sourceMap`
var loaders = {
  javascript: {
    test: /\.ts/,
    loader: `babel!ts?${tsIngores.map(num => `ignoreDiagnostics[]=${num}`).join('&')}!tslint`,
    exclude: [/\.(spec|e2e)\.ts/, /node_modules\/(?!(ng2-.+))/],
    include: [createPath('app')]
  },

  html: {
    test: /\.jade/,
    loader: 'jade',
    include: [createPath('app')]
  },

  globalCss: {
    test: /\.s?css/,
    loader: `style!css?sourceMap!${sassLoader}`,
    include: [createPath('app/style/global')]
  },

  componentCss: {
    test: /\.s?css/,
    loader: `raw!${sassLoader}`,
    include: [createPath('app/components')]
  },

  json: {
    test: /\.json/,
    loader: 'json'
  },

  file: {
    test: /\.(png|gif|jpg|jpeg)$/,
    loader: `file${IS_BUILD ? '?name=[hash].[ext]' : ''}!image-webpack?bypassOnDebug`,
    include: [createPath('public/img')]
  },

  svg: {
    test: /\.svg/,
    loader: 'image-webpack?bypassOnDebug!svg-inline',
    include: [createPath('public/svg')]
  }
}

if (env.__PROD__)
  devtool = false
else if (env.__DEV__)
  devtool = 'source-map'
else if (env.__STAGING__ || env.__TEST__)
  devtool = 'inline-source-map'

var config = {
  context: CONTEXT,
  devtool,
  debug: !env.__PROD__ && !env.__STAGING__,

  entry: {
    vendor,
    app: './app/boot.ts'
  },

  output: {
    path: BUILD_PATH,
    filename: IS_BUILD ? '[name]-[hash].js' : '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['', '.ts', '.js', '.json'],
    root: [APP_ROOT, PUBLIC_PATH]
  },

  module: {
    noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/],
    loaders: Object.values(loaders)
  },

  plugins: [
    new webpack.DefinePlugin(env),
    new HtmlWebpackPlugin({
      templateContent: IndexBuilder(CONTEXT),
      favicon: path.resolve(__dirname, 'favicon.ico')
    })
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false
  },

  postcss() {
    return [autoprefixer]
  },

  devServer: {
    port: DEV_SERVER_PORT,
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
    },

    watchOptions: {
      aggregateTimeout: 300
    }
  }
}

if (!env.__TEST__)
  config.plugins.push(
    new CommonsChunkPlugin({
      name: 'vendor',
      filename: IS_BUILD ? 'vendor-[chunkhash].js' : 'vendor.js',
      minChunks: Infinity
    }),
    new CommonsChunkPlugin({
      name: 'common',
      filename: IS_BUILD ? 'common-[hash].js' : 'common.js',
      minChunks: 2,
      chunks: ['app', 'vendor']
    })
  )

if (env.__DEV__) {
  var WebpackNotifierPlugin = require('webpack-notifier')

  config.plugins.push(new WebpackNotifierPlugin({
    title: 'Angular2 App',
    contentImage: createPath('./favicon.ico')
  }))
} else if (IS_BUILD) {
  loaders.globalCss.loader = ExtractTextPlugin.extract('style', loaders.globalCss.loader.replace('style', ''))

  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('[name]-[chunkhash].css'),
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

  config.node = _.extend(config.node, {
    global: 'window',
    progress: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  })

  config.module.noParse = [
    /zone\.js\/dist\/zone-microtask\.js/,
    /zone\.js\/dist\/long-stack-trace-zone\.js/,
    /zone\.js\/dist\/jasmine-patch\.js/
  ]
}

if (!env.__PROD__)
  vendor.push('zone.js/dist/long-stack-trace-zone')
else
  config.plugins.push(
    new S3Plugin({
      exclude: /.*\.html$/,
      s3Options: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      },
      s3UploadOptions: {
        Bucket: AWS_BUCKET,
        CacheControl: 'max-age=315360000, no-transform, public'
      },
      cdnizerOptions: {
        defaultCDNBase: `https://s3-us-west-2.amazonaws.com/${AWS_BUCKET}`
      }
    })
  )

module.exports = config
