import { META_TYPE, recursiveMerge } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isFunction, isObject } from '@tarojs/shared'
import path from 'path'
import webpack from 'webpack'
import Chain from 'webpack-chain'

import { componentConfig } from '../template/component'
import type { CommonBuildConfig, H5BuildConfig, MiniBuildConfig } from '../utils/types'
import { PluginArgs } from './WebpackPlugin'

type ICompiler = Exclude<CommonBuildConfig['compiler'], string | undefined>
type IPrebundle = ICompiler['prebundle']

export class Combination<T extends MiniBuildConfig | H5BuildConfig = CommonBuildConfig> {
  appPath: string
  config: T
  chain: Chain
  enableSourceMap: boolean
  sourceRoot: string
  outputRoot: string
  sourceDir: string
  outputDir: string
  rawConfig: T

  prebundleOptions?: IPrebundle

  constructor (appPath: string, config: T) {
    this.appPath = appPath
    this.rawConfig = config
    this.sourceRoot = config.sourceRoot || 'src'
    this.outputRoot = config.outputRoot || 'dist'
    this.sourceDir = path.join(appPath, this.sourceRoot)
    this.outputDir = path.join(appPath, this.outputRoot)
    this.enableSourceMap = process.env.NODE_ENV !== 'production'
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

  addPlugin (name: string, plugin: any, ...args: PluginArgs) {
    this.chain.plugin(name).use(plugin, args)
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

  getDevtool (sourceMapType: string) {
    /** @docs https://webpack.js.org/configuration/devtool/ */
    return this.enableSourceMap && sourceMapType
  }

  getPrebundleOptions () {
    if (this.prebundleOptions) return this.prebundleOptions

    const defaultOptions: IPrebundle = {
      enable: process.env.NODE_ENV !== 'production', // 因为使用了 esbuild 单独打包依赖，会使项目体积略微变大，所以生产模式下默认不开启
      timings: false,
      force: false,
      include: [],
      exclude: [],
      esbuild: {}
    }

    if (isObject<ICompiler>(this.config.compiler)) {
      this.prebundleOptions = recursiveMerge({}, defaultOptions, this.config.compiler.prebundle)
    }

    return this.prebundleOptions as IPrebundle
  }
}
