import { BaseH5PluginConfig } from '@tarojs/runner-utils/bundler/config/H5PluginConfig'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import H5Plugin from '../plugins/H5Plugin'
import WebpackPlugin from './WebpackPlugin'

import type { H5Combination } from './H5Combination'

export class H5WebpackPlugin extends BaseH5PluginConfig<H5Combination> {
  protected getPluginHelper () {
    return WebpackPlugin
  }

  protected getHtmlWebpackPluginClass () {
    return HtmlWebpackPlugin
  }

  protected getMainPluginClass () {
    return H5Plugin
  }
}
