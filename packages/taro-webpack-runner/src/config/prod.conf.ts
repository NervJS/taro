import { chalk, fs, recursiveMerge } from '@tarojs/helper'
import { get, mapValues, merge } from 'lodash'
import * as path from 'path'

import { addTrailingSlash, AppHelper, parseHtmlScript } from '../utils'
import {
  getCopyWebpackPlugin,
  getCssoWebpackPlugin,
  getDefinePlugin,
  getDevtool,
  getHtmlWebpackPlugin,
  getMainPlugin,
  getMiniCssExtractPlugin,
  getOutput,
  getTerserPlugin,
  parseModule,
  processEnvOption
} from '../utils/chain'
import { BuildConfig } from '../utils/types'
import getBaseChain from './base.conf'

export default function (appPath: string, config: Partial<BuildConfig>, appHelper: AppHelper): any {
  const chain = getBaseChain(appPath, config)
  const {
    alias = {},
    copy,
    entry = {},
    entryFileName = 'app',
    output = {},
    sourceRoot = '',
    outputRoot = 'dist',
    publicPath = '/',
    staticDirectory = 'static',
    chunkDirectory = 'chunk',
    router = {},

    designWidth = 750,
    deviceRatio,
    enableSourceMap = false,
    sourceMapType,
    enableExtract = true,

    defineConstants = {},
    env = {},
    styleLoaderOption = {},
    cssLoaderOption = {},
    sassLoaderOption = {},
    lessLoaderOption = {},
    stylusLoaderOption = {},
    mediaUrlLoaderOption = {},
    fontUrlLoaderOption = {},
    imageUrlLoaderOption = {},

    miniCssExtractPluginOption = {},
    esnextModules = [],

    compile = {},
    postcss = {},
    htmlPluginOption = {},
    csso,
    uglify,
    terser,

    useDeprecatedAdapterComponent = false
  } = config
  const sourceDir = path.join(appPath, sourceRoot)
  const isMultiRouterMode = get(router, 'mode') === 'multi'

  const { rule, postcssOption } = parseModule(appPath, {
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

    compile,
    postcss,
    sourceDir,
    staticDirectory
  })
  const [, pxtransformOption] = postcssOption.find(([name]) => name === 'postcss-pxtransform') || []

  const plugin: any = {}

  plugin.mainPlugin = getMainPlugin({
    /** paths */
    sourceDir,
    entryFileName,
    /** config & message */
    framework: config.framework,
    frameworkExts: config.frameworkExts,
    routerConfig: router,
    runtimePath: config.runtimePath,
    pxTransformConfig: pxtransformOption?.config || {},
    /** building mode */
    isBuildNativeComp: config.isBuildNativeComp,
    /** hooks & methods */
    onCompilerMake: config.onCompilerMake,
    onParseCreateElement: config.onParseCreateElement,
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

  const htmlScript = parseHtmlScript(pxtransformOption)
  if (process.env.NODE_ENV !== 'production' && htmlScript !== undefined && Object.hasOwnProperty.call(htmlPluginOption, 'script')) {
    console.warn(
      chalk.yellowBright('配置文件覆盖 htmlPluginOption.script 参数会导致 pxtransform 脚本失效，请慎重使用！')
    )
  }

  const template = path.join(sourceDir, 'index.html')
  if (fs.existsSync(template)) {
    if (isMultiRouterMode) {
      delete entry[entryFileName]
      appHelper.pagesConfigList.forEach((page, index) => {
        entry[index] = [page]
      })
      merge(plugin, mapValues(entry, (_filePath, entryName) => {
        return getHtmlWebpackPlugin([recursiveMerge({
          filename: `${entryName}.html`,
          script: htmlScript,
          template,
          chunks: [entryName]
        }, htmlPluginOption)])
      }))
    } else {
      plugin.htmlWebpackPlugin = getHtmlWebpackPlugin([recursiveMerge({
        filename: 'index.html',
        script: htmlScript,
        template,
      }, htmlPluginOption)])
    }
  }
  env.SUPPORT_DINGTALK_NAVIGATE = env.SUPPORT_DINGTALK_NAVIGATE || '"disabled"'
  defineConstants.DEPRECATED_ADAPTER_COMPONENT = JSON.stringify(!!useDeprecatedAdapterComponent)
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

  chain.merge({
    mode,
    devtool: getDevtool({ enableSourceMap, sourceMapType }),
    entry,
    output: getOutput(appPath, [{
      outputRoot,
      publicPath: ['', 'auto'].includes(publicPath) ? publicPath : addTrailingSlash(publicPath),
      chunkDirectory
    }, output]),
    resolve: { alias },
    module: { rule },
    plugin,
    optimization: {
      minimizer,
      splitChunks: {
        name: false,
        chunks: 'initial',
        minSize: 0,
        cacheGroups: {
          default: false,
          common: {
            name: false,
            minChunks: 2,
            priority: 1
          },
          vendors: {
            name: false,
            minChunks: 2,
            test: module => /[\\/]node_modules[\\/]/.test(module.resource),
            priority: 10
          },
          taro: {
            name: false,
            test: module => /@tarojs[\\/][a-z]+/.test(module.context),
            priority: 100
          }
        }
      }
    }
  })

  return chain
}
