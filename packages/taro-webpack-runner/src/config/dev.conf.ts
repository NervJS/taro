import * as path from 'path';

import { addLeadingSlash, addTrailingSlash, appPath } from '../util';
import {
  getDefinePlugin,
  getDevtool,
  getEntry,
  getHotModuleReplacementPlugin,
  getHtmlWebpackPlugin,
  getMiniCssExtractPlugin,
  getModule,
  getOutput,
  processEnvOption
} from '../util/chain';
import { BuildConfig } from '../util/types';
import getBaseChain from './base.conf';

const emptyObj = {}

export default function (config: Partial<BuildConfig>): any {
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
    esnextModules = [],

    module = {
      postcss: emptyObj
    },
    plugins
  } = config

  const plugin = {} as any

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
  plugin.hotModuleReplacementPlugin = getHotModuleReplacementPlugin()

  const mode = 'development'

  chain.merge({
    mode,
    devtool: getDevtool([enableSourceMap]),
    entry: getEntry(entry),
    output: getOutput([{
      outputRoot,
      publicPath: addLeadingSlash(addTrailingSlash(publicPath)),
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
    optimization: {
      noEmitOnErrors: true
    }
  })

  return chain
}
