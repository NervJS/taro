import * as webpack from 'webpack'
import { META_TYPE } from '@tarojs/helper'

import { IBuildConfig } from './utils/types'
import { printBuildError, bindProdLogger, bindDevLogger } from './utils/logHelper'
import baseConf from './webpack/base.conf'
import buildConf from './webpack/build.conf'
import { Prerender } from './prerender/prerender'
import { isEmpty } from 'lodash'

const customizeChain = async (chain, modifyWebpackChainFunc: Function, customizeFunc?: Function) => {
  if (modifyWebpackChainFunc instanceof Function) {
    await modifyWebpackChainFunc(chain, webpack)
  }
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack, META_TYPE)
  }
}

export default async function build (appPath: string, config: IBuildConfig): Promise<webpack.Stats> {
  const mode = config.mode
  /** initialized chain */
  const baseWebpackChain = baseConf(appPath)

  /** customized chain */
  await customizeChain(baseWebpackChain, config.modifyWebpackChain, config.webpackChain)

  const buildWebpackConf = buildConf(appPath, mode, config, baseWebpackChain)
  const webpackChain = baseWebpackChain.merge(buildWebpackConf)

  if (typeof config.onWebpackChainReady === 'function') {
    config.onWebpackChainReady(webpackChain)
  }

  /** webpack config */
  const webpackConfig: webpack.Configuration = webpackChain.toConfig()

  return new Promise<webpack.Stats>((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    const onBuildFinish = config.onBuildFinish
    let prerender: Prerender

    const onFinish = function (error, stats: webpack.Stats | null) {
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
        printBuildError(error)
        onFinish(error, null)
        return reject(error)
      }

      if (!isEmpty(config.prerender)) {
        prerender = prerender ?? new Prerender(config, webpackConfig, stats)
        await prerender.render()
      }
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
      compiler.run(callback)
    }
  })
}
