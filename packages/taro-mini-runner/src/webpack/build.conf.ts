import * as path from 'path'

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
  getEntry,
} from './chain'
import getBaseConf from './base.conf'
import { BUILD_TYPES, PARSE_AST_TYPE, MINI_APP_FILES } from '../utils/constants'
import { Targets } from '../plugins/MiniPlugin'

const emptyObj = {}

export default (appPath: string, mode, config: Partial<IBuildConfig>): any => {
  const chain = getBaseConf(appPath)
  const {
    buildAdapter = BUILD_TYPES.WEAPP,
    alias = emptyObj,
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
    compile = emptyObj,

    postcss = emptyObj,
    nodeModulesPath,
    quickappJSON,

    babel,
    csso,
    uglify,
    commonChunks,
    addChunkPages
  } = config

  let { copy } = config

  const plugin: any = {}
  const minimizer: any[] = []
  const sourceDir = path.join(appPath, sourceRoot)
  const outputDir = path.join(appPath, outputRoot)
  if (config.isBuildPlugin) {
    const patterns = copy ? copy.patterns : []
    patterns.push({
      from: path.join(sourceRoot, 'plugin', 'doc'),
      to: path.join(outputRoot, 'doc')
    })
    patterns.push({
      from: path.join(sourceRoot, 'plugin', 'plugin.json'),
      to: path.join(outputRoot, 'plugin', 'plugin.json')
    })
    copy = Object.assign({}, copy, { patterns })
  }
  if (copy) {
    plugin.copyWebpackPlugin = getCopyWebpackPlugin({ copy, appPath })
  }
  const constantsReplaceList = mergeOption([processEnvOption(env), defineConstants])
  const entryRes = getEntry({
    sourceDir,
    entry,
    isBuildPlugin: config.isBuildPlugin
  })
  plugin.definePlugin = getDefinePlugin([constantsReplaceList])
  const defaultCommonChunks = !!config.isBuildPlugin
    ? ['plugin/runtime', 'plugin/vendors', 'plugin/taro', 'plugin/common']
    : ['runtime', 'vendors', 'taro', 'common']
  let customCommonChunks = defaultCommonChunks
  if (typeof commonChunks === 'function') {
    customCommonChunks = commonChunks(defaultCommonChunks.concat()) || defaultCommonChunks
  } else if (Array.isArray(commonChunks) && commonChunks.length) {
    customCommonChunks = commonChunks
  }
  plugin.miniPlugin = getMiniPlugin({
    sourceDir,
    outputDir,
    buildAdapter,
    constantsReplaceList,
    nodeModulesPath,
    quickappJSON,
    designWidth,
    pluginConfig: entryRes!.pluginConfig,
    pluginMainEntry: entryRes!.pluginMainEntry,
    isBuildPlugin: !!config.isBuildPlugin,
    commonChunks: customCommonChunks,
    addChunkPages,
    alias
  })

  plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([{
    filename: `[name]${MINI_APP_FILES[buildAdapter].STYLE}`,
    chunkFilename: `[name]${MINI_APP_FILES[buildAdapter].STYLE}`
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
      const cssoConfig: any = csso ? csso.config : {}
      plugin.cssoWebpackPlugin = getCssoWebpackPlugin([cssoConfig])
    }
  }
  const taroBaseReg = new RegExp(`@tarojs[\\/]taro|@tarojs[\\/]${buildAdapter}`)
  chain.merge({
    mode,
    devtool: getDevtool(enableSourceMap),
    watch: mode === 'development',
    entry: entryRes!.entry,
    output: getOutput(appPath, [{
      outputRoot,
      publicPath: '/',
      buildAdapter,
      isBuildPlugin: config.isBuildPlugin
    }, output]),
    target: Targets[buildAdapter],
    resolve: { alias },
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
      compile,
      babel,
      alias,
      nodeModulesPath
    }),
    plugin,
    optimization: {
      minimizer,
      runtimeChunk: {
        name: !!config.isBuildPlugin ? 'plugin/runtime' : 'runtime'
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          common: {
            name: !!config.isBuildPlugin ? 'plugin/common' : 'common',
            minChunks: 2,
            priority: 1
          },
          vendors: {
            name: !!config.isBuildPlugin ? 'plugin/vendors' : 'vendors',
            minChunks: 2,
            test: module => {
              return /[\\/]node_modules[\\/]/.test(module.resource) && module.miniType !== PARSE_AST_TYPE.COMPONENT
            },
            priority: 10
          },
          taro: {
            name: !!config.isBuildPlugin ? 'plugin/taro' : 'taro',
            test: module => {
              return taroBaseReg.test(module.context)
            },
            priority: 100
          }
        }
      }
    }
  })
  return chain
}
