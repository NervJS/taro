import { recursiveMerge } from '@tarojs/helper'
import * as detectPort from 'detect-port'
import * as path from 'path'
import { format as formatUrl } from 'url'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'

import buildConf from './config/build.conf'
import devConf from './config/dev.conf'
import baseDevServerOption from './config/devServer.conf'
import prodConf from './config/prod.conf'
import { formatOpenHost, parsePublicPath } from './util'
import { makeConfig } from './util/chain'
import { bindDevLogger, bindProdLogger, printBuildError } from './util/logHelper'
import { BuildConfig, Func } from './util/types'

export const customizeChain = async (chain, modifyWebpackChainFunc: Func, customizeFunc?: Func) => {
  if (modifyWebpackChainFunc instanceof Function) {
    await modifyWebpackChainFunc(chain, webpack)
  }
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack)
  }
}

const buildProd = async (appPath: string, config: BuildConfig): Promise<void> => {
  const webpackChain = prodConf(appPath, config)
  await customizeChain(webpackChain, config.modifyWebpackChain, config.webpackChain)
  if (typeof config.onWebpackChainReady === 'function') {
    config.onWebpackChainReady(webpackChain)
  }
  const webpackConfig = webpackChain.toConfig()
  const compiler = webpack(webpackConfig)
  const onBuildFinish = config.onBuildFinish
  compiler.hooks.emit.tapAsync('taroBuildDone', async (compilation, callback) => {
    if (typeof config.modifyBuildAssets === 'function') {
      await config.modifyBuildAssets(compilation.assets)
    }
    callback()
  })
  return new Promise((resolve, reject) => {
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
      if (typeof onBuildFinish === 'function') {
        onBuildFinish({
          error: err,
          stats,
          isWatch: false
        })
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
  const publicPath = parsePublicPath(conf.publicPath)
  const outputPath = path.join(appPath, conf.outputRoot as string)
  const customDevServerOption = (config.devServer || {}) as WebpackDevServer.Configuration
  const webpackChain = devConf(appPath, config)
  const onBuildFinish = config.onBuildFinish
  await customizeChain(webpackChain, config.modifyWebpackChain, config.webpackChain)

  if (typeof config.onWebpackChainReady === 'function') {
    config.onWebpackChainReady(webpackChain)
  }

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

  if (devServerOptions.host === 'localhost') {
    devServerOptions.useLocalIp = false
  }

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
    hostname: formatOpenHost(devServerOptions.host),
    port: devServerOptions.port,
    pathname
  })

  const webpackConfig = webpackChain.toConfig()
  WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)
  const compiler = webpack(webpackConfig) as webpack.Compiler
  bindDevLogger(devUrl, compiler)
  const server = new WebpackDevServer(compiler, devServerOptions)
  compiler.hooks.emit.tapAsync('taroBuildDone', async (compilation, callback) => {
    if (typeof config.modifyBuildAssets === 'function') {
      await config.modifyBuildAssets(compilation.assets)
    }
    callback()
  })
  compiler.hooks.done.tap('taroBuildDone', stats => {
    if (typeof onBuildFinish === 'function') {
      onBuildFinish({
        error: null,
        stats,
        isWatch: true
      })
    }
  })
  compiler.hooks.failed.tap('taroBuildDone', error => {
    if (typeof onBuildFinish === 'function') {
      onBuildFinish({
        error,
        stats: null,
        isWatch: true
      })
    }
  })
  return new Promise<void>((resolve, reject) => {
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
