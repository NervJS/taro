import path from 'node:path'

import { META_TYPE, SCRIPT_EXT } from '@tarojs/helper'
import { isFunction, isWebPlatform } from '@tarojs/shared'

import { getSassLoaderOption } from '../../scss'

import type { IComponentConfig, IModifyChainData } from '@tarojs/taro/types/compile/hooks'
import type { CommonBuildConfig } from '../types'

export class BaseCombination<T extends CommonBuildConfig<any> = CommonBuildConfig<any>, TChain = any> {
  appPath: string
  config: T
  chain: TChain
  enableSourceMap: boolean
  sourceRoot: string
  outputRoot: string
  sourceDir: string
  outputDir: string
  rawConfig: T

  isWeb = isWebPlatform()

  /** special mode */
  // 将组件打包为原生模块
  isBuildNativeComp = false
  // 正常打包页面的同时，把组件也打包成独立的原生模块
  newBlended = false

  protected bundler: any
  protected componentConfig: IComponentConfig

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
    const mode = (['production', 'development', 'none'].find(e => e === preMode) ||
      (!rawConfig.isWatch || process.env.NODE_ENV === 'production' ? 'production' : 'development')) as T['mode']
    /** process config.sass options */
    const sassLoaderOption = await getSassLoaderOption(rawConfig)
    this.config = {
      ...rawConfig,
      sassLoaderOption,
      mode,
      frameworkExts: rawConfig.frameworkExts || SCRIPT_EXT
    }
  }

  async post (config: T, chain: TChain) {
    const { modifyWebpackChain, webpackChain, onWebpackChainReady } = config as Record<string, any>
    const data: IModifyChainData = {
      componentConfig: this.componentConfig
    }
    if (isFunction(modifyWebpackChain)) {
      await modifyWebpackChain(chain as any, this.bundler, data)
    }
    if (isFunction(webpackChain)) {
      webpackChain(chain as any, this.bundler, META_TYPE)
    }
    if (isFunction(onWebpackChainReady)) {
      onWebpackChainReady(chain as any)
    }
  }

  getDevtool (sourceMapType: string): any {
    /** @docs https://webpack.js.org/configuration/devtool/ */
    return this.enableSourceMap && sourceMapType
  }
}
