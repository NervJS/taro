import chalk from 'chalk'
import { merge } from 'lodash'
import * as opn from 'opn'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { deprecate } from 'util'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import * as webpackMerge from 'webpack-merge'
import { pipe, partial } from 'lodash/fp'

import buildConf from './config/build.conf'
import devConf from './config/dev.conf'
import baseDevServerOption from './config/devServer.conf'
import prodConf from './config/prod.conf'
import { bindDevLogger, bindProdLogger } from './util/logHelper'
import { BuildConfig } from './util/types'

const appPath = process.cwd()

const customizeChain = (chain, config) => {
  if (config.webpackChain instanceof Function) {
    config.webpackChain(chain)
  }
}

const deprecatedCustomizeConfig = deprecate((baseConfig, customConfig) => {
  if (customConfig instanceof Function) {
    return customConfig(baseConfig, webpack)
  } else if (customConfig instanceof Object) {
    return webpackMerge({}, baseConfig, customConfig)
  }
}, chalk.yellow(`h5.webpack配置项即将停止支持，请尽快迁移到新配置项。新配置项文档：https://nervjs.github.io/taro/docs/config-detail.html#h5`))

const buildProd = (config: BuildConfig): void => {
  const webpackChain = prodConf(config)
  let webpackConfig

  customizeChain(webpackChain, config)

  if (config.webpack) {
    webpackConfig = deprecatedCustomizeConfig(webpackChain.toConfig(), config.webpack)
  } else {
    webpackConfig = webpackChain.toConfig()
  }

  const compiler = pipe(
    webpack as (config: any) => any,
    partial(bindProdLogger, [{}])
  )(webpackConfig)

  compiler.run()
}

const buildDev = (config: BuildConfig): void => {
  const conf = buildConf(config)
  const publicPath = conf.publicPath
  const outputPath = path.join(appPath, conf.outputRoot)
  const customDevServerOption = config.devServer || {}
  const webpackChain = devConf(config)
  let webpackConfig

  customizeChain(webpackChain, config)

  webpackConfig = webpackChain.toConfig()
  if (config.webpack) {
    webpackConfig = deprecatedCustomizeConfig(webpackChain.toConfig(), config.webpack)
  }

  const devServerOptions = merge(
    {
      publicPath,
      contentBase: outputPath
    },
    baseDevServerOption,
    customDevServerOption
  )
  const devUrl = formatUrl({
    protocol: devServerOptions.https ? 'https' : 'http',
    hostname: devServerOptions.host,
    port: devServerOptions.port,
    pathname: publicPath
  })
  WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)
  const compiler = pipe(
    webpack as (config: any) => any,
    partial(bindDevLogger, [{ devUrl }])
  )(webpackConfig)
  const server = new WebpackDevServer(compiler, devServerOptions)
  server.listen(devServerOptions.port as number, devServerOptions.host as string, err => {
    if (err) return console.log(err)
    opn(devUrl)
  })
}

export default (config: BuildConfig): void => {
  if (config.isWatch) {
    buildDev(config)
  } else {
    buildProd(config)
  }
}
