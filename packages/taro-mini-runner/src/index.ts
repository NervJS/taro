import * as webpack from 'webpack'
import { getSassLoaderOption } from '@tarojs/runner-utils'

import { IBuildConfig, IOption } from './utils/types'
import { PARSE_AST_TYPE } from './utils/constants'
import { printBuildError, bindProdLogger, bindDevLogger } from './utils/logHelper'
import buildConf from './webpack/build.conf'

const customizeChain = (chain, customizeFunc: Function) => {
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

export default function build (appPath: string, config: IBuildConfig, mainBuilder) {
  const mode = config.mode
  return new Promise((resolve, reject) => {
    makeConfig(config)
      .then(config => {
        const webpackChain = buildConf(appPath, mode, config)

        customizeChain(webpackChain, config.webpackChain)
        const webpackConfig = webpackChain.toConfig()

        const compiler = webpack(webpackConfig)
        if (config.isWatch) {
          bindDevLogger(compiler, config.buildAdapter)
          compiler.watch({
            aggregateTimeout: 300,
            poll: true
          }, (err, stats) => {
            if (err) {
              printBuildError(err)
              return reject(err)
            }
            mainBuilder.hooks.afterBuild.call(stats)
            resolve()
          })
        } else {
          bindProdLogger(compiler, config.buildAdapter)
          compiler.run((err, stats) => {
            if (err) {
              printBuildError(err)
              return reject(err)
            }
            mainBuilder.hooks.afterBuild.call(stats)
            resolve()
          })
        }
      })
  })
}
