import webpack from 'webpack'

import { HarmonyCombination } from './webpack/HarmonyCombination'

import type { Stats } from 'webpack'
import type { IHarmonyBuildConfig } from './utils/types'

export default async function build (appPath: string, rawConfig: IHarmonyBuildConfig): Promise<Stats> {
  const combination = new HarmonyCombination(appPath, rawConfig)
  await combination.make()

  // TODO Harmony 端暂不支持依赖预编译
  // const { enableSourceMap, entry = {}, runtimePath } = combination.config
  // const prebundle = new Prebundle({
  //   appPath,
  //   sourceRoot: combination.sourceRoot,
  //   chain: combination.chain,
  //   enableSourceMap,
  //   entry,
  //   isWatch: combination.config.isWatch,
  //   runtimePath,
  //   alias: combination.config.alias,
  //   defineConstants: combination.config.defineConstants,
  // })
  // try {
  //   await prebundle.run(combination.getPrebundleOptions())
  // } catch (error) {
  //   console.error(error)
  //   console.warn(chalk.yellow('依赖预编译失败，已经为您跳过预编译步骤，但是编译速度可能会受到影响。'))
  // }

  const webpackConfig = combination.chain.toConfig()
  const config = combination.config

  return new Promise<Stats>((resolve, reject) => {
    const compiler = webpack(webpackConfig)

    const onFinish = function (error: Error | null, stats: Stats | null) {
      if (typeof config.onBuildFinish !== 'function') return

      config.onBuildFinish({
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

      onFinish(null, stats)
      resolve(stats)
    }

    if (config.isWatch) {
      compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
      }, callback)
    } else {
      compiler.run((error: Error, stats: Stats) => {
        compiler.close(err => callback(error || err, stats))
      })
    }
  })
}
