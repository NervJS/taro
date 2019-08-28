import * as opn from 'opn'
import * as path from 'path'
import { format as formatUrl } from 'url'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'

import buildConf from './config/build.conf'
import devConf from './config/dev.conf'
import baseDevServerOption from './config/devServer.conf'
import prodConf from './config/prod.conf'
import { addLeadingSlash, addTrailingSlash, recursiveMerge } from './util'
import { bindDevLogger, bindProdLogger, printBuildError } from './util/logHelper'
import { BuildConfig } from './util/types'

const customizeChain = (chain, customizeFunc: Function) => {
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack)
  }
}

const buildProd = (appPath: string, config: BuildConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    const webpackChain = prodConf(appPath, config)

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

const buildDev = async (appPath: string, config: BuildConfig): Promise<any> => {
  return new Promise((resolve, reject) => {
    const conf = buildConf(config)
    const routerConfig = config.router || {}
    const routerMode = routerConfig.mode || 'hash'
    const routerBasename = routerConfig.basename || '/'
    const publicPath = conf.publicPath ? addLeadingSlash(addTrailingSlash(conf.publicPath)) : '/'
    const outputPath = path.join(appPath, conf.outputRoot as string)
    const customDevServerOption = config.devServer || {}
    const webpackChain = devConf(appPath, config)

    customizeChain(webpackChain, config.webpackChain)

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
      pathname: routerMode === 'browser' ? routerBasename : '/'
    })

    const webpackConfig = webpackChain.toConfig()
    WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)
    const compiler = webpack(webpackConfig)
    bindDevLogger(devUrl, compiler)
    const server = new WebpackDevServer(compiler, devServerOptions)

    server.listen(devServerOptions.port as number, devServerOptions.disableHostCheck ? '0.0.0.0' : (devServerOptions.host as string), err => {
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

export default async (appPath: string, config: BuildConfig): Promise<void> => {
  if (config.isWatch) {
    try {
      await buildDev(appPath, config)
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      await buildProd(appPath, config)
    } catch (e) {
      console.error(e)
      process.exit(1);
    }
  }
}
