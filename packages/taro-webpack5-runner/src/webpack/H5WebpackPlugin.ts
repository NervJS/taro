import { IPostcssOption } from '@tarojs/taro/types/compile'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

import H5Plugin from '../plugins/H5Plugin'
import type { H5Combination } from './H5Combination'
import type { PluginArgs } from './WebpackPlugin'
import WebpackPlugin from './WebpackPlugin'

export class H5WebpackPlugin {
  combination: H5Combination
  pages?: string[]
  pxtransformOption?: IPostcssOption['pxtransform']

  constructor (combination: H5Combination) {
    this.combination = combination
  }

  getPlugins () {
    const plugins: Record<string, { plugin: any, args: PluginArgs }> = {
      definePlugin: this.getDefinePlugin(),
      mainPlugin: this.getH5Plugin()
    }
    const pages = this.pages || []
    if (pages.length > 0) {
      // NOTE: multi router
      pages.forEach(page => {
        plugins[page] = this.getHtmlWebpackPlugin(page)
      })
    } else {
      plugins.htmlWebpackPlugin = this.getHtmlWebpackPlugin()
    }

    const miniCssExtractPlugin = this.getMiniCssExtractPlugin()
    if (miniCssExtractPlugin) plugins.miniCssExtractPlugin = miniCssExtractPlugin

    const copyWebpackPlugin = this.getCopyWebpackPlugin()
    if (copyWebpackPlugin) plugins.copyWebpackPlugin = copyWebpackPlugin

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

  getHtmlWebpackPlugin (entry = '', chunks: string[] = []) {
    const options = this.pxtransformOption?.config || {}
    const max = options?.max ?? 40
    const min = options?.min ?? 20
    const designWidth = input => typeof options.designWidth === 'function'
      ? options.designWidth(input)
      : options.designWidth
    const deviceRatio = options.deviceRatio[designWidth(min)]
    const htmlScript = `!function(n){function f(){var e=n.document.documentElement,w=e.getBoundingClientRect().width,x=w/16/${deviceRatio};e.style.fontSize=x>=${max}?"${max}px":x<=${min}?"${min}px":x+"px"},n.addEventListener("resize",(function(){f()})),f()}(window);`
    const args: Record<string, string | string []> = {
      filename: `${entry || 'index'}.html`,
      template: path.join(this.combination.sourceDir, 'index.html'),
      script: htmlScript
    }
    if (entry && entry !== 'index') {
      args.chunks = [...chunks, entry]
    }
    return WebpackPlugin.getPlugin(HtmlWebpackPlugin, [args])
  }

  getH5Plugin () {
    const {
      appPath,
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
    const prebundleOptions = this.combination.getPrebundleOptions()
    const options = {
      appPath,
      sourceDir,
      outputDir,
      framework: config.framework,
      entryFileName,
      routerConfig: router,
      useHtmlComponents,
      designWidth,
      deviceRatio,
      prebundle: prebundleOptions.enable
    }

    return WebpackPlugin.getPlugin(H5Plugin, [options])
  }
}
