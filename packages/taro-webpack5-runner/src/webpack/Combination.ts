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

import { META_TYPE, recursiveMerge, SCRIPT_EXT } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isFunction, isObject } from '@tarojs/shared'
import path from 'path'
import webpack from 'webpack'

import { componentConfig } from '../template/component'

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

  constructor (appPath: string, config: T) {
    this.appPath = appPath
    this.rawConfig = config
    this.sourceRoot = config.sourceRoot || 'src'
    this.outputRoot = config.outputRoot || 'dist'
    this.sourceDir = path.resolve(appPath, this.sourceRoot)
    this.outputDir = path.resolve(appPath, this.outputRoot)
    this.enableSourceMap = config.enableSourceMap ?? config.isWatch ?? process.env.NODE_ENV !== 'production'
  }

  async make () {
    await this.pre(this.rawConfig)
    this.process(this.config, this.appPath)
    await this.post(this.config, this.chain)
  }

  process (_config: T, _appPath: string) {}

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
    const include: string[] = ['@tarojs/taro', '@tarojs/runtime']
    const exclude: string[] = []
    if (process.env.TARO_ENV === 'h5') {
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
