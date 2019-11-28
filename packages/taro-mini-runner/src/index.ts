import * as webpack from 'webpack'

import { IBuildConfig } from './utils/types'
import { BUILD_TYPES } from './utils/constants'
import { printBuildError, bindProdLogger, bindDevLogger } from './utils/logHelper'
import buildConf from './webpack/build.conf'

const customizeChain = (chain, customizeFunc: Function) => {
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack)
  }
}

export default function build (appPath: string, config: IBuildConfig, mainBuilder) {
  const mode = config.isWatch ? 'development' : 'production'
  return new Promise((resolve, reject) => {
    const { buildAdapter } = config
    if (buildAdapter === BUILD_TYPES.PLUGIN) {
      config.buildAdapter = BUILD_TYPES.WEAPP
      config.isBuildPlugin = true
    }
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
}
