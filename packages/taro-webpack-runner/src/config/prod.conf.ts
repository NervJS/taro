import { merge } from 'lodash'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'

import { getCssLoader, getExtractCssLoader, getLessLoader, getPostcssLoader, getResolveUrlLoader, getSassLoader, getStylusLoader, getEntry, getOutput } from '../util/chain'
import { BuildConfig } from '../util/types'
import chain from './base.conf'
import { getPostcssPlugins } from './postcss.conf'

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
    outputRoot,
    publicPath,
    staticDirectory = 'static',

    designWidth = 750,
    deviceRatio,
    sourceMap = false,

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

  const postcssOption = module.postcss || {}

  const cssLoader = getCssLoader([
    {
      importLoaders: 1,
      sourceMap
    },
    cssLoaderOption,
    {
      minimize: merge(defaultCSSCompressOption, plugins.csso)
    }
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

  const extractCssLoader = getExtractCssLoader()

  const output = getOutput({
    outputRoot,
    publicPath
  })

  chain.merge({
    mode: 'production',
    devtool: 'hidden-source-map',
    entry: Object.assign(getEntry(), entry),
    output,
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
          use: [extractCssLoader, cssLoader, postcssLoader, resolveUrlLoader, sassLoader]
        },
        less: {
          test: /\.less(\?.*)?$/,
          exclude: [/node_modules/],
          use: [extractCssLoader, cssLoader, postcssLoader, lessLoader]
        },
        styl: {
          test: /\.styl(\?.*)?$/,
          exclude: [/node_modules/],
          use: [extractCssLoader, cssLoader, postcssLoader, stylusLoader]
        },
        sassInNodemodules: {
          test: /\.(css|scss|sass)(\?.*)?$/,
          include: [/node_modules/],
          use: [extractCssLoader, cssLoader, sassLoader]
        },
        lessInNodemodules: {
          test: /\.less(\?.*)?$/,
          include: [/node_modules/],
          use: [extractCssLoader, cssLoader, lessLoader]
        },
        stylInNodemodules: {
          test: /\.styl(\?.*)?$/,
          include: [/node_modules/],
          use: [extractCssLoader, cssLoader, stylusLoader]
        }
      }
    },
    plugin: {
      extractCss: {
        plugin: MiniCssExtractPlugin,
        args: [
          merge(
            {
              filename: 'css/[name].css',
              chunkFilename: 'css/[id].css'
            },
            miniCssExtractPluginOption
          )
        ]
      }
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap,
          uglifyOptions: merge(defaultUglifyJsOption, plugins.uglify)
        })
      ]
    }
  })

  return chain
}
