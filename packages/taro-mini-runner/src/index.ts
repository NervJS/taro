import * as webpack from 'webpack'
import { BUILD_TYPES, PARSE_AST_TYPE } from '@tarojs/runner-utils'

import { IBuildConfig } from './utils/types'
import { printBuildError, bindProdLogger, bindDevLogger } from './utils/logHelper'
import buildConf from './webpack/build.conf'
import { Prerender } from './prerender/prerender'
import { isEmpty } from 'lodash'
import { makeConfig } from './webpack/chain'

const customizeChain = (chain, customizeFunc: Function) => {
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack, PARSE_AST_TYPE)
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
    makeConfig(config)
      .then(config => {
        const webpackChain = buildConf(appPath, mode, config)

        customizeChain(webpackChain, config.webpackChain)
        const webpackConfig = webpackChain.toConfig()

        const compiler = webpack(webpackConfig)
        let prerender: Prerender
        if (config.isWatch) {
          bindDevLogger(compiler, config.buildAdapter)
          compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
          }, (err, stats) => {
            if (err) {
              printBuildError(err)
              return reject(err)
            }

            if (!isEmpty(config.prerender)) {
              if (prerender == null) {
                prerender = new Prerender(config, webpackConfig, stats)
              }
              prerender.render().then(() => {
                mainBuilder.hooks.afterBuild.call(stats)
                resolve()
              })
            } else {
              mainBuilder.hooks.afterBuild.call(stats)
              resolve()
            }
          })
        } else {
          bindProdLogger(compiler, config.buildAdapter)
          compiler.run((err, stats) => {
            if (err) {
              printBuildError(err)
              return reject(err)
            }
            if (config.prerender) {
              if (prerender == null) {
                prerender = new Prerender(config, webpackConfig, stats)
              }
              prerender.render().then(() => {
                mainBuilder.hooks.afterBuild.call(stats)
                resolve()
              })
            } else {
              mainBuilder.hooks.afterBuild.call(stats)
              resolve()
            }
          })
        }
      })
  })
}
