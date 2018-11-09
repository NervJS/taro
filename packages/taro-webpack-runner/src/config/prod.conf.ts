import * as path from 'path';

import { appPath, emptyObj } from '../util';
import {
  getDefinePlugin,
  getEntry,
  getHtmlWebpackPlugin,
  getMiniCssExtractPlugin,
  getOutput,
  getModule,
  processEnvOption,
  getUglifyPlugin,
  getCssoWebpackPlugin,
  getDevtool,
  getDllReferencePlugins,
  getHtmlWebpackIncludeAssetsPlugin
} from '../util/chain';
import { BuildConfig } from '../util/types';
import getBaseChain from './base.conf';

export default function (config: BuildConfig): any {
  const chain = getBaseChain()
  const {
    alias = emptyObj,
    entry = emptyObj,
    output = emptyObj,
    sourceRoot = '',
    outputRoot,
    publicPath,
    staticDirectory = 'static',
    chunkDirectory = 'chunk',
    dllDirectory = 'lib',
    dllEntry = {
      lib: ['nervjs', '@tarojs/taro-h5', '@tarojs/router', '@tarojs/components']
    },

    designWidth = 750,
    deviceRatio,
    enableSourceMap = false,
    enableExtract = true,
    enableDll = true,

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

    module = {
      postcss: emptyObj
    },
    plugins
  } = config

  const plugin: any = {}

  if (enableExtract) {
    plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([{
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }, miniCssExtractPluginOption])
  }

  plugin.htmlWebpackPlugin = getHtmlWebpackPlugin([{
    filename: 'index.html',
    template: path.join(appPath, sourceRoot, 'index.html')
  }])

  plugin.definePlugin = getDefinePlugin([processEnvOption(env), defineConstants])

  const isCssoEnabled = (plugins.csso && plugins.csso.enable === false)
    ? false
    : true

  if (isCssoEnabled) {
    plugin.cssoWebpackPlugin = getCssoWebpackPlugin([plugins.csso ? plugins.csso.config : {}])
  }

  if (enableDll) {
    Object.assign(plugin, getDllReferencePlugins({
      dllDirectory,
      dllEntry,
      outputRoot
    }))
    const dllFiles = Object.keys(dllEntry).map(v => {
      return path.join(dllDirectory, `${v}.dll.js`)
    })
    if (dllFiles.length) {
      plugin.addAssetHtmlWebpackPlugin = getHtmlWebpackIncludeAssetsPlugin({
        append: false,
        assets: dllFiles
      })
    }
  }

  const mode = 'production'

  const minimizer: any[] = []
  const isUglifyEnabled = (plugins.uglify && plugins.uglify.enable === false)
    ? false
    : true

  if (isUglifyEnabled) {
    minimizer.push(getUglifyPlugin([
      enableSourceMap,
      plugins.uglify ? plugins.uglify.config : {}
    ]))
  }

  chain.merge({
    mode,
    devtool: getDevtool(enableSourceMap),
    entry: getEntry(entry),
    output: getOutput([{
      outputRoot,
      publicPath,
      chunkDirectory
    }, output]),
    resolve: { alias },
    module: getModule({
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
  
      module,
      plugins,
      staticDirectory
    }),
    plugin,
    optimization: { minimizer }
  })
  return chain
}
