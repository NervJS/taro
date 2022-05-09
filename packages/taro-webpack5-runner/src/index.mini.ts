import { isEmpty } from 'lodash'
import webpack from 'webpack'

import { preBundle } from './prebundle'
import { Prerender } from './prerender/prerender'
import type { MiniBuildConfig } from './utils/types'
import { MiniCombination } from './webpack/MiniCombination'

export default async function build (appPath: string, rawConfig: MiniBuildConfig): Promise<webpack.Stats> {
  const combination = new MiniCombination(appPath, rawConfig)
  await combination.make()

  await preBundle(combination)

  const webpackConfig = combination.chain.toConfig()
  const config = combination.config

  return new Promise<webpack.Stats>((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    const onBuildFinish = config.onBuildFinish
    let prerender: Prerender

    const onFinish = function (error: Error | null, stats: webpack.Stats | null) {
      if (typeof onBuildFinish !== 'function') return

      onBuildFinish({
        error,
        stats,
        isWatch: config.isWatch
      })
    }

    const callback = async (err: Error, stats: webpack.Stats) => {
      if (err || stats.hasErrors()) {
        const error = err ?? stats.toJson().errors
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
      compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
      }, callback)
    } else {
      compiler.run((err: Error, stats: webpack.Stats) => {
        compiler.close(err2 => callback(err || err2, stats))
      })
    }
  })
}
