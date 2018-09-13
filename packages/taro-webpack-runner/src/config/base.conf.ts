import * as path from 'path'

import { getRootPath } from '../util'
import * as Chain from 'webpack-chain'

const chain = new Chain()

chain.merge({
  module: {
    rule: {
      jsx: {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: {
          babelLoader: {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                require.resolve('babel-plugin-syntax-dynamic-import'),
                [require.resolve('babel-plugin-transform-react-jsx'), {
                  pragma: 'Nerv.createElement'
                }]
              ]
            }
          }
        }
      },
      media: {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          urlLoader: {
            loader: require.resolve('url-loader')
          }
        }
      },
      font: {
        test: [/\.(woff2?|eot|ttf|otf)(\?.*)?$/],
        use: {
          urlLoader: {
            loader: require.resolve('url-loader'),
            options: {
              limit: 2000
            }
          }
        }
      },
      image: {
        test: [/\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/],
        use: {
          urlLoader: {
            loader: require.resolve('url-loader'),
            options: {
              limit: 2000
            }
          }
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['main', 'module'],
    symlinks: true,
    modules: [
      path.join(getRootPath(), 'node_modules'),
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      path.join(getRootPath(), 'node_modules')
    ]
  }
})

export default chain
