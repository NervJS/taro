import * as path from 'path'
import * as Chain from 'webpack-chain'

import { getRootPath } from '../util'
import {
  getBabelLoader,
  getUrlLoader,
  defaultBabelLoaderOption,
  defaultFontUrlLoaderOption,
  defaultMediaUrlLoaderOption,
  defaultImageUrlLoaderOption
} from '../util/chain';

export default () => {
  const chain = new Chain()

  chain.merge({
    module: {
      rule: {
        jsx: {
          test: /\.jsx?$/,
          use: {
            babelLoader: getBabelLoader([defaultBabelLoaderOption])
          }
        },
        jsxxx: {
          test: /\.jsx?$/,
          include: [/aaaa/],
          use: {
            babelLoader: {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: [
                  require.resolve('babel-plugin-syntax-dynamic-import'),
                  [
                    require.resolve('babel-plugin-transform-react-jsx'),
                    {
                      pragma: 'Nerv.createElement'
                    }
                  ]
                ]
              }
            }
          }
        },
        media: {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          use: {
            urlLoader: getUrlLoader([defaultMediaUrlLoaderOption])
          }
        },
        font: {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: {
            urlLoader: getUrlLoader([defaultFontUrlLoaderOption])
          }
        },
        image: {
          test: /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/,
          use: {
            urlLoader: getUrlLoader([defaultImageUrlLoaderOption])
          }
        }
      }
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: ['main', 'module'],
      symlinks: true,
      modules: [path.join(getRootPath(), 'node_modules'), 'node_modules']
    },
    resolveLoader: {
      modules: [path.join(getRootPath(), 'node_modules')]
    }
  })

  return chain
}
