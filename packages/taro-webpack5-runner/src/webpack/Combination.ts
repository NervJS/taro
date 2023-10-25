import { META_TYPE, recursiveMerge, SCRIPT_EXT } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isFunction, isObject, isWebPlatform } from '@tarojs/shared'
import path from 'path'
import webpack from 'webpack'

import { componentConfig } from '../utils/component'

import type { IModifyChainData } from '@tarojs/taro/types/compile/hooks'
import type { IPrebundle } from '@tarojs/webpack5-prebundle'
import type Chain from 'webpack-chain'
import type { CommonBuildConfig, H5BuildConfig, MiniBuildConfig } from '../utils/types'

type ICompiler = Exclude<CommonBuildConfig['compiler'], string | undefined>

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

  isWeb = isWebPlatform()

  /** special mode */
  // 将组件打包为原生模块
  isBuildNativeComp = false
  // 正常打包页面的同时，把组件也打包成独立的原生模块
  newBlended = false

  constructor (appPath: string, config: T) {
    this.appPath = appPath
    this.rawConfig = config
    this.sourceRoot = config.sourceRoot || 'src'
    this.outputRoot = config.outputRoot || 'dist'
    this.sourceDir = path.resolve(appPath, this.sourceRoot)
    this.outputDir = path.resolve(appPath, this.outputRoot)
    this.isBuildNativeComp = !!config.isBuildNativeComp
    this.newBlended = !!config.newBlended
    this.enableSourceMap = config.enableSourceMap ?? config.isWatch ?? process.env.NODE_ENV !== 'production'
  }

  async make () {
    await this.pre(this.rawConfig)
    this.process(this.config)
    await this.post(this.config, this.chain)
  }

  process (_config: Partial<T>) {}

  async pre (rawConfig: T) {
    const preMode = rawConfig.mode || process.env.NODE_ENV
    const mode = ['production', 'development', 'none'].find(e => e === preMode)
      || (!rawConfig.isWatch || process.env.NODE_ENV === 'production' ? 'production' : 'development')
    /** process config.sass options */
    const sassLoaderOption = await getSassLoaderOption(rawConfig)
    this.config = {
      ...rawConfig,
      sassLoaderOption,
      mode,
      frameworkExts: rawConfig.frameworkExts || SCRIPT_EXT
    }
  }

  async post (config: T, chain: Chain) {
    const { modifyWebpackChain, webpackChain, onWebpackChainReady } = config
    const data: IModifyChainData = {
      componentConfig
    }
    if (isFunction(modifyWebpackChain)) {
      await modifyWebpackChain(chain, webpack, data)
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
    if (this.isBuildNativeComp) return { enable: false }
    if (this.prebundleOptions) return this.prebundleOptions
    const include: string[] = ['@tarojs/taro', '@tarojs/runtime']
    const exclude: string[] = []
    if (this.isWeb) {
      include.push('@tarojs/router')
    } else {
      // 小程序编译 Host 时需要扫描 @tarojs/components 的 useExports，因此不能被 external
      exclude.push('@tarojs/components')
    }

    const defaultOptions: IPrebundle = {
      enable: this.config.mode !== 'production', // 因为使用了 esbuild 单独打包依赖，会使项目体积略微变大，所以生产模式下默认不开启
      timings: false,
      force: false,
      include,
      exclude,
      esbuild: {}
    }

    if (isObject<ICompiler>(this.config.compiler)) {
      this.prebundleOptions = recursiveMerge({}, defaultOptions, this.config.compiler.prebundle)
    }

    return this.prebundleOptions as IPrebundle
  }
}
