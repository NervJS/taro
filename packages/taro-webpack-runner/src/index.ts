import { recursiveMerge, SOURCE_DIR } from '@tarojs/helper'
import * as detectPort from 'detect-port'
import * as path from 'path'
import { format as formatUrl } from 'url'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'

import buildConf from './config/build.conf'
import devConf from './config/dev.conf'
import baseDevServerOption from './config/devServer.conf'
import prodConf from './config/prod.conf'
import { addHtmlSuffix, addLeadingSlash, AppHelper, formatOpenHost, parsePublicPath, stripBasename, stripTrailingSlash } from './utils'
import { makeConfig } from './utils/chain'
import { bindDevLogger, bindProdLogger, printBuildError } from './utils/logHelper'

import type { Func } from '@tarojs/taro/types/compile'
import type { BuildConfig } from './utils/types'

export const customizeChain = async (chain, modifyWebpackChainFunc: Func, customizeFunc?: Func) => {
  if (modifyWebpackChainFunc instanceof Function) {
    await modifyWebpackChainFunc(chain, webpack)
  }
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack)
  }
}

const buildProd = async (appPath: string, config: BuildConfig, appHelper: AppHelper): Promise<void> => {
  const webpackChain = prodConf(appPath, config, appHelper)
  await customizeChain(webpackChain, config.modifyWebpackChain!, config.webpackChain)
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

const buildDev = async (appPath: string, config: BuildConfig, appHelper: AppHelper): Promise<any> => {
  const conf = buildConf(config)
  const routerConfig = config.router || {}
  const routerMode = routerConfig.mode || 'hash'
  const routerBasename = routerConfig.basename || '/'
  const publicPath = parsePublicPath(conf.publicPath)
  const outputPath = path.join(appPath, conf.outputRoot as string)
  const { proxy: customProxy = [], ...customDevServerOption } = config.devServer || {}
  const webpackChain = devConf(appPath, config, appHelper)
  const onBuildFinish = config.onBuildFinish
  await customizeChain(webpackChain, config.modifyWebpackChain!, config.webpackChain)

  const isMultiRouterMode = routerMode === 'multi'
  const proxy: WebpackDevServer.Configuration['proxy'] = []
  if (isMultiRouterMode) {
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
    const bypass = req => {
      if (req.headers.accept?.indexOf('html') !== -1) {
        const pagePath = stripTrailingSlash(stripBasename(req.path, routerBasename))
        if (pagePath === '') {
          return addHtmlSuffix(appHelper.appConfig.entryPagePath || appHelper.appConfig.pages?.[0])
        }

        const pageIdx = (appHelper.appConfig.pages ?? []).findIndex(e => addLeadingSlash(e) === pagePath)
        if (pageIdx > -1) {
          return addHtmlSuffix(appHelper.appConfig.pages?.[pageIdx])
        }

        const customRoutesConf = getEntriesRoutes(customRoutes)
        const idx = getEntriesRoutes(customRoutes).findIndex(list => list[1] === pagePath)
        if (idx > -1) {
          // NOTE: 自定义路由
          return addHtmlSuffix(customRoutesConf[idx][0])
        }
      }
    }
    proxy.push({
      context: [routerBasename],
      bypass
    } as WebpackDevServer.ProxyConfigArrayItem)
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

  if (typeof config.onWebpackChainReady === 'function') {
    config.onWebpackChainReady(webpackChain)
  }

  const devServerOptions = config.isBuildNativeComp
    ? { writeToDisk: true }
    : recursiveMerge<WebpackDevServer.Configuration>(
      {
        publicPath,
        contentBase: outputPath,
        historyApiFallback: {
          rewrites: [{
            from: /./,
            to: publicPath
          }]
        },
        proxy,
      },
      baseDevServerOption,
      customDevServerOption
    )
  if (devServerOptions.proxy?.length < 1) {
    // Note: proxy 不可以为空数组
    delete devServerOptions.proxy
  }

  if (devServerOptions.host === 'localhost') {
    devServerOptions.useLocalIp = false
  }

  const originalPort = Number(devServerOptions.port)
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
  bindDevLogger(compiler, devUrl)
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
    })
  })
}

export default async (appPath: string, config: BuildConfig): Promise<void> => {
  const newConfig: BuildConfig = await makeConfig(config)
  const app = new AppHelper(newConfig.entry, {
    sourceDir: path.join(appPath, config.sourceRoot || SOURCE_DIR),
    frameworkExts: newConfig.frameworkExts,
    entryFileName: newConfig.entryFileName
  })
  if (newConfig.isWatch) {
    try {
      await buildDev(appPath, newConfig, app)
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      await buildProd(appPath, newConfig, app)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }
}
