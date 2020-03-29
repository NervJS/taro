import * as webpack from 'webpack'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { PARSE_AST_TYPE } from '@tarojs/helper'

import { IBuildConfig, IOption } from './utils/types'
import { printBuildError, bindProdLogger, bindDevLogger } from './utils/logHelper'
import buildConf from './webpack/build.conf'

const customizeChain = async (chain, modifyWebpackChainFunc: Function, customizeFunc: Function) => {
  if (modifyWebpackChainFunc instanceof Function) {
    await modifyWebpackChainFunc(chain, webpack)
  }
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack, PARSE_AST_TYPE)
  }
}

const makeConfig = async (buildConfig: IBuildConfig) => {
  const sassLoaderOption: IOption = await getSassLoaderOption(buildConfig)
  return {
    ...buildConfig,
    sassLoaderOption
  }
}

export default async function build (appPath: string, config: IBuildConfig) {
  const mode = config.mode
  const newConfig = await makeConfig(config)
  const webpackChain = buildConf(appPath, mode, config)
  await customizeChain(webpackChain, newConfig.modifyWebpackChain, newConfig.webpackChain)
  const webpackConfig = webpackChain.toConfig()
  const onBuildFinish = config.onBuildFinish
  const compiler = webpack(webpackConfig)
  return new Promise((resolve, reject) => {
    if (newConfig.isWatch) {
      bindDevLogger(compiler)
      compiler.watch({
        aggregateTimeout: 300,
        poll: true
      }, (err, stats) => {
        if (err) {
          printBuildError(err)
          if (typeof onBuildFinish === 'function') {
            onBuildFinish(err, null, true)
          }
          return reject(err)
        }
        if (typeof onBuildFinish === 'function') {
          onBuildFinish(null, stats, true)
        }
        resolve()
      })
    } else {
      bindProdLogger(compiler)
      compiler.run((err, stats) => {
        if (err) {
          printBuildError(err)
          if (typeof onBuildFinish === 'function') {
            onBuildFinish(err, null, false)
          }
          return reject(err)
        }
        if (typeof onBuildFinish === 'function') {
          onBuildFinish(null, stats, false)
        }
        resolve()
      })
    }
  })
}
