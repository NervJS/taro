import * as webpack from 'webpack'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'

import { getPostcssPlugins } from './postcss.conf'
import { BuildConfig } from '../util/types'

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

export default (config: BuildConfig): webpack.Configuration => {
  const useModuleConf = config.module || {
    compress: {}
  }
  const sourceMap = config.sourceMap
  const cssExtractPlugins = [] as any[]
  const devtool = 'hidden-source-map'
  const compress = Object.assign({}, {
    css: defaultCSSCompressConf,
    js: defaultJSCompressConf
  }, useModuleConf.compress)
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
    use: [ MiniCssExtractPlugin.loader, cssLoader, postcssLoader, sassLoader ]
  }, {
    test: /\.less(\?.*)?$/,
    exclude: /node_modules/,
    use: [ MiniCssExtractPlugin.loader, cssLoader, postcssLoader, lessLoader ]
  }, {
    test: /\.styl(\?.*)?$/,
    exclude: /node_modules/,
    use: [ MiniCssExtractPlugin.loader, cssLoader, postcssLoader, stylusLoader ]
  }, {
    test: /\.(css|scss|sass)(\?.*)?$/,
    include: /node_modules/,
    use: [ MiniCssExtractPlugin.loader, cssLoader, sassLoader ]
  }, {
    test: /\.less(\?.*)?$/,
    include: /node_modules/,
    use: [ MiniCssExtractPlugin.loader, cssLoader, lessLoader ]
  }, {
    test: /\.styl(\?.*)?$/,
    include: /node_modules/,
    use: [ MiniCssExtractPlugin.loader, cssLoader, stylusLoader ]
  }]

  cssExtractPlugins.push(new MiniCssExtractPlugin({
    filename: 'css/[name].css',
    chunkFilename: 'css/[id].css'
  }))

  return {
    mode: 'production',
    devtool,
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
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap,
          uglifyOptions: compress.js
        })
      ]
    },
    plugins: cssExtractPlugins
  } as webpack.Configuration
}
