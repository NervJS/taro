import * as path from 'path'
import { get, mapValues, merge } from 'lodash'

import { addLeadingSlash, addTrailingSlash } from '../util'
import {
  getCopyWebpackPlugin,
  getDefinePlugin,
  getDevtool,
  getHotModuleReplacementPlugin,
  getHtmlWebpackPlugin,
  getMiniCssExtractPlugin,
  getModule,
  getOutput,
  processEnvOption
} from '../util/chain'
import { BuildConfig } from '../util/types'

const emptyObj = {}

export default function (appPath: string, config: Partial<BuildConfig>, chain: any): any {
  const {
    alias = emptyObj,
    copy,
    entry = emptyObj,
    output = emptyObj,
    sourceRoot = '',
    outputRoot,
    publicPath = '',
    staticDirectory = 'static',
    chunkDirectory = 'chunk',
    router = emptyObj,

    designWidth = 750,
    deviceRatio,
    enableSourceMap = true,
    sourceMapType,
    enableExtract = false,

    defineConstants = emptyObj,
    env = emptyObj,
    styleLoaderOption = emptyObj,
    cssLoaderOption = emptyObj,
    mediaUrlLoaderOption = emptyObj,
    fontUrlLoaderOption = emptyObj,
    imageUrlLoaderOption = emptyObj,

    miniCssExtractPluginOption = emptyObj,
    esnextModules = [],

    postcss = emptyObj,
    babel
  } = config

  const plugin = {} as any

  const isMultiRouterMode = get(router, 'mode') === 'multi'

  if (enableExtract) {
    plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([{
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }, miniCssExtractPluginOption])
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
  plugin.hotModuleReplacementPlugin = getHotModuleReplacementPlugin()

  const mode = 'development'

  return {
    mode,
    devtool: getDevtool({ enableSourceMap, sourceMapType }),
    entry,
    output: getOutput(appPath, [{
      outputRoot,
      publicPath: addLeadingSlash(addTrailingSlash(publicPath)),
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
      fontUrlLoaderOption,
      imageUrlLoaderOption,
      mediaUrlLoaderOption,
      esnextModules,

      postcss,
      babel,
      staticDirectory
    }, chain),
    plugin,
    optimization: {
      noEmitOnErrors: true
    }
  }
}
