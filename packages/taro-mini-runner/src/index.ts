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

import { META_TYPE } from '@tarojs/helper'
import { isEmpty } from 'lodash'
import * as webpack from 'webpack'

import { Prerender } from './prerender/prerender'
import { componentConfig } from './template/component'
import { bindDevLogger, bindProdLogger, printBuildError } from './utils/logHelper'
import buildConf from './webpack/build.conf'
import { makeConfig } from './webpack/chain'

import type { Func } from '@tarojs/taro/types/compile'
import type { IBuildConfig } from './utils/types'

const customizeChain = async (chain, modifyWebpackChainFunc: Func, customizeFunc?: Func) => {
  if (modifyWebpackChainFunc instanceof Function) {
    await modifyWebpackChainFunc(chain, webpack, {
      componentConfig
    })
  }
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack, META_TYPE)
  }
}

export default async function build (appPath: string, config: IBuildConfig): Promise<webpack.Stats> {
  const mode = config.mode

  /** process config.sass options */
  const newConfig = await makeConfig(config)

  /** initialized chain */
  const webpackChain = buildConf(appPath, mode, newConfig)

  /** customized chain */
  await customizeChain(webpackChain, newConfig.modifyWebpackChain!, newConfig.webpackChain)

  if (typeof newConfig.onWebpackChainReady === 'function') {
    newConfig.onWebpackChainReady(webpackChain)
  }

  /** webpack config */
  const webpackConfig: webpack.Configuration = webpackChain.toConfig()

  return new Promise<webpack.Stats>((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    const onBuildFinish = newConfig.onBuildFinish
    let prerender: Prerender

    const onFinish = function (error, stats: webpack.Stats | null) {
      if (typeof onBuildFinish !== 'function') return

      onBuildFinish({
        error,
        stats,
        isWatch: newConfig.isWatch
      })
    }

    const callback = async (err: Error, stats: webpack.Stats) => {
      if (err || stats.hasErrors()) {
        const error = err ?? stats.toJson().errors
        printBuildError(error)
        onFinish(error, null)
        return reject(error)
      }

      if (!isEmpty(newConfig.prerender)) {
        prerender = prerender ?? new Prerender(newConfig, webpackConfig, stats, config.template.Adapter)
        await prerender.render()
      }
      onFinish(null, stats)
      resolve(stats)
    }

    if (newConfig.isWatch) {
      bindDevLogger(compiler)
      compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
      }, callback)
    } else {
      bindProdLogger(compiler)
      compiler.run(callback)
    }
  })
}
