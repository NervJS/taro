import * as path from 'path'
import * as Chain from 'webpack-chain'

import { IBuildConfig } from '../utils/types'
import {
  getCopyWebpackPlugin,
  getDefinePlugin,
  processEnvOption,
  getCssoWebpackPlugin,
  getUglifyPlugin,
  getDevtool,
  getOutput,
  getModule,
  mergeOption,
  getMiniPlugin,
  getMiniCssExtractPlugin,
} from './chain'
import { BUILD_TYPES, PARSE_AST_TYPE, MINI_APP_FILES } from '../utils/constants'
import { Targets } from '../plugins/MiniPlugin'
import { getQuickappConfig } from '../utils/helper'

const emptyObj = {}

export default (appPath: string, mode, config: Partial<IBuildConfig>): any => {
  const chain = new Chain()
  const {
    buildAdapter = BUILD_TYPES.WEAPP,
    alias = emptyObj,
    copy,
    entry = emptyObj,
    output = emptyObj,
    outputRoot = 'dist',
    sourceRoot = 'src',

    designWidth = 750,
    deviceRatio,
    enableSourceMap = false,

    defineConstants = emptyObj,
    env = emptyObj,
    cssLoaderOption = emptyObj,
    sassLoaderOption = emptyObj,
    lessLoaderOption = emptyObj,
    stylusLoaderOption = emptyObj,
    mediaUrlLoaderOption = emptyObj,
    fontUrlLoaderOption = emptyObj,
    imageUrlLoaderOption = emptyObj,
    miniCssExtractPluginOption = emptyObj,

    postcss = emptyObj,

    babel,
    csso,
    uglify
  } = config

  const plugin: any = {}
  const minimizer: any[] = []
  const sourceDir = path.join(appPath, sourceRoot)
  const isQuickapp = buildAdapter === BUILD_TYPES.QUICKAPP

  if (copy) {
    plugin.copyWebpackPlugin = getCopyWebpackPlugin({ copy, appPath })
  }
  const constantsReplaceList = mergeOption([processEnvOption(env), defineConstants])
  plugin.definePlugin = getDefinePlugin([constantsReplaceList])
  plugin.miniPlugin = getMiniPlugin({ buildAdapter, constantsReplaceList })

  plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([{
    filename: `[name]${MINI_APP_FILES[buildAdapter].STYLE}`,
    chunkFilename: `[id]${MINI_APP_FILES[buildAdapter].STYLE}`
  }, miniCssExtractPluginOption])

  const isCssoEnabled = (csso && csso.enable === false)
    ? false
    : true


  const isUglifyEnabled = (uglify && uglify.enable === false)
    ? false
    : true

  if (mode === 'production') {
    if (isUglifyEnabled) {
      minimizer.push(getUglifyPlugin([
        enableSourceMap,
        uglify ? uglify.config : {}
      ]))
    }

    if (isCssoEnabled) {
      plugin.cssoWebpackPlugin = getCssoWebpackPlugin([csso ? csso.config : {}])
    }
  }
  const mainConfig = {
    mode,
    devtool: getDevtool(enableSourceMap),
    entry,
    output: getOutput(appPath, [{
      outputRoot,
      publicPath: '/',
      buildAdapter
    }, output]),
    target: Targets[buildAdapter],
    resolve: {
      alias,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      mainFields: ['main', 'module'],
      symlinks: true,
      modules: [
        path.join(appPath, 'node_modules'),
        'node_modules'
      ]
    },
    resolveLoader: {
      modules: [
        'node_modules'
      ]
    },
    module: getModule(appPath, {
      sourceDir,

      buildAdapter,
      constantsReplaceList,
      designWidth,
      deviceRatio,
      enableSourceMap,

      cssLoaderOption,
      lessLoaderOption,
      sassLoaderOption,
      stylusLoaderOption,
      fontUrlLoaderOption,
      imageUrlLoaderOption,
      mediaUrlLoaderOption,

      postcss,
      babel
    }),
    plugin,
    optimization: {
      minimizer,
      runtimeChunk: {
        name: 'runtime'
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        name: 'vendors',
        cacheGroups: {
          vendors: {
            test (module) {
              return /[\\/]node_modules[\\/]/.test(module.resource) && module.miniType !== PARSE_AST_TYPE.COMPONENT
            }
          }
        }
      }
    }
  }

  // if (isQuickapp) {
  //   const quickappConfig = getQuickappConfig(appPath)
  //   const features = quickappConfig['features']
  //   if (features && features.length) {
  //     const externals = {}
  //     features.forEach(item => {
  //       externals[`@${item.name}`] = {
  //         root: `@${item.name}`
  //       }
  //     })
  //     mainConfig['externals'] = externals
  //   }
  // }
  chain.merge(mainConfig)
  return chain
}
