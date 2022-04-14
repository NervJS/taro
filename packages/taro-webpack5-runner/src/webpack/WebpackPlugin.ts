import { ProvidePlugin, DefinePlugin } from 'webpack'
import * as path from 'path'
import { REG_STYLE } from '@tarojs/helper'

import type { ICopyOptions } from '@tarojs/taro/types/compile'

export type PluginArgs = Record<string, any>[]

export class WebpackPlugin {
  static getPlugin (plugin, args: PluginArgs) {
    return {
      plugin,
      args
    }
  }

  static getCopyWebpackPlugin (appPath: string, copy: ICopyOptions) {
    /** @doc https://webpack.js.org/plugins/copy-webpack-plugin */
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    const globalIgnores: string[] = copy.options?.ignore ?? []
    const patterns = copy.patterns.map(({ from, to, ignore = [], ...extra }) => {
      return {
        from,
        to: path.resolve(appPath, to),
        context: appPath,
        globOptions: {
          ignore: ignore.concat(globalIgnores)
        },
        ...extra
      }
    })
    const args = { patterns }
    return WebpackPlugin.getPlugin(CopyWebpackPlugin, [args])
  }

  static getProviderPlugin (args: Record<string, string | string[]>) {
    return WebpackPlugin.getPlugin(ProvidePlugin, [args])
  }

  static getDefinePlugin (definitionsList: Record<string, string>[]) {
    const definitions = Object.assign({}, ...definitionsList)
    return WebpackPlugin.getPlugin(DefinePlugin, [definitions])
  }

  static getMiniCssExtractPlugin (args: Record<string, any>) {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    return WebpackPlugin.getPlugin(MiniCssExtractPlugin, [args])
  }

  static getTerserPlugin (terserOptions) {
    const TerserPlugin = require('terser-webpack-plugin')
    return WebpackPlugin.getPlugin(TerserPlugin, [{
      parallel: true,
      terserOptions
    }])
  }

  static getESBuildMinifyPlugin (esbuildMinifyOptions) {
    const ESBuildMinifyPlugin = require('esbuild-loader').ESBuildMinifyPlugin
    return WebpackPlugin.getPlugin(ESBuildMinifyPlugin, [esbuildMinifyOptions])
  }

  static getCssMinimizerPlugin (minimizer: 'esbuild' | 'parcelCss' | 'csso', minimizerOptions: Record<string, any>) {
    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
    let minify = CssMinimizerPlugin.cssoMinify
    if (minimizer === 'esbuild') {
      minify = CssMinimizerPlugin.esbuildMinify
    } else if (minimizer === 'parcelCss') {
      minify = CssMinimizerPlugin.parcelCssMinify
    }
    const options = {
      test: REG_STYLE,
      parallel: true,
      minify,
      minimizerOptions
    }
    return WebpackPlugin.getPlugin(CssMinimizerPlugin, [options])
  }
}
