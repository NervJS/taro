import { type PluginArgs, createBundlerPlugin } from '@tarojs/runner-utils/bundler/config/BundlerPlugin'
import webpack from 'webpack'

import { TaroWebpackBarPlugin } from '../plugins/WebpackBarPlugin'

export type { PluginArgs }

export default class WebpackPlugin extends createBundlerPlugin({
  bundler: webpack,
  loadModule: id => require(id),
  webpackBarPluginClass: TaroWebpackBarPlugin
}) {}
