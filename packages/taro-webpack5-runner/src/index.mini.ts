import * as webpack from 'webpack'
import { isEmpty } from 'lodash'
import { MiniCombination } from './webpack/MiniCombination'
import { printBuildError, bindProdLogger, bindDevLogger } from './utils/logHelper'
import { Prerender } from './prerender/prerender'
import { preBundle } from './prebundle'

import type { Stats } from 'webpack'
import type { MiniBuildConfig } from './utils/types'

export default async function build (appPath: string, rawConfig: MiniBuildConfig): Promise<Stats> {
  const combination = new MiniCombination(appPath, rawConfig)
  await combination.make()

  await preBundle(combination)

  const webpackConfig = combination.chain.toConfig()
  const config = combination.config

  return new Promise<Stats>((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    const onBuildFinish = config.onBuildFinish
    let prerender: Prerender

    const onFinish = function (error, stats: Stats | null) {
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
        printBuildError(error)
        onFinish(error, null)
        return reject(error)
      }

      if (!isEmpty(config.prerender)) {
        prerender = prerender ?? new Prerender(config, webpackConfig, stats, config.template.Adapter)
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
      bindDevLogger(compiler)
      compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
      }, callback)
    } else {
      bindProdLogger(compiler)
      compiler.run((err: Error, stats: Stats) => {
        compiler.close(err2 => callback(err || err2, stats))
      })
    }
  })
}
