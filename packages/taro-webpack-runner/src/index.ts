import * as detectPort from 'detect-port'
import * as path from 'path'
import { format as formatUrl } from 'url'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import { recursiveMerge } from '@tarojs/runner-utils'

import buildConf from './config/build.conf'
import devConf from './config/dev.conf'
import baseDevServerOption from './config/devServer.conf'
import prodConf from './config/prod.conf'
import { addLeadingSlash, addTrailingSlash, formatOpenHost } from './util'
import { bindDevLogger, bindProdLogger, printBuildError } from './util/logHelper'
import { BuildConfig } from './util/types'
import { makeConfig } from './util/chain'

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
        printBuildError(err)
        return reject(err)
      }
      resolve()
    })
  })
}

const buildDev = async (appPath: string, config: BuildConfig): Promise<any> => {
  const conf = buildConf(config)
  const routerConfig = config.router || {}
  const routerMode = routerConfig.mode || 'hash'
  const routerBasename = routerConfig.basename || '/'
  const publicPath = conf.publicPath ? addLeadingSlash(addTrailingSlash(conf.publicPath)) : '/'
  const outputPath = path.join(appPath, conf.outputRoot as string)
  const customDevServerOption = config.devServer || {}
  const webpackChain = devConf(appPath, config)
  customizeChain(webpackChain, config.webpackChain)

  const devServerOptions = recursiveMerge<WebpackDevServer.Configuration>(
    {
      publicPath,
      contentBase: outputPath,
      historyApiFallback: {
        rewrites: [{
          from: /./,
          to: publicPath
        }]
      }
    },
    baseDevServerOption,
    customDevServerOption
  )

  const originalPort = devServerOptions.port
  const availablePort = await detectPort(originalPort)

  if (availablePort !== originalPort) {
    console.log()
    console.log(`预览端口 ${originalPort} 被占用, 自动切换到空闲端口 ${availablePort}`)
    devServerOptions.port = availablePort
  }

  let pathname

  if (routerMode === 'multi') {
    pathname = '/'
  } else if (routerMode === 'browser') {
    pathname = routerBasename
  } else {
    pathname = '/'
  }

  const devUrl = formatUrl({
    protocol: devServerOptions.https ? 'https' : 'http',
    hostname: devServerOptions.host,
    port: devServerOptions.port,
    pathname
  })

  const webpackConfig = webpackChain.toConfig()
  WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)
  const compiler = webpack(webpackConfig)
  bindDevLogger(devUrl, compiler)
  const server = new WebpackDevServer(compiler, devServerOptions)

  return new Promise((resolve, reject) => {
    server.listen(devServerOptions.port, (devServerOptions.host as string), err => {
      if (err) {
        reject(err)
        return console.log(err)
      }
      resolve()

      /* 补充处理devServer.open配置 */
      if (devServerOptions.open) {
        const openUrl = formatUrl({
          protocol: devServerOptions.https ? 'https' : 'http',
          hostname: formatOpenHost(devServerOptions.host),
          port: devServerOptions.port,
          pathname
        })
        console.log(openUrl)
      }
    })
  })
}

export default async (appPath: string, config: BuildConfig): Promise<void> => {
  const newConfig: BuildConfig = await makeConfig(config)
  if (newConfig.isWatch) {
    try {
      await buildDev(appPath, newConfig)
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      await buildProd(appPath, newConfig)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }
}
