import * as path from 'path'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import { WebpackPlugin } from './WebpackPlugin'
import H5Plugin from '../plugins/H5Plugin'

import type { H5Combination } from './H5Combination'
import type { PluginArgs } from './WebpackPlugin'

export class H5WebpackPlugin {
  combination: H5Combination

  constructor (combination: H5Combination) {
    this.combination = combination
  }

  getPlugins () {
    const plugins: Record<string, { plugin: any, args: PluginArgs }> = {
      definePlugin: this.getDefinePlugin(),
      htmlWebpackPlugin: this.getHtmlWebpackPlugin(),
      mainPlugin: this.getH5Plugin()
    }

    const miniCssExtractPlugin = this.getMiniCssExtractPlugin()
    if (miniCssExtractPlugin) plugins.miniCssExtractPlugin = miniCssExtractPlugin

    const copyWebpackPlugin = this.getCopyWebpackPlugin()
    if (copyWebpackPlugin) plugins.copyWebpackPlugin = copyWebpackPlugin

    const cssoWebpackPlugin = this.getCssoWebpackPlugin()
    if (cssoWebpackPlugin) plugins.cssoWebpackPlugin = cssoWebpackPlugin

    return plugins
  }

  getDefinePlugin () {
    const {
      env = {},
      defineConstants = {}
    } = this.combination.config

    const envConstants = Object.keys(env).reduce((target, key) => {
      target[`process.env.${key}`] = env[key]
      return target
    }, {})

    return WebpackPlugin.getDefinePlugin([envConstants, defineConstants])
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
      enableExtract = process.env.NODE_ENV === 'production',
      miniCssExtractPluginOption = {}
    } = this.combination.config
    if (!enableExtract) return

    const args = Object.assign({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }, miniCssExtractPluginOption)
    return WebpackPlugin.getMiniCssExtractPlugin(args)
  }

  getCssoWebpackPlugin () {
    const { mode, csso } = this.combination.config
    const isCssoEnabled = !(csso?.enable === false)
    const defaultOption = {
      mergeRules: false,
      mergeIdents: false,
      reduceIdents: false,
      discardUnused: false,
      minifySelectors: false
    }
    let cssoWebpackPlugin

    if (mode === 'production' && isCssoEnabled) {
      const cssoConfig = Object.assign(defaultOption, csso?.config)
      cssoWebpackPlugin = WebpackPlugin.getCssoWebpackPlugin([cssoConfig])
    }

    return cssoWebpackPlugin
  }

  getHtmlWebpackPlugin () {
    const args = {
      filename: 'index.html',
      template: path.join(this.combination.sourceDir, 'index.html')
    }
    return WebpackPlugin.getPlugin(HtmlWebpackPlugin, [args])
  }

  getH5Plugin () {
    const {
      sourceDir,
      outputDir,
      config
    } = this.combination
    const {
      entryFileName = 'app',
      router = {},
      useHtmlComponents = false,
      designWidth = 750,
      deviceRatio
    } = config
    const options = {
      sourceDir,
      outputDir,
      framework: config.framework,
      entryFileName,
      routerConfig: router,
      useHtmlComponents,
      designWidth,
      deviceRatio
    }

    return WebpackPlugin.getPlugin(H5Plugin, [options])
  }
}
