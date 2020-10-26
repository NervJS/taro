import * as path from 'path'
import { get, mapValues, merge } from 'lodash'
import { FRAMEWORK_MAP } from '@tarojs/helper'
import { addTrailingSlash, emptyObj } from '../util'
import {
  getCopyWebpackPlugin,
  getCssoWebpackPlugin,
  getDefinePlugin,
  getDevtool,
  getHtmlWebpackPlugin,
  getMiniCssExtractPlugin,
  getMainPlugin,
  getModule,
  getOutput,
  getTerserPlugin,
  processEnvOption
} from '../util/chain'
import { BuildConfig } from '../util/types'
import getBaseChain from './base.conf'
import { customVueChain } from './vue'
import { customVue3Chain } from './vue3'

export default function (appPath: string, config: Partial<BuildConfig>): any {
  const chain = getBaseChain(appPath, config)
  const {
    alias = emptyObj,
    copy,
    entry = emptyObj,
    entryFileName = 'app',
    output = emptyObj,
    sourceRoot = '',
    outputRoot = 'dist',
    publicPath = '',
    staticDirectory = 'static',
    chunkDirectory = 'chunk',
    router = emptyObj,

    designWidth = 750,
    deviceRatio,
    enableSourceMap = false,
    sourceMapType,
    enableExtract = true,

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
    esnextModules = [],

    postcss,
    csso,
    uglify,
    terser
  } = config
  const sourceDir = path.join(appPath, sourceRoot)
  const outputDir = path.join(appPath, outputRoot)
  const isMultiRouterMode = get(router, 'mode') === 'multi'

  const plugin: any = {}

  plugin.mainPlugin = getMainPlugin({
    framework: config.framework,
    entryFileName,
    sourceDir,
    outputDir,
    routerConfig: router
  })

  if (enableExtract) {
    plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([
      {
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css'
      },
      miniCssExtractPluginOption
    ])
  }

  if (copy) {
    plugin.copyWebpackPlugin = getCopyWebpackPlugin({ copy, appPath })
  }

  if (isMultiRouterMode) {
    merge(plugin, mapValues(entry, (filePath, entryName) => {
      return getHtmlWebpackPlugin([{
        filename: `${entryName}.html`,
        template: path.join(appPath, sourceRoot, 'index.html'),
        chunks: [entryName]
      }])
    }))
  } else {
    plugin.htmlWebpackPlugin = getHtmlWebpackPlugin([{
      filename: 'index.html',
      template: path.join(appPath, sourceRoot, 'index.html')
    }])
  }

  plugin.definePlugin = getDefinePlugin([processEnvOption(env), defineConstants])

  const isCssoEnabled = !(csso && csso.enable === false)

  if (isCssoEnabled) {
    plugin.cssoWebpackPlugin = getCssoWebpackPlugin([csso ? csso.config : {}])
  }

  const mode = 'production'

  const minimizer: any[] = []
  const uglifyConfig = uglify || terser
  const isUglifyEnabled = !(uglifyConfig && uglifyConfig.enable === false)

  if (isUglifyEnabled) {
    minimizer.push(getTerserPlugin([
      enableSourceMap,
      uglifyConfig ? uglifyConfig.config : {}
    ]))
  }

  if (config.framework === FRAMEWORK_MAP.REACT || config.framework === FRAMEWORK_MAP.NERV) {
    alias['@tarojs/components$'] = '@tarojs/components/dist-h5/react'
  }

  chain.merge({
    mode,
    devtool: getDevtool({ enableSourceMap, sourceMapType }),
    entry,
    output: getOutput(appPath, [{
      outputRoot,
      publicPath: addTrailingSlash(publicPath),
      chunkDirectory
    }, output]),
    resolve: { alias },
    module: getModule(appPath, {
      designWidth,
      deviceRatio,
      enableExtract,
      enableSourceMap,

      styleLoaderOption,
      cssLoaderOption,
      lessLoaderOption,
      sassLoaderOption,
      stylusLoaderOption,
      fontUrlLoaderOption,
      imageUrlLoaderOption,
      mediaUrlLoaderOption,
      esnextModules,

      postcss,
      staticDirectory
    }),
    plugin,
    optimization: {
      minimizer,
      splitChunks: {
        name: false
      }
    }
  })

  switch (config.framework) {
    case FRAMEWORK_MAP.VUE:
      customVueChain(chain, {
        styleLoaderOption
      })
      break
    case FRAMEWORK_MAP.VUE3:
      customVue3Chain(chain, {
        styleLoaderOption
      })
      break
    default:
  }

  return chain
}
