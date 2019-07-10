import * as webpack from 'webpack'

import { IBuildConfig } from './utils/types'
import { printBuildError, bindProdLogger } from './utils/logHelper'
import buildConf from './webpack/build.conf'

const customizeChain = (chain, customizeFunc: Function) => {
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack)
  }
}

export default function build (appPath: string, config: IBuildConfig, mainBuilder) {
  const mode = config.isWatch ? 'development' : 'production'
  return new Promise((resolve, reject) => {
    const webpackChain = buildConf(appPath, mode, config)

    customizeChain(webpackChain, config.webpackChain)
    const webpackConfig = webpackChain.toConfig()

    const compiler = webpack(webpackConfig)
    bindProdLogger(compiler)

    compiler.run((err) => {
      if (err) {
        printBuildError(err);
        return reject(err)
      }
      resolve()
    })
  })
}
