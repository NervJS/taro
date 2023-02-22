/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

import { chalk } from '@tarojs/helper'
import Prebundle from '@tarojs/webpack5-prebundle'
import { isEmpty } from 'lodash'
import webpack, { Stats } from 'webpack'

import { Prerender } from './prerender/prerender'
import { MiniCombination } from './webpack/MiniCombination'

import type { MiniBuildConfig } from './utils/types'

export default async function build (appPath: string, rawConfig: MiniBuildConfig): Promise<Stats> {
  const combination = new MiniCombination(appPath, rawConfig)
  await combination.make()

  const { enableSourceMap, entry = {}, runtimePath } = combination.config
  const prebundle = new Prebundle({
    appPath,
    sourceRoot: combination.sourceRoot,
    chain: combination.chain,
    enableSourceMap,
    entry,
    isWatch: combination.config.isWatch,
    runtimePath
  })
  try {
    await prebundle.run(combination.getPrebundleOptions())
  } catch (error) {
    console.error(error)
    console.warn(chalk.yellow('依赖预编译失败，已经为您跳过预编译步骤，但是编译速度可能会受到影响。'))
  }

  const webpackConfig = combination.chain.toConfig()
  const config = combination.config

  return new Promise<Stats>((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    const onBuildFinish = config.onBuildFinish
    let prerender: Prerender

    const onFinish = function (error: Error | null, stats: Stats | null) {
      if (typeof onBuildFinish !== 'function') return

      onBuildFinish({
        error,
        stats,
        isWatch: config.isWatch
      })
    }

    const callback = async (err: Error, stats: Stats) => {
      if (err || stats.hasErrors()) {
        const error = err ?? stats.toJson().errors
        onFinish(error, null)
        return reject(error)
      }

      if (!isEmpty(config.prerender)) {
        prerender = prerender ?? new Prerender(config, webpackConfig, stats, config.template)
        await prerender.render()
      }

      // const res = stats.toString({
      //   logging: 'verbose'
      // })
      // console.log('res: ', res)

      onFinish(null, stats)
      resolve(stats)
    }

    if (config.isWatch) {
      compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
      }, callback)
    } else {
      compiler.run((err: Error, stats: Stats) => {
        compiler.close(err2 => callback(err || err2, stats))
      })
    }
  })
}
