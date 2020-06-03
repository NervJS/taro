import * as path from 'path'
// import { ProvidePlugin } from 'webpack'
import { IBuildConfig } from '../utils/types'
import {
  getCopyWebpackPlugin,
  getDefinePlugin,
  getProvidePlugin,
  // getStatsPlugin,
  processEnvOption,
  getCssoWebpackPlugin,
  getDevtool,
  getOutput,
  getModule,
  mergeOption,
  getRNPlugin,
  getMiniCssExtractPlugin,
  getEntry
} from './chain'
import { BUILD_TYPES } from '../utils/constants'
import { Targets } from '../plugins/RNPlugin'

const nodeExternals = require('webpack-node-externals')

const emptyObj = {}

export default (appPath: string, mode, config: Partial<IBuildConfig>, chain: any): any => {
  const {
    buildAdapter = BUILD_TYPES.WEAPP,
    alias = emptyObj,
    entry = emptyObj,
    output = emptyObj,
    outputRoot = 'rn_temp',
    sourceRoot = 'src',

    designWidth = 750,
    deviceRatio,
    enableSourceMap = false,

    defineConstants = emptyObj,
    env = emptyObj,
    cssLoaderOption = emptyObj,
    mediaUrlLoaderOption = emptyObj,
    fontUrlLoaderOption = emptyObj,
    imageUrlLoaderOption = emptyObj,
    miniCssExtractPluginOption = emptyObj,
    compile = emptyObj, // 编译过程的相关配置

    postcss = emptyObj,
    nodeModulesPath,
    quickappJSON,

    babel,
    csso,
    commonChunks,
    // @ts-ignore
    addChunkPages,
    appJson,

    // custome plugin hooks
    modifyBuildAssets,
    modifyBuildTempFileContent
  } = config

  let {copy} = config

  const plugin: any = {}
  const minimizer: any[] = []
  const sourceDir = path.join(appPath, sourceRoot)
  const outputDir = path.join(appPath, outputRoot)
  if (copy) {
    plugin.copyWebpackPlugin = getCopyWebpackPlugin({copy, appPath})
  }
  const constantsReplaceList = mergeOption([processEnvOption(env), defineConstants, {'process.env.TARO_ENV': `"${buildAdapter}"`}])
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

  // TODO providePlugin 验证
  plugin.providePlugin = getProvidePlugin({
    'Taro': '@tarojs/taro-rn'
  })

  // statsPlugin
  // plugin.statsPlugin = getStatsPlugin('stats.json', {
  //   chunkModules: true
  // })

  // TODO RNPlugin
  plugin.RNPlugin = getRNPlugin({
    sourceDir,
    outputDir,
    buildAdapter,
    constantsReplaceList,
    nodeModulesPath,
    quickappJSON,
    designWidth,
    pluginConfig: entryRes!.pluginConfig,
    isBuildPlugin: !!config.isBuildPlugin,
    commonChunks: customCommonChunks,
    addChunkPages,
    alias,
    appJson,

    modifyBuildAssets,
    modifyBuildTempFileContent
  })

  plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([
    {
      filename: `[name].css`,
      chunkFilename: `[name].css`
    }, miniCssExtractPluginOption])

  const isCssoEnabled = !(csso && csso.enable === false)

  // not use
  if (mode === 'production') {
    if (isCssoEnabled) {
      const cssoConfig: any = csso ? csso.config : {}
      plugin.cssoWebpackPlugin = getCssoWebpackPlugin([cssoConfig])
    }
  }
  return {
    mode,
    devtool: getDevtool(enableSourceMap),
    watch: mode === 'development',
    entry: entryRes!.entry,
    output: getOutput(appPath, [
      {
        outputRoot,
        publicPath: '/',
        buildAdapter,
        isBuildPlugin: config.isBuildPlugin
      }, output]),
    target: Targets[buildAdapter],
    externals: [
      // not bundle node_modules
      nodeExternals()
    ],
    resolve: {alias},
    module: getModule(appPath, {
      sourceDir,
      entry: entryRes!.entry,

      buildAdapter,
      constantsReplaceList,
      designWidth,
      deviceRatio,
      enableSourceMap,

      cssLoaderOption,
      fontUrlLoaderOption,
      imageUrlLoaderOption,
      mediaUrlLoaderOption,

      postcss,
      compile,
      babel,
      alias
    }, chain),
    plugin,
    optimization: {
      minimizer,
      // not support node
      // splitChunks: {
      //   chunks: 'all',
      //   cacheGroups: {
      //     common: {
      //       name: 'common',
      //       chunks: 'initial',
      //       priority: 2,
      //       minChunks: 2
      //     }
      //   }
      // }
    }
  }
}
