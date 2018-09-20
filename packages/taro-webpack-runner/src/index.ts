import chalk from 'chalk'
import { merge } from 'lodash'
import { partial, pipe } from 'lodash/fp'
import * as opn from 'opn'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { deprecate } from 'util'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import * as webpackMerge from 'webpack-merge'

import buildConf from './config/build.conf'
import devConf from './config/dev.conf'
import baseDevServerOption from './config/devServer.conf'
import dllConf from './config/dll.conf'
import prodConf from './config/prod.conf'
import { appPath } from './util'
import { bindDevLogger, bindProdLogger, bindDllLogger } from './util/logHelper'
import { BuildConfig } from './util/types'

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

const buildDll = async (config: BuildConfig): Promise<any> => {
  if (!config.enableDll) return Promise.resolve({})
  return new Promise((resolve, reject) => {
    const webpackChain = dllConf(config)
    const webpackConfig = webpackChain.toConfig()
    const compiler = pipe(webpack as (config: any) => any, bindDllLogger)(webpackConfig)
    compiler.run((err) => {
      if (err) reject(err)
      resolve({})
    })
  })
}

const buildProd = (config: BuildConfig): void => {
  const webpackChain = prodConf(config)
  let webpackConfig

  customizeChain(webpackChain, config)

  if (config.webpack) {
    webpackConfig = deprecatedCustomizeConfig(webpackChain.toConfig(), config.webpack)
  } else {
    webpackConfig = webpackChain.toConfig()
  }

  const compiler = pipe(webpack as (config: any) => any, bindProdLogger)(webpackConfig)

  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
  
    const info = stats.toJson();
  
    if (stats.hasErrors()) {
      console.error(info.errors);
    }
  
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }
  })
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
  const compiler = pipe(webpack as (config: any) => any, partial(bindDevLogger, [devUrl]))(webpackConfig)
  const server = new WebpackDevServer(compiler, devServerOptions)
  server.listen(devServerOptions.port as number, devServerOptions.host as string, err => {
    if (err) return console.log(err)
    opn(devUrl)
  })
}

export default async (config: BuildConfig): Promise<void> => {
  if (config.isWatch) {
    buildDev(config)
  } else {
    await buildDll(config)
    buildProd(config)
  }
}
