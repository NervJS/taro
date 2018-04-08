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
  const cssLoaders = []
  const devtool = 'hidden-source-map'
  const compress = Object.assign({}, {
    css: defaultCSSCompressConf,
    js: defaultJSCompressConf
  }, useModuleConf.compress)
  cssLoaders.push({
    test: /\.(css|scss|sass)(\?.*)?$/,
    loader: ExtractTextPlugin.extract({
      fallback: require.resolve('style-loader'),
      use: [
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            minimize: compress.css,
            sourceMap
          }
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            ident: 'postcss',
            plugins: () => getPostcssPlugins(config)
          }
        },
        require.resolve('sass-loader')
      ]
    })
  })
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
