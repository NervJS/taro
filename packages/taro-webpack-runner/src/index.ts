import chalk from 'chalk'
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
import { appPath, addLeadingSlash, addTrailingSlash, recursiveMerge } from './util'
import { bindDevLogger, bindProdLogger, bindDllLogger, printBuildError } from './util/logHelper'
import { BuildConfig } from './util/types'

const customizeChain = (chain, config) => {
  if (config.webpackChain instanceof Function) {
    config.webpackChain(chain, webpack)
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
  if (config.enableDll === false) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const webpackChain = dllConf(config)
    const webpackConfig = webpackChain.toConfig()
    const compiler = webpack(webpackConfig)
    bindDllLogger(compiler)

    compiler.run((err) => {
      if (err) {
        printBuildError(err)
        return reject(err)
      }
      resolve()
    })
  })
}

const buildProd = (config: BuildConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    const webpackChain = prodConf(config)
    let webpackConfig

    customizeChain(webpackChain, config)

    if (config.webpack) {
      webpackConfig = deprecatedCustomizeConfig(webpackChain.toConfig(), config.webpack)
    } else {
      webpackConfig = webpackChain.toConfig()
    }

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

const buildDev = async (config: BuildConfig): Promise<any> => {
  return new Promise((resolve, reject) => {
    const conf = buildConf(config)
    conf.publicPath = addLeadingSlash(addTrailingSlash(conf.publicPath))
    const publicPath = conf.publicPath
    const outputPath = path.join(appPath, conf.outputRoot as string)
    const customDevServerOption = config.devServer || {}
    const webpackChain = devConf(config)
    let webpackConfig

    customizeChain(webpackChain, config)

    webpackConfig = webpackChain.toConfig()
    if (config.webpack) {
      webpackConfig = deprecatedCustomizeConfig(webpackChain.toConfig(), config.webpack)
    }

    const devServerOptions = recursiveMerge(
      {
        publicPath,
        contentBase: outputPath,
        historyApiFallback: {
          index: publicPath
        }
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
    const compiler = webpack(webpackConfig)
    bindDevLogger(devUrl, compiler)
    const server = new WebpackDevServer(compiler, devServerOptions)

    server.listen(devServerOptions.port as number, devServerOptions.host as string, err => {
      if (err) {
        reject()
        return console.log(err)
      }
      resolve()

      /* 补充处理devServer.open配置 */
      if (devServerOptions.open) {
        opn(devUrl)
      }
    })
  })
}

export default async (config: BuildConfig): Promise<void> => {
  if (config.isWatch) {
    await buildDev(config)
  } else {
    await buildDll(config)
    await buildProd(config)
  }
}
