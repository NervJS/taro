import { chalk } from '@tarojs/helper'
import Prebundle from '@tarojs/webpack5-prebundle'
import { isEmpty } from 'lodash'
import webpack from 'webpack'

import { Prerender } from './prerender/prerender'
import { buildSharedRuntime } from './shared-runtime/build-shared-runtime'
import { warnTopLevelImperativeApi } from './shared-runtime/scan-imperative-api'
import { errorHandling } from './utils/webpack'
import { MiniCombination } from './webpack/MiniCombination'

import type { Stats } from 'webpack'
import type { IMiniBuildConfig } from './utils/types'

export default async function build (appPath: string, rawConfig: IMiniBuildConfig): Promise<Stats | void> {
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
    runtimePath,
    isBuildPlugin: combination.isBuildPlugin,
    alias: combination.config.alias,
    defineConstants: combination.config.defineConstants,
    modifyAppConfig: combination.config.modifyAppConfig
  })
  try {
    await prebundle.run(combination.getPrebundleOptions())
  } catch (error) {
    console.error(error)
    console.warn(chalk.yellow('依赖预编译失败，已经为您跳过预编译步骤，但是编译速度可能会受到影响。'))
  }

  const webpackConfig = combination.chain.toConfig()
  const config = combination.config

  return new Promise<Stats | void>((resolve, reject) => {
    if (config.withoutBuild) return

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
      const errorLevel = typeof config.compiler !== 'string' && config.compiler?.errorLevel || 0
      if (err || stats.hasErrors()) {
        const error = err ?? stats.toJson().errors
        onFinish(error, null)
        reject(error)
        errorHandling(errorLevel, stats)
        return
      }

      if (!isEmpty(config.prerender)) {
        prerender = prerender ?? new Prerender(config, webpackConfig, stats, config.template)
        await prerender.render()
      }

      // 共享运行时：主构建成功后产出运行时核到 dist（host=全量核 taro-core；split=同步核+异步子包）
      if (config.sharedRuntime) {
        // split 模式：编译期扫描业务源码顶层命令式 API 同步调用，告警不阻断
        if (config.sharedRuntimeMode === 'split') {
          warnTopLevelImperativeApi(combination.sourceDir)
        }
        try {
          await buildSharedRuntime(combination)
        } catch (e) {
          onFinish(e as Error, null)
          reject(e)
          return
        }
      }

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
