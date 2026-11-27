import { REG_STYLE } from '@tarojs/helper'

import { normalizeCopyPatterns } from '../utils'

import type { ICopyOptions } from '@tarojs/taro/types/compile'

export type PluginArgs = Record<string, any>[]
export type PluginDefinition = { plugin: any, args: PluginArgs }

export interface IBundlerPluginOptions {
  bundler?: any
  loadModule?: (id: string) => any
  webpackBarPluginClass?: any
}

export function createBundlerPlugin ({
  bundler,
  loadModule = id => require(id),
  webpackBarPluginClass
}: IBundlerPluginOptions = {}) {
  const getPlugin = (plugin, args: PluginArgs = []) => ({
    plugin,
    args
  })

  return class {
    static getPlugin = getPlugin

    static getCopyWebpackPlugin = (appPath: string, copy: ICopyOptions) => {
      /** @doc https://webpack.js.org/plugins/copy-webpack-plugin */
      const CopyWebpackPlugin = loadModule('copy-webpack-plugin')
      const patterns = normalizeCopyPatterns(appPath, copy)
      const args = { patterns }
      return getPlugin(CopyWebpackPlugin, [args])
    }

    static getProviderPlugin = (args: Record<string, string | string[]>) => {
      return getPlugin(bundler.ProvidePlugin, [args])
    }

    static getDefinePlugin = (definitionsList: Record<string, any>[]) => {
      const definitions = Object.assign({}, ...definitionsList)
      return getPlugin(bundler.DefinePlugin, [definitions])
    }

    static getMiniCssExtractPlugin = (args: Record<string, any>) => {
      const MiniCssExtractPlugin = loadModule('mini-css-extract-plugin')
      return getPlugin(MiniCssExtractPlugin, [args])
    }

    static getTerserPlugin = (terserOptions) => {
      const TerserPlugin = loadModule('terser-webpack-plugin')
      return getPlugin(TerserPlugin, [{
        parallel: true,
        terserOptions
      }])
    }

    static getESBuildMinifyPlugin = (esbuildMinifyOptions) => {
      const ESBuildMinifyPlugin = loadModule('esbuild-loader').EsbuildPlugin
      return getPlugin(ESBuildMinifyPlugin, [esbuildMinifyOptions])
    }

    static getCssMinimizerPlugin = (minimizer: 'esbuild' | 'lightningcss' | 'csso', minimizerOptions: Record<string, any>) => {
      const CssMinimizerPlugin = loadModule('css-minimizer-webpack-plugin')
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
      return getPlugin(CssMinimizerPlugin, [options])
    }

    static getWebpackBarPlugin = (webpackBarOptions = {}) => {
      return getPlugin(webpackBarPluginClass, [webpackBarOptions])
    }
  }
}

export class BundlerPlugin extends createBundlerPlugin() {}
