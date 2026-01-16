import path from 'node:path'

import { REG_STYLE } from '@tarojs/helper'
import webpack from 'webpack'

import { TaroWebpackBarPlugin } from '../plugins/WebpackBarPlugin'

import type { ICopyOptions } from '@tarojs/taro/types/compile'

export type PluginArgs = Record<string, any>[]

export default class WebpackPlugin {
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
    return WebpackPlugin.getPlugin(webpack.ProvidePlugin, [args])
  }

  static getDefinePlugin (definitionsList: Record<string, string>[]) {
    const definitions = Object.assign({}, ...definitionsList)
    return WebpackPlugin.getPlugin(webpack.DefinePlugin, [definitions])
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
    const ESBuildMinifyPlugin = require('esbuild-loader').EsbuildPlugin
    return WebpackPlugin.getPlugin(ESBuildMinifyPlugin, [esbuildMinifyOptions])
  }

  static getCssMinimizerPlugin (minimizer: 'esbuild' | 'lightningcss' | 'csso', minimizerOptions: Record<string, any>) {
    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
    let minify = CssMinimizerPlugin.cssnanoMinify
    if (minimizer === 'esbuild') {
      minify = CssMinimizerPlugin.esbuildMinify
    } else if (minimizer === 'lightningcss') {
      minify = CssMinimizerPlugin.lightningCssMinify
    }
    const options = {
      test: REG_STYLE,
      parallel: true,
      minify,
      minimizerOptions: {
        preset: [
          'default',
          minimizerOptions
        ]
      }
    }
    return WebpackPlugin.getPlugin(CssMinimizerPlugin, [options])
  }

  static getWebpackBarPlugin (webpackBarOptions = {}) {
    return WebpackPlugin.getPlugin(TaroWebpackBarPlugin, [webpackBarOptions])
  }
}
