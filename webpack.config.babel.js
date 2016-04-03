/* eslint-env es6 */

import _ from 'lodash'
import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import IndexBuilder from './webpack-plugins/IndexBuilder'
import S3Plugin from 'webpack-s3-plugin'
import {vendor} from './vendors.json'

const CONTEXT = path.resolve(__dirname),
      DEV_SERVER_PORT = 4000,
      APP_ROOT = path.resolve(CONTEXT, 'src'),
      PUBLIC_PATH = path.resolve(CONTEXT, 'public'),
      createPath = nPath => path.resolve(CONTEXT, nPath),
      {NODE_ENV, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET, TRELLO_KEY} = process.env,
      BUILD_PATH = createPath('server/priv/static'),
      CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

var devtool

const TS_INGORES = [
  2403,
  2300,
  2374,
  2375,
  1005
]

const ENV = {
  __DEV__: NODE_ENV === 'development',
  __PROD__: NODE_ENV === 'production',
  __TEST__: NODE_ENV === 'test',
  __STAGING__: NODE_ENV === 'staging',
  __TRELLO_KEY__: TRELLO_KEY
}

const IS_BUILD = ENV.__STAGING__ || ENV.__PROD__,
      SASS_LOADER = `${IS_BUILD ? 'postcss!' : ''}sass?sourceMap`,
      DEFAULT_CDN = `https://s3-us-west-2.amazonaws.com/${AWS_BUCKET}`

var loaders = {
  javascript: {
    test: /\.ts/,
    loader: `babel!ts?${TS_INGORES.map(num => `ignoreDiagnostics[]=${num}`).join('&')}`,
    exclude: [createPath('node_modules')],
    include: [createPath('src'), createPath('vendor/es6/')]
  },

  html: {
    test: /\.jade/,
    loader: 'jade',
    include: [createPath('src')]
  },

  globalCss: {
    test: /\.s?css/,
    loader: `style!css?sourceMap!${SASS_LOADER}`,
    include: [createPath('src/style')]
  },

  // For to-string removes the ability to cache css so we use raw in development
  componentCss: {
    test: /\.s?css/,
    loader: `${IS_BUILD ? 'to-string!css' : 'raw'}!${SASS_LOADER}`,
    exclude: [createPath('src/style')]
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

if (ENV.__PROD__)
  devtool = false
else if (ENV.__DEV__)
  devtool = 'source-map'
else if (ENV.__STAGING__ || ENV.__TEST__)
  devtool = 'inline-source-map'

var config = {
  context: CONTEXT,
  devtool,
  debug: !ENV.__PROD__ && !ENV.__STAGING__,

  entry: {
    vendor,
    app: './src/boot.ts'
  },

  output: {
    path: BUILD_PATH,
    publicPath: IS_BUILD ? DEFAULT_CDN : '',
    filename: IS_BUILD ? '[name]-[hash].js' : '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['', '.ts', '.js', '.json'],
    root: [APP_ROOT, PUBLIC_PATH],
    alias: {
      vendor: createPath('vendor'),
      holidays: createPath('holidays.json')
    }
  },

  module: {
    noParse: [/.+zone\.js\/dist\/.+/, /.+angular2\/bundles\/.+/],
    preLoaders: [{
      test: /\.ts/,
      loader: 'tslint',
      exclude: [createPath('node_modules')],
      include: [createPath('src')]
    }],

    loaders: Object.values(loaders)
  },

  plugins: [
    new webpack.DefinePlugin(ENV),
    new HtmlWebpackPlugin({
      templateContent: IndexBuilder(APP_ROOT, {TRELLO_KEY}),
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

    proxy: [{
      path: '/api/*',
      target: 'http://localhost:3000'
    }],

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

if (!ENV.__TEST__)
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

if (ENV.__DEV__) {
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
    new webpack.optimize.UglifyJsPlugin({mangle: false})
  )
} else if (ENV.__TEST__) {
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

if (!ENV.__PROD__)
  vendor.push('zone.js/dist/long-stack-trace-zone')
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
        defaultCDNBase: DEFAULT_CDN
      }
    })
    // new S3Plugin({
      // directory: PUBLIC_PATH,
      // basePath: 'public/',
      // exclude: /\.svg$/,
      // s3Options: {
        // accessKeyId: AWS_ACCESS_KEY,
        // secretAccessKey: AWS_SECRET_KEY
      // },
      // s3UploadOptions: {
        // Bucket: AWS_BUCKET,
        // CacheControl: 'max-age=315360000, no-transform, public'
      // },
      // cdnizerOptions: {
        // defaultCDNBase: `https://s3-us-west-2.amazonaws.com/${AWS_BUCKET}`
      // }
    // })
  )

module.exports = config
