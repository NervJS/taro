import { merge } from 'lodash';
import * as path from 'path';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';

import {
  getCssLoader,
  getDefinePlugin,
  getEntry,
  getExtractCssLoader,
  getHtmlWebpackPlugin,
  getStyleLoader,
  getLessLoader,
  getMiniCssExtractPlugin,
  getOutput,
  getPostcssLoader,
  getResolveUrlLoader,
  getSassLoader,
  getStylusLoader,
  processEnvOption
} from '../util/chain';
import { BuildConfig } from '../util/types';
import chain from './base.conf';
import { getPostcssPlugins } from './postcss.conf';

const appPath = process.cwd()
const defaultCSSCompressOption = {
  mergeRules: false,
  mergeIdents: false,
  reduceIdents: false,
  discardUnused: false,
  minifySelectors: false
}

const defaultUglifyJsOption = {
  keep_fnames: true,
  output: {
    comments: false,
    keep_quoted_props: true,
    quote_keys: true,
    beautify: false
  },
  warnings: false
}

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
      babel: emptyObj,
      csso: emptyObj,
      uglify: emptyObj
    }
  } = config

  const devtool = enableSourceMap ? 'hidden-source-map' : 'none'

  const postcssOption = module.postcss || {}

  const styleLoader = getStyleLoader([{ sourceMap: enableSourceMap }, styleLoaderOption])

  const extractCssLoader = getExtractCssLoader()

  const lastCssLoader = enableExtract ? extractCssLoader : styleLoader

  const cssLoader = getCssLoader([
    {
      importLoaders: 1,
      sourceMap: enableSourceMap
    },
    cssLoaderOption,
    {
      minimize: merge(defaultCSSCompressOption, plugins.csso)
    }
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

  chain.merge({
    mode: 'production',
    devtool,
    entry: Object.assign(getEntry(), entry),
    output,
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
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: enableSourceMap,
          uglifyOptions: merge(defaultUglifyJsOption, plugins.uglify)
        })
      ]
    }
  })

  return chain
}
