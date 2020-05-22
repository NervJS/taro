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

export default async function build (appPath: string, config: IBuildConfig, mainBuilder) {
  const mode = config.mode
  const newConfig = await makeConfig(config)
  // config.webpackChain 自定义 Webpack 配置，接受函数形式的配置。
  const webpackChain = buildConf(appPath, mode, config)
  await customizeChain(webpackChain, newConfig.modifyWebpackChain, newConfig.webpackChain)
  const webpackConfig = webpackChain.toConfig()
  webpackConfig.stats = 'verbose'
  webpackConfig.profile = true
  const onBuildFinish = config.onBuildFinish
  // console.log('webpackConfig', webpackConfig.output)
  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    if (config.isWatch) {
      bindDevLogger(compiler, config.buildAdapter)
      compiler.watch({
        aggregateTimeout: 300,
        poll: true
      }, (err, stats) => {
        if (err) {
          printBuildError(err)
          if (typeof onBuildFinish === 'function') {
            onBuildFinish({
              error: err,
              stats: null,
              isWatch: true
            })
          }
          return reject(err)
        }
        if (typeof onBuildFinish === 'function') {
          onBuildFinish({
            error: null,
            stats,
            isWatch: true
          })
        }
        resolve()
      })
    } else { // prod
      bindProdLogger(compiler, config.buildAdapter)
      compiler.run((err, stats) => {
        if (err) {
          printBuildError(err)
          if (typeof onBuildFinish === 'function') {
            onBuildFinish({
              error: err,
              stats: null,
              isWatch: false
            })
          }
          return reject(err)
        }
        if (typeof onBuildFinish === 'function') {
          onBuildFinish({
            error: null,
            stats,
            isWatch: false
          })
        }
        resolve()
      })
    }
  })
}
