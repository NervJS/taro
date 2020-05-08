import * as webpack from 'webpack'
import { META_TYPE } from '@tarojs/helper'

import { IBuildConfig } from './utils/types'
import { printBuildError, bindProdLogger, bindDevLogger } from './utils/logHelper'
import buildConf from './webpack/build.conf'
import { Prerender } from './prerender/prerender'
import { isEmpty } from 'lodash'
import { makeConfig } from './webpack/chain'

const customizeChain = async (chain, modifyWebpackChainFunc: Function, customizeFunc: Function) => {
  if (modifyWebpackChainFunc instanceof Function) {
    await modifyWebpackChainFunc(chain, webpack)
  }
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack, META_TYPE)
  }
}

export default async function build (appPath: string, config: IBuildConfig) {
  const mode = config.mode
  const newConfig = await makeConfig(config)
  const webpackChain = buildConf(appPath, mode, newConfig)
  await customizeChain(webpackChain, newConfig.modifyWebpackChain, newConfig.webpackChain)
  const webpackConfig = webpackChain.toConfig()
  const onBuildFinish = newConfig.onBuildFinish
  const compiler = webpack(webpackConfig)
  return new Promise((resolve, reject) => {
    let prerender: Prerender
    if (newConfig.isWatch) {
      bindDevLogger(compiler)
      compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
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

        if (!isEmpty(newConfig.prerender)) {
          if (prerender == null) {
            prerender = new Prerender(config, webpackConfig, stats)
          }
          prerender.render().then(() => {
            if (typeof onBuildFinish === 'function') {
              onBuildFinish({
                error: null,
                stats,
                isWatch: true
              })
            }
            resolve()
          })
        } else {
          if (typeof onBuildFinish === 'function') {
            onBuildFinish({
              error: null,
              stats,
              isWatch: true
            })
          }
          resolve()
        }
      })
    } else {
      bindProdLogger(compiler)
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
        if (newConfig.prerender) {
          if (prerender == null) {
            prerender = new Prerender(config, webpackConfig, stats)
          }
          prerender.render().then(() => {
            if (typeof onBuildFinish === 'function') {
              onBuildFinish({
                error: null,
                stats,
                isWatch: false
              })
            }
            resolve()
          })
        } else {
          if (typeof onBuildFinish === 'function') {
            onBuildFinish({
              error: null,
              stats,
              isWatch: false
            })
          }
          resolve()
        }
      })
    }
  })
}
