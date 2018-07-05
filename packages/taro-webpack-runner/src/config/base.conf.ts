import * as path from 'path'
import * as Util from '../util'
import * as webpack from 'webpack'
import { BuildConfig } from '../util/types'

export default (config: BuildConfig): webpack.Configuration => {
  const { staticDirectory = 'static', plugins = {} } = config
  const imgName = `${staticDirectory}/images/[name].[ext]`
  const mediaName = `${staticDirectory}/media/[name].[ext]`
  const fontName = `${staticDirectory}/fonts/[name].[ext]`
  const extName = `${staticDirectory}/ext/[name].[ext]`
  const imgLimit = (config.module && config.module.base64 && config.module.base64.imageLimit) || 2000
  const fontLimit = (config.module && config.module.base64 && config.module.base64.fontLimit) || 2000
  const babelConfig = plugins.babel || {}
  babelConfig.plugins = (Array.isArray(babelConfig.plugins) ? babelConfig.plugins : []).concat([
    require.resolve('babel-plugin-syntax-dynamic-import'),
    [require.resolve('babel-plugin-transform-react-jsx'), {
      pragma: 'Nerv.createElement'
    }]
  ])

  const babelLoader = {
    loader: require.resolve('babel-loader'),
    options: babelConfig
  }

  return {
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: [ babelLoader ]
            },
            {
              test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
              loader: require.resolve('file-loader'),
              options: {
                name: mediaName
              }
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: require.resolve('file-loader'),
              options: {
                limit: fontLimit,
                name: fontName
              }
            },
            {
              test: /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/,
              loader: require.resolve('url-loader'),
              options: {
                limit: imgLimit,
                name: imgName
              }
            },
            {
              exclude: /\.(jsx?|tsx?|css|scss|sass|less|styl|html|json|ejs)$/,
              loader: require.resolve('url-loader'),
              options: {
                limit: 2000,
                name: extName
              }
            }
          ]
        }
      ]
    },
    resolve: {
      mainFields: ['main', 'module'],
      symlinks: false,
      modules: [path.join(Util.getRootPath(), 'node_modules'), 'node_modules']
    },
    resolveLoader: {
      modules: [path.join(Util.getRootPath(), 'node_modules'), 'node_modules']
    }
  } as webpack.Configuration
}
