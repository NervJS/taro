import { chalk, recursiveMerge, SOURCE_DIR } from '@tarojs/helper'
import { isFunction } from '@tarojs/shared'
import Prebundle from '@tarojs/webpack5-prebundle'
import detectPort from 'detect-port'
import path from 'path'
import { format as formatUrl } from 'url'
import webpack, { EntryNormalized } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import { addHtmlSuffix, addLeadingSlash, formatOpenHost, parsePublicPath, stripBasename, stripTrailingSlash } from './utils'
import H5AppInstance from './utils/H5AppInstance'
import type { H5BuildConfig } from './utils/types'
import { H5Combination } from './webpack/H5Combination'

let isFirstBuild = true

export default async function build (appPath: string, rawConfig: H5BuildConfig): Promise<void> {
  const combination = new H5Combination(appPath, rawConfig)
  await combination.make()

  const { chunkDirectory = 'chunk', devServer, enableSourceMap, entryFileName = 'app', entry = {}, publicPath } = combination.config
  const prebundle = new Prebundle({
    appPath,
    sourceRoot: combination.sourceRoot,
    chain: combination.chain,
    chunkDirectory,
    devServer,
    enableSourceMap,
    entryFileName,
    entry,
    publicPath
  })
  await prebundle.run(combination.getPrebundleOptions())

  const webpackConfig = combination.chain.toConfig()
  const config = combination.config
  const { isWatch } = config

  try {
    const onBuildFinish = config.onBuildFinish
    const compiler = webpack(webpackConfig)

    if (!isWatch) {
      compiler.hooks.emit.tapAsync('taroBuildDone', async (compilation, callback) => {
        if (isFunction(config.modifyBuildAssets)) {
          await config.modifyBuildAssets(compilation.assets)
        }
        callback()
      })
      return new Promise((resolve, reject) => {
        compiler.run((error, stats) => {
          compiler.close(error2 => {
            const err = error || error2

            if (isFunction(onBuildFinish)) {
              onBuildFinish({
                error: err,
                stats: err ? null : stats,
                isWatch: false
              })
            }

            err ? reject(err) : resolve()
          })
        })
      })
    } else {
      const routerConfig = config.router || {}
      const routerMode = routerConfig.mode || 'hash'
      const routerBasename = routerConfig.basename || '/'

      config.devServer = recursiveMerge(config.devServer || {}, webpackConfig.devServer)
      const devServerOptions = await getDevServerOptions(appPath, config)
      devServerOptions.host = formatOpenHost(devServerOptions.host)

      const server = new WebpackDevServer(devServerOptions, compiler)

      const pathname = routerMode === 'browser' ? routerBasename : '/'
      const devUrl = formatUrl({
        protocol: devServerOptions.https ? 'https' : 'http',
        hostname: devServerOptions.host,
        port: devServerOptions.port,
        pathname
      })

      compiler.hooks.done.tap('taroDone', () => {
        if (isFirstBuild) {
          isFirstBuild = false
          if (devUrl) {
            console.log(chalk.cyan(`ℹ Listening at ${devUrl}\n`))
          }
        }
      })

      compiler.hooks.emit.tapAsync('taroBuildDone', async (compilation, callback) => {
        if (isFunction(config.modifyBuildAssets)) {
          await config.modifyBuildAssets(compilation.assets)
        }
        callback()
      })
      compiler.hooks.done.tap('taroBuildDone', stats => {
        if (isFunction(onBuildFinish)) {
          onBuildFinish({
            error: null,
            stats,
            isWatch: true
          })
        }
      })
      compiler.hooks.failed.tap('taroBuildDone', error => {
        if (isFunction(onBuildFinish)) {
          onBuildFinish({
            error,
            stats: null,
            isWatch: true
          })
        }
      })

      return new Promise<void>((resolve, reject) => {
        server.startCallback(err => {
          if (err) {
            reject(err)
            return console.log(err)
          }
          resolve()
        })
      })
    }
  } catch (err) {
    console.error(err)
    !isWatch && process.exit(1)
  }
}

async function getDevServerOptions (appPath: string, config: H5BuildConfig): Promise<WebpackDevServer.Configuration> {
  const publicPath = parsePublicPath(config.publicPath)
  const outputPath = path.join(appPath, config.outputRoot || 'dist')
  const customDevServerOption = config.devServer || {}
  const routerConfig = config.router || {}
  const routerMode = routerConfig.mode || 'hash'
  const isMultiRouterMode = routerMode === 'multi'
  const proxy = {}
  if (isMultiRouterMode) {
    const app = new H5AppInstance(config.entry as EntryNormalized, {
      sourceDir: path.join(appPath, config.sourceRoot || SOURCE_DIR),
      frameworkExts: config.frameworkExts,
      entryFileName: config.entryFileName
    })
    const appConfig = app.appConfig
    const customRoutes = routerConfig?.customRoutes || {}
    const routerBasename = routerConfig.basename || '/'
    const getEntriesRoutes = (customRoutes: Record<string, string | string[]> = {}) => {
      const conf: string[][] = []
      for (let key in customRoutes) {
        const path = customRoutes[key]
        key = addLeadingSlash(key)
        if (typeof path === 'string') {
          conf.push([key, addLeadingSlash(path)])
        } else if (path?.length > 0) {
          conf.push(...path.map(p => [key, addLeadingSlash(p)]))
        }
      }
      return conf
    }
    const bypass: WebpackDevServer.ByPass = req => {
      if (req.headers.accept?.indexOf('html') !== -1) {
        const pagePath = stripTrailingSlash(stripBasename(req.path, routerBasename))
        // console.log('bypass:' + req.path, pagePath)
        if (pagePath === '') {
          return addHtmlSuffix(appConfig.entryPagePath || appConfig.pages?.[0])
        }

        const pageIdx = (appConfig.pages ?? []).findIndex(e => addLeadingSlash(e) === pagePath)
        if (pageIdx > -1) {
          return addHtmlSuffix(appConfig.pages?.[pageIdx])
        }

        const customRoutesConf = getEntriesRoutes(customRoutes)
        const idx = getEntriesRoutes(customRoutes).findIndex(list => list[1] === pagePath)
        if (idx > -1) {
          // NOTE: 自定义路由
          return addHtmlSuffix(customRoutesConf[idx][0])
        }
      }
    }
    proxy[routerBasename] = { bypass }
  }

  const devServerOptions: WebpackDevServer.Configuration = recursiveMerge<any>(
    {
      devMiddleware: {
        publicPath,
        writeToDisk: false
      },
      static: [{
        directory: outputPath, // webpack4: devServerOptions.contentBase
        publicPath,
        watch: true // webpack4: devServerOptions.watchContentBase
      }],
      compress: true,
      // disableHostCheck: true, // the disableHostCheck and allowedHosts options were removed in favor of the firewall option
      host: '0.0.0.0',
      // useLocalIp: true, @breaking: move in favor { host: 'local-ip' } (https://github.com/webpack/webpack-dev-server/releases?page=2)
      hot: 'only',
      https: false,
      // inline: true, // the inline option (iframe live mode) was removed
      open: [publicPath],
      client: {
        overlay: true
      },
      port: 10086,
      // quiet: true, // the log, logLevel, logTime, noInfo, quiet, reporter and warn options were removed in favor of built-in webpack logger, please read this to enable and setup logging output
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [{
          from: /./,
          to: publicPath
        }]
      },
      proxy
    },
    customDevServerOption
  )

  const originalPort = devServerOptions.port
  const availablePort = await detectPort(Number(originalPort))

  if (availablePort !== originalPort) {
    console.log(`ℹ 预览端口 ${originalPort} 被占用, 自动切换到空闲端口 ${availablePort}`)
    devServerOptions.port = availablePort
  }

  return devServerOptions
}
