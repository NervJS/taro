/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { REG_STYLE } from '@tarojs/helper'
import path from 'path'
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
    const ESBuildMinifyPlugin = require('esbuild-loader').ESBuildMinifyPlugin
    return WebpackPlugin.getPlugin(ESBuildMinifyPlugin, [esbuildMinifyOptions])
  }

  static getCssMinimizerPlugin (minimizer: 'esbuild' | 'parcelCss' | 'csso', minimizerOptions: Record<string, any>) {
    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
    let minify = CssMinimizerPlugin.cssnanoMinify
    if (minimizer === 'esbuild') {
      minify = CssMinimizerPlugin.esbuildMinify
    } else if (minimizer === 'parcelCss') {
      minify = CssMinimizerPlugin.parcelCssMinify
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
