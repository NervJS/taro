import * as webpack from 'webpack'
import { getSassLoaderOption } from '@tarojs/runner-utils'

import { IBuildConfig, IOption } from './utils/types'
import { PARSE_AST_TYPE } from './utils/constants'
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
          return reject(err)
        }
        resolve()
      })
    } else {
      bindProdLogger(compiler)
      compiler.run((err, stats) => {
        if (err) {
          printBuildError(err)
          return reject(err)
        }
        resolve()
      })
    }
  })
}
