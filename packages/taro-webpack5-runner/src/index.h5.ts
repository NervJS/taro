import { chalk, recursiveMerge, SOURCE_DIR } from '@tarojs/helper'
import { isFunction } from '@tarojs/shared'
import Prebundle from '@tarojs/webpack5-prebundle'
import detectPort from 'detect-port'
import path from 'path'
import { format as formatUrl } from 'url'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import { addHtmlSuffix, addLeadingSlash, formatOpenHost, parsePublicPath, stripBasename, stripTrailingSlash } from './utils'
import AppHelper from './utils/app'
import { bindDevLogger, bindProdLogger, printBuildError } from './utils/logHelper'
import { H5Combination } from './webpack/H5Combination'

import type { EntryNormalized, Stats } from 'webpack'
import type { H5BuildConfig } from './utils/types'

export default async function build (appPath: string, rawConfig: H5BuildConfig): Promise<Stats | void> {
  const combination = new H5Combination(appPath, rawConfig)
  await combination.make()

  const { chunkDirectory = 'chunk', devServer, enableSourceMap, entryFileName = 'app', entry = {}, publicPath } = combination.config
  if (!combination.isBuildNativeComp) {
    const prebundle = new Prebundle({
      appPath,
      sourceRoot: combination.sourceRoot,
      chain: combination.chain,
      chunkDirectory,
      devServer,
      enableSourceMap,
      entryFileName,
      entry,
      isWatch: combination.config.isWatch,
      publicPath
    })
    try {
      await prebundle.run(combination.getPrebundleOptions())
    } catch (error) {
      console.error(error)
      console.warn(chalk.yellow('依赖预编译失败，已经为您跳过预编译步骤，但是编译速度可能会受到影响。'))
    }
  }

  const webpackConfig = combination.chain.toConfig()
  const config = combination.config
  const { isWatch } = config

  try {
    if (!isWatch) {
      const compiler = webpack(webpackConfig)
      compiler.hooks.emit.tapAsync('taroBuildDone', async (compilation, callback) => {
        if (isFunction(config.modifyBuildAssets)) {
          await config.modifyBuildAssets(compilation.assets)
        }
        callback()
      })
      return new Promise<Stats>((resolve, reject) => {
        bindProdLogger(compiler)

        compiler.run((error, stats: Stats) => {
          compiler.close(error2 => {
            const err = error || error2

            if (isFunction(config.onBuildFinish)) {
              config.onBuildFinish({
                error: err,
                stats: err ? null : stats,
                isWatch: false
              })
            }

            err ? reject(err) : resolve(stats)
          })
        })
      })
    } else {
      config.devServer = recursiveMerge(config.devServer || {}, webpackConfig.devServer)
      config.output = webpackConfig.output
      const routerConfig = config.router || {}
      const routerMode = routerConfig.mode || 'hash'
      const routerBasename = routerConfig.basename || '/'
      webpackConfig.devServer = await getDevServerOptions(appPath, config)

      const devUrl = formatUrl({
        protocol: webpackConfig.devServer?.https ? 'https' : 'http',
        hostname: formatOpenHost(webpackConfig.devServer?.host),
        port: webpackConfig.devServer?.port,
        pathname: routerMode === 'browser' ? routerBasename : '/'
      })
      if (typeof webpackConfig.devServer.open === 'undefined') {
        webpackConfig.devServer.open = devUrl
      }

      const compiler = webpack(webpackConfig)
      const server = new WebpackDevServer(webpackConfig.devServer, compiler)
      bindDevLogger(compiler, devUrl)

      compiler.hooks.emit.tapAsync('taroBuildDone', async (compilation, callback) => {
        if (isFunction(config.modifyBuildAssets)) {
          await config.modifyBuildAssets(compilation.assets)
        }
        callback()
      })
      compiler.hooks.done.tap('taroBuildDone', stats => {
        if (isFunction(config.onBuildFinish)) {
          config.onBuildFinish({
            error: null,
            stats,
            isWatch: true
          })
        }
      })
      compiler.hooks.failed.tap('taroBuildDone', error => {
        if (isFunction(config.onBuildFinish)) {
          config.onBuildFinish({
            error,
            stats: null,
            isWatch: true
          })
        }
      })

      return new Promise<void>((resolve, reject) => {
        server.startCallback(err => {
          if (err) {
            printBuildError(err)
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
  if (config.isBuildNativeComp) {
    return {
      devMiddleware: {
        writeToDisk: true
      }
    }
  }
  const publicPath = parsePublicPath(config.publicPath)
  const outputPath = path.join(appPath, config.outputRoot || 'dist')
  const { proxy: customProxy = [], ...customDevServerOption } = config.devServer || {}
  const routerConfig = config.router || {}
  const routerMode = routerConfig.mode || 'hash'
  const isMultiRouterMode = routerMode === 'multi'
  const proxy: WebpackDevServer.Configuration['proxy'] = []
  if (isMultiRouterMode) {
    const app = new AppHelper(config.entry as EntryNormalized, {
      sourceDir: path.join(appPath, config.sourceRoot || SOURCE_DIR),
      frameworkExts: config.frameworkExts,
      entryFileName: config.entryFileName
    })
    const appConfig = app.appConfig
    const customRoutes = routerConfig.customRoutes || {}
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
        const getBypassUrl = url => addHtmlSuffix(addLeadingSlash(url))
        if (pagePath === '') {
          return getBypassUrl(appConfig.entryPagePath || appConfig.pages?.[0])
        }

        const pageIdx = (appConfig.pages ?? []).findIndex(e => addLeadingSlash(e) === pagePath)
        if (pageIdx > -1) {
          return getBypassUrl(appConfig.pages?.[pageIdx])
        }

        const customRoutesConf = getEntriesRoutes(customRoutes)
        const idx = getEntriesRoutes(customRoutes).findIndex(list => list[1] === pagePath)
        if (idx > -1) {
          // NOTE: 自定义路由
          return getBypassUrl(customRoutesConf[idx][0])
        }
      }
    }
    proxy.push({
      context: [routerBasename],
      bypass
    })
  }

  if (!(customProxy instanceof Array)) {
    proxy.push(...Object.entries(customProxy).map(([url, options = {}]) => {
      const item: WebpackDevServer.ProxyConfigArrayItem = {
        context: [url]
      }
      if (typeof options === 'string') {
        item.target = options
      } else {
        Object.assign(item, options)
      }
      return item
    }))
  }

  const chunkFilename = config.output?.chunkFilename as string ?? `${config.chunkDirectory || 'chunk'}/[name].js`
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
      client: {
        overlay: true
      },
      port: 10086,
      // quiet: true, // the log, logLevel, logTime, noInfo, quiet, reporter and warn options were removed in favor of built-in webpack logger, please read this to enable and setup logging output
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [{
          from: /\.hot-update\.(js|json)$/,
          to: function (context) {
            const pathname = chunkFilename.replace('[name]', path.basename(context.parsedUrl.pathname).replace(/\.[^.]*.hot-update\.(js|json)/, ''))
            return (['', 'auto'].includes(publicPath) ? '' : publicPath) + pathname
          }
        }, {
          from: /./,
          to: publicPath
        }]
      },
      proxy
    },
    customDevServerOption
  )

  const originalPort = Number(devServerOptions.port)
  const availablePort = await detectPort(originalPort)

  if (availablePort !== originalPort) {
    console.log(`ℹ 预览端口 ${originalPort} 被占用, 自动切换到空闲端口 ${availablePort}`)
    devServerOptions.port = availablePort
  }

  return devServerOptions
}
