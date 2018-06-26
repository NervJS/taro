import webpack from 'webpack'
import { getPostcssPlugins } from './postcss.conf'
import { BuildConfig } from '../util/types'

export default function (config: BuildConfig): webpack.Configuration {
  const styleLoader = require.resolve('style-loader')
  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1
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
  return {
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(css|scss|sass)(\?.*)?$/,
              exclude: /node_modules/,
              use: [ styleLoader, cssLoader, postcssLoader, sassLoader ]
            },
            {
              test: /\.less(\?.*)?$/,
              exclude: /node_modules/,
              use: [ styleLoader, cssLoader, postcssLoader, lessLoader ]
            },
            {
              test: /\.styl(\?.*)?$/,
              exclude: /node_modules/,
              use: [ styleLoader, cssLoader, postcssLoader, stylusLoader ]
            },
            {
              test: /\.(css|scss|sass)(\?.*)?$/,
              include: /node_modules/,
              use: [ styleLoader, cssLoader, sassLoader ]
            },
            {
              test: /\.less(\?.*)?$/,
              include: /node_modules/,
              use: [ styleLoader, cssLoader, lessLoader ]
            },
            {
              test: /\.styl(\?.*)?$/,
              include: /node_modules/,
              use: [ styleLoader, cssLoader, stylusLoader ]
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
  }
}
