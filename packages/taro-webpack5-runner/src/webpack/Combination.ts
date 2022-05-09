import { META_TYPE } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isFunction } from '@tarojs/shared'
import path from 'path'
import webpack from 'webpack'
import Chain from 'webpack-chain'

import { componentConfig } from '../template/component'
import type { H5BuildConfig, MiniBuildConfig } from '../utils/types'

export class Combination<T extends MiniBuildConfig | H5BuildConfig> {
  appPath: string
  sourceRoot: string
  outputRoot: string
  sourceDir: string
  outputDir: string
  rawConfig: T
  config: T
  chain: Chain

  constructor (appPath: string, config: T) {
    this.appPath = appPath
    this.rawConfig = config
    this.sourceRoot = config.sourceRoot || 'src'
    this.outputRoot = config.outputRoot || 'dist'
    this.sourceDir = path.join(appPath, this.sourceRoot)
    this.outputDir = path.join(appPath, this.outputRoot)
  }

  async getWebpackConfig () {
    await this.make()
    return this.chain.toConfig()
  }

  async make () {
    await this.pre(this.rawConfig)
    this.process(this.config, this.appPath)
    await this.post(this.config, this.chain)
  }

  process (_config: T, _appPath: string) {}

  async pre (rawConfig: T) {
    /** process config.sass options */
    const sassLoaderOption = await getSassLoaderOption(rawConfig)
    this.config = {
      ...rawConfig,
      sassLoaderOption,
      mode: process.env.NODE_ENV || rawConfig.mode
    }
  }

  async post (config: T, chain: Chain) {
    const { modifyWebpackChain, webpackChain, onWebpackChainReady } = config
    if (isFunction(modifyWebpackChain)) {
      await modifyWebpackChain(chain, webpack, { componentConfig })
    }
    if (isFunction(webpackChain)) {
      webpackChain(chain, webpack, META_TYPE)
    }
    if (isFunction(onWebpackChainReady)) {
      onWebpackChainReady(chain)
    }
  }

  getDevtool (enableSourceMap: boolean, sourceMapType: string) {
    /** @docs https://webpack.js.org/configuration/devtool/ */
    return enableSourceMap && sourceMapType
  }
}
