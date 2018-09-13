import * as webpack from 'webpack';

import {
  getCssLoader,
  getLessLoader,
  getPostcssLoader,
  getResolveUrlLoader,
  getSassLoader,
  getStyleLoader,
  getStylusLoader,
  getEntry,
  getOutput
} from '../util/chain';
import { BuildConfig } from '../util/types';
import chain from './base.conf';
import { getPostcssPlugins } from './postcss.conf';

const emptyObj = {}

export default function (config: Partial<BuildConfig>): any {
  const {
    alias = emptyObj,
    entry = emptyObj,
    outputRoot,
    publicPath,
    staticDirectory = 'static',

    designWidth = 750,
    deviceRatio,
    sourceMap = true,

    cssLoaderOption = emptyObj,
    styleLoaderOption = emptyObj,
    sassLoaderOption = emptyObj,
    lessLoaderOption = emptyObj,
    stylusLoaderOption = emptyObj,
    mediaUrlLoaderOption = emptyObj,
    fontUrlLoaderOption = emptyObj,
    imageUrlLoaderOption = emptyObj,

    module = {
      postcss: emptyObj
    },
    plugins = {
      babel: emptyObj
    }
  } = config

  const postcssOption = module.postcss || {}

  const styleLoader = getStyleLoader([{ sourceMap }, styleLoaderOption])

  const cssLoader = getCssLoader([
    {
      importLoaders: 1,
      sourceMap
    },
    cssLoaderOption
  ])

  const postcssLoader = getPostcssLoader([
    { sourceMap },
    {
      ident: 'postcss',
      plugins: getPostcssPlugins({
        designWidth,
        deviceRatio,
        postcssOption
      })
    }
  ])

  const resolveUrlLoader = getResolveUrlLoader([])

  const sassLoader = getSassLoader([{ sourceMap: true }, sassLoaderOption])

  const lessLoader = getLessLoader([{ sourceMap }, lessLoaderOption])

  const stylusLoader = getStylusLoader([{ sourceMap }, stylusLoaderOption])

  const output = getOutput({
    outputRoot,
    publicPath
  })

  chain.merge({
    mode: 'development',
    entry: Object.assign(getEntry(), entry),
    output,
    devtool: 'cheap-module-eval-source-map',
    resolve: { alias },
    module: {
      rule: {
        jsx: {
          use: {
            babelLoader: {
              options: plugins.babel
            }
          }
        },
        media: {
          use: {
            urlLoader: {
              options: {
                name: `${staticDirectory}/media/[name].[ext]`,
                ...mediaUrlLoaderOption
              }
            }
          }
        },
        font: {
          use: {
            urlLoader: {
              options: {
                name: `${staticDirectory}/fonts/[name].[ext]`,
                ...fontUrlLoaderOption
              }
            }
          }
        },
        image: {
          use: {
            urlLoader: {
              options: {
                name: `${staticDirectory}/images/[name].[ext]`,
                ...imageUrlLoaderOption
              }
            }
          }
        },
        sass: {
          test: /\.(css|scss|sass)(\?.*)?$/,
          exclude: [/node_modules/],
          use: [styleLoader, cssLoader, postcssLoader, resolveUrlLoader, sassLoader]
        },
        less: {
          test: /\.less(\?.*)?$/,
          exclude: [/node_modules/],
          use: [styleLoader, cssLoader, postcssLoader, lessLoader]
        },
        styl: {
          test: /\.styl(\?.*)?$/,
          exclude: [/node_modules/],
          use: [styleLoader, cssLoader, postcssLoader, stylusLoader]
        },
        sassInNodemodules: {
          test: /\.(css|scss|sass)(\?.*)?$/,
          include: [/node_modules/],
          use: [styleLoader, cssLoader, sassLoader]
        },
        lessInNodemodules: {
          test: /\.less(\?.*)?$/,
          include: [/node_modules/],
          use: [styleLoader, cssLoader, lessLoader]
        },
        stylInNodemodules: {
          test: /\.styl(\?.*)?$/,
          include: [/node_modules/],
          use: [styleLoader, cssLoader, stylusLoader]
        }
      }
    },
    plugin: {
      hot: {
        plugin: webpack.HotModuleReplacementPlugin
      }
    },
    optimization: {
      noEmitOnErrors: true
    }
  })

  return chain
}
