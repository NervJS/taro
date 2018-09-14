import * as path from 'path';

import {
  getCssLoader,
  getDefinePlugin,
  getEntry,
  getHtmlWebpackPlugin,
  getLessLoader,
  getOutput,
  getPostcssLoader,
  getResolveUrlLoader,
  getSassLoader,
  getStyleLoader,
  getStylusLoader,
  getExtractCssLoader,
  processEnvOption,
  getMiniCssExtractPlugin,
  getHotModuleReplacementPlugin
} from '../util/chain';
import { BuildConfig } from '../util/types';
import chain from './base.conf';
import { getPostcssPlugins } from './postcss.conf';

const appPath = process.cwd()
const emptyObj = {}

export default function (config: Partial<BuildConfig>): any {
  const {
    alias = emptyObj,
    entry = emptyObj,
    sourceRoot = '',
    outputRoot,
    publicPath,
    staticDirectory = 'static',
    chunkDirectory = 'chunk',

    designWidth = 750,
    deviceRatio,
    enableSourceMap = true,
    enableExtract = false,
    
    defineConstants = emptyObj,
    env = emptyObj,
    styleLoaderOption = emptyObj,
    cssLoaderOption = emptyObj,
    sassLoaderOption = emptyObj,
    lessLoaderOption = emptyObj,
    stylusLoaderOption = emptyObj,
    mediaUrlLoaderOption = emptyObj,
    fontUrlLoaderOption = emptyObj,
    imageUrlLoaderOption = emptyObj,
    
    miniCssExtractPluginOption = emptyObj,

    module = {
      postcss: emptyObj
    },
    plugins = {
      babel: emptyObj
    }
  } = config

  const devtool = enableSourceMap ? 'cheap-module-eval-source-map' : 'none'

  const postcssOption = module.postcss || {}

  const styleLoader = getStyleLoader([{ sourceMap: enableSourceMap }, styleLoaderOption])

  const extractCssLoader = getExtractCssLoader()

  const lastCssLoader = enableExtract ? extractCssLoader : styleLoader

  const cssLoader = getCssLoader([
    {
      importLoaders: 1,
      sourceMap: enableSourceMap
    },
    cssLoaderOption
  ])

  const postcssLoader = getPostcssLoader([
    { sourceMap: enableSourceMap },
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

  const lessLoader = getLessLoader([{ sourceMap: enableSourceMap }, lessLoaderOption])

  const stylusLoader = getStylusLoader([{ sourceMap: enableSourceMap }, stylusLoaderOption])

  const output = getOutput({
    outputRoot,
    publicPath,
    chunkDirectory
  })

  const plugin = {} as any

  if (enableExtract) {
    plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([{
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }, miniCssExtractPluginOption])
  }
  plugin.htmlWebpackPlugin = getHtmlWebpackPlugin([{
    filename: 'index.html',
    template: path.join(appPath, sourceRoot, 'index.html')
  }])
  plugin.definePlugin = getDefinePlugin([processEnvOption(env), defineConstants])
  plugin.hotModuleReplacementPlugin = getHotModuleReplacementPlugin([])

  chain.merge({
    mode: 'development',
    entry: Object.assign(getEntry(), entry),
    output,
    devtool,
    resolve: { alias },
    module: {
      rule: {
        jsx: {
          use: {
            babelLoader: {
              options: {
                ...plugins.babel,
                sourceMap: enableSourceMap
              }
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
          use: [lastCssLoader, cssLoader, postcssLoader, resolveUrlLoader, sassLoader]
        },
        less: {
          test: /\.less(\?.*)?$/,
          exclude: [/node_modules/],
          use: [lastCssLoader, cssLoader, postcssLoader, lessLoader]
        },
        styl: {
          test: /\.styl(\?.*)?$/,
          exclude: [/node_modules/],
          use: [lastCssLoader, cssLoader, postcssLoader, stylusLoader]
        },
        sassInNodemodules: {
          test: /\.(css|scss|sass)(\?.*)?$/,
          include: [/node_modules/],
          use: [lastCssLoader, cssLoader, sassLoader]
        },
        lessInNodemodules: {
          test: /\.less(\?.*)?$/,
          include: [/node_modules/],
          use: [lastCssLoader, cssLoader, lessLoader]
        },
        stylInNodemodules: {
          test: /\.styl(\?.*)?$/,
          include: [/node_modules/],
          use: [lastCssLoader, cssLoader, stylusLoader]
        }
      }
    },
    plugin,
    optimization: {
      noEmitOnErrors: true
    }
  })

  return chain
}
