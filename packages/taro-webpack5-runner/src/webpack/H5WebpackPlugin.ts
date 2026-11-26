import path from 'node:path'

import { fs } from '@tarojs/helper'
import { getH5DefineConstants, getH5HtmlPluginArgs } from '@tarojs/runner-utils'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import H5Plugin from '../plugins/H5Plugin'
import WebpackPlugin from './WebpackPlugin'

import type { IPostcssOption } from '@tarojs/taro/types/compile'
import type { H5Combination } from './H5Combination'
import type { PluginArgs } from './WebpackPlugin'

export class H5WebpackPlugin {
  combination: H5Combination
  pages?: string[]
  pxtransformOption?: IPostcssOption<'h5'>['pxtransform']

  constructor (combination: H5Combination) {
    this.combination = combination
  }

  getPlugins () {
    const plugins: Record<string, { plugin: any, args: PluginArgs }> = {
      definePlugin: this.getDefinePlugin(),
      mainPlugin: this.getMainPlugin()
    }
    const template = path.join(this.combination.sourceDir, 'index.html')
    if (fs.existsSync(template)) {
      const pages = this.pages || []
      if (pages.length > 0) {
        // NOTE: multi router
        pages.forEach(page => {
          plugins[page] = this.getHtmlWebpackPlugin(template, page)
        })
      } else {
        plugins.htmlWebpackPlugin = this.getHtmlWebpackPlugin(template)
      }
    }

    const miniCssExtractPlugin = this.getMiniCssExtractPlugin()
    if (miniCssExtractPlugin) plugins.miniCssExtractPlugin = miniCssExtractPlugin

    const copyWebpackPlugin = this.getCopyWebpackPlugin()
    if (copyWebpackPlugin) plugins.copyWebpackPlugin = copyWebpackPlugin

    return plugins
  }

  getDefinePlugin () {
    return WebpackPlugin.getDefinePlugin(getH5DefineConstants(this.combination.config))
  }

  getCopyWebpackPlugin () {
    const { appPath, config } = this.combination
    const { copy } = config

    if (copy?.patterns.length) {
      return WebpackPlugin.getCopyWebpackPlugin(appPath, copy)
    }
  }

  getMiniCssExtractPlugin () {
    const {
      mode,
      enableExtract = mode === 'production',
      miniCssExtractPluginOption = {}
    } = this.combination.config
    if (!enableExtract) return

    const args = Object.assign({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }, miniCssExtractPluginOption)
    return WebpackPlugin.getMiniCssExtractPlugin(args)
  }

  getHtmlWebpackPlugin (template, entry = '', chunks: string[] = []) {
    const config = this.combination.config || {}
    const options = this.pxtransformOption?.config || {}
    const args = getH5HtmlPluginArgs(template, entry, chunks, config, options)
    return WebpackPlugin.getPlugin(HtmlWebpackPlugin, [args])
  }

  getMainPlugin () {
    const {
      appPath,
      sourceDir,
      config
    } = this.combination
    const {
      entryFileName = 'app',
      router = {}
    } = config
    const pxTransformConfig = this.pxtransformOption?.config || {}
    const prebundleOptions = this.combination.getPrebundleOptions()
    const options = {
      /** paths */
      appPath,
      sourceDir,
      entryFileName,
      /** config & message */
      framework: config.framework,
      frameworkExts: config.frameworkExts,
      routerConfig: router,
      runtimePath: config.runtimePath,
      pxTransformConfig,
      alias: config.alias,
      defineConstants: config.defineConstants,
      /** building mode */
      prebundle: prebundleOptions.enable,
      isBuildNativeComp: this.combination.isBuildNativeComp,
      noInjectGlobalStyle: this.combination.noInjectGlobalStyle,
      /** hooks & methods */
      modifyAppConfig: config.modifyAppConfig,
      onCompilerMake: config.onCompilerMake,
      onParseCreateElement: config.onParseCreateElement,
    }

    return WebpackPlugin.getPlugin(H5Plugin, [options])
  }
}
