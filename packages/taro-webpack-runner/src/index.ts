import detectPort = require('detect-port')
import * as opn from 'opn'
import * as path from 'path'
import { format as formatUrl } from 'url'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import buildConf from './config/build.conf'
import devConf from './config/dev.conf'
import baseConf from './config/base.conf'
import baseDevServerOption from './config/devServer.conf'
import prodConf from './config/prod.conf'
import { addLeadingSlash, addTrailingSlash, recursiveMerge, formatOpenHost } from './util'
import { bindDevLogger, bindProdLogger, printBuildError } from './util/logHelper'
import { BuildConfig } from './util/types'

const stripTrailingSlash = (path: string): string =>
  path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path

const stripLeadingSlash = (path: string): string =>
  path.charAt(0) === '/' ? path.substr(1) : path

const addHtmlExtname = (str: string) => {
  return /\.html\b/.test(str)
    ? str
    : `${str}.html`
}

const customizeChain = async (chain, modifyWebpackChainFunc: Function, customizeFunc?: Function) => {
  if (modifyWebpackChainFunc instanceof Function) {
    await modifyWebpackChainFunc(chain, webpack)
  }
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack)
  }
}

const buildProd = async (appPath: string, config: BuildConfig): Promise<void> => {
  const baseWebpackChain = baseConf(appPath)
  await customizeChain(baseWebpackChain, config.modifyWebpackChain, config.webpackChain)
  const prodWebpackConf = prodConf(appPath, config, baseWebpackChain)
  const webpackChain = baseWebpackChain.merge(prodWebpackConf)
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
  const publicPath = conf.publicPath ? addLeadingSlash(addTrailingSlash(conf.publicPath)) : '/'
  const outputPath = path.join(appPath, conf.outputRoot as string)
  const customDevServerOption = config.devServer || {}
  const homePage = config.homePage || []
  const onBuildFinish = config.onBuildFinish
  const baseWebpackChain = baseConf(appPath)
  await customizeChain(baseWebpackChain, config.modifyWebpackChain, config.webpackChain)
  const devWebpackConf = devConf(appPath, config, baseWebpackChain)
  const webpackChain = baseWebpackChain.merge(devWebpackConf)

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
    pathname = `${stripTrailingSlash(routerBasename)}/${addHtmlExtname(stripLeadingSlash(homePage[1] || ''))}`
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
  return new Promise((resolve, reject) => {
    server.listen(devServerOptions.port, (devServerOptions.host as string), err => {
      if (err) {
        reject()
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
        opn(openUrl)
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
