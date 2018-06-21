const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const { getPostcssPlugins } = require('./postcss.conf')

const defaultCSSCompressConf = {
  mergeRules: false,
  mergeIdents: false,
  reduceIdents: false,
  discardUnused: false,
  minifySelectors: false
}
const defaultJSCompressConf = {
  keep_fnames: true,
  output: {
    comments: false,
    keep_quoted_props: true,
    quote_keys: true,
    beautify: false
  },
  warnings: false
}

module.exports = function (config) {
  const useModuleConf = config.module || {
    compress: {}
  }
  const sourceMap = config.sourceMap
  const cssExtractPlugins = []
  const devtool = 'hidden-source-map'
  const compress = Object.assign({}, {
    css: defaultCSSCompressConf,
    js: defaultJSCompressConf
  }, useModuleConf.compress)
  const styleLoader = require.resolve('style-loader')
  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      minimize: compress.css,
      sourceMap
    }
  }
  const postcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss',
      plugins: () => getPostcssPlugins(config)
    }
  }
  const sassLoader = require.resolve('sass-loader')
  const lessLoader = require.resolve('less-loader')
  const stylusLoader = require.resolve('stylus-loader')

  const cssLoaders = [{
    test: /\.(css|scss|sass)(\?.*)?$/,
    exclude: /node_modules/,
    loader: ExtractTextPlugin.extract({
      fallback: styleLoader,
      use: [ cssLoader, postcssLoader, sassLoader ]
    })
  }, {
    test: /\.less(\?.*)?$/,
    exclude: /node_modules/,
    loader: ExtractTextPlugin.extract({
      fallback: styleLoader,
      use: [ cssLoader, postcssLoader, lessLoader ]
    })
  }, {
    test: /\.styl(\?.*)?$/,
    exclude: /node_modules/,
    loader: ExtractTextPlugin.extract({
      fallback: styleLoader,
      use: [ cssLoader, postcssLoader, stylusLoader ]
    })
  }, {
    test: /\.(css|scss|sass)(\?.*)?$/,
    include: /node_modules/,
    loader: ExtractTextPlugin.extract({
      fallback: styleLoader,
      use: [ cssLoader, sassLoader ]
    })
  }, {
    test: /\.less(\?.*)?$/,
    include: /node_modules/,
    loader: ExtractTextPlugin.extract({
      fallback: styleLoader,
      use: [ cssLoader, lessLoader ]
    })
  }, {
    test: /\.styl(\?.*)?$/,
    include: /node_modules/,
    loader: ExtractTextPlugin.extract({
      fallback: styleLoader,
      use: [ cssLoader, stylusLoader ]
    })
  }]

  cssExtractPlugins.push(new ExtractTextPlugin({
    filename: 'css/[name].css'
  }))

  const plugins = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap,
      uglifyOptions: compress.js
    }),
    ...cssExtractPlugins
  ]

  return {
    devtool: devtool,
    module: {
      rules: [
        {
          oneOf: [
            ...cssLoaders
          ]
        }
      ]
    },
    resolve: {
      mainFields: ['main']
    },
    plugins: plugins
  }
}
