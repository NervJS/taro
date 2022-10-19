import { chalk, recursiveMerge } from '@tarojs/helper'
import { IPostcssOption } from '@tarojs/taro/types/compile'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

import H5Plugin from '../plugins/H5Plugin'
import WebpackPlugin from './WebpackPlugin'

import type { H5Combination } from './H5Combination'
import type { PluginArgs } from './WebpackPlugin'

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

    env.SUPPORT_DINGTALK_NAVIGATE = env.SUPPORT_DINGTALK_NAVIGATE || '"disabled"'
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

  getHtmlWebpackPlugin (entry = '', chunks: string[] = []) {
    const config = this.combination.config || {}
    const options = this.pxtransformOption?.config || {}
    const max = options?.maxRootSize ?? 40
    const min = options?.minRootSize ?? 20
    const baseFontSize = options?.baseFontSize || (min > 1 ? min : 20)
    const designWidth = (input => typeof options.designWidth === 'function'
      ? options.designWidth(input)
      : options.designWidth)(baseFontSize)
    const rootValue = baseFontSize / options.deviceRatio[designWidth] * 2
    const htmlScript = `!function(n){function f(){var e=n.document.documentElement,w=e.getBoundingClientRect().width,x=${rootValue}*w/${designWidth};e.style.fontSize=x>=${max}?"${max}px":x<=${min}?"${min}px":x+"px"}n.addEventListener("resize",(function(){f()})),f()}(window);`
    const args: Record<string, string | string []> = {
      filename: `${entry || 'index'}.html`,
      template: path.join(this.combination.sourceDir, 'index.html'),
      script: htmlScript
    }
    if (entry && entry !== 'index') {
      args.chunks = [...chunks, entry]
    }
    const htmlPluginOption = config.htmlPluginOption ?? {}
    if (config.mode !== 'production' && Object.hasOwnProperty.call(htmlPluginOption, 'script')) {
      console.warn(
        chalk.yellowBright('配置文件覆盖 htmlPluginOption.script 参数会导致 pxtransform 脚本失效，请慎重使用！')
      )
    }
    return WebpackPlugin.getPlugin(HtmlWebpackPlugin, [recursiveMerge(args, htmlPluginOption)])
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
      useHtmlComponents = false
    } = config
    const pxTransformConfig = this.pxtransformOption?.config || {}
    const prebundleOptions = this.combination.getPrebundleOptions()
    const options = {
      appPath,
      sourceDir,
      outputDir,
      framework: config.framework,
      frameworkExts: config.frameworkExts,
      entryFileName,
      routerConfig: router,
      useHtmlComponents,
      pxTransformConfig,
      prebundle: prebundleOptions.enable
    }

    return WebpackPlugin.getPlugin(H5Plugin, [options])
  }
}
