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
import { componentConfig } from './utils/component'
import { bindDevLogger, bindProdLogger, printBuildError } from './utils/logHelper'

import type { Func } from '@tarojs/taro/types/compile'
import type { IModifyChainData } from '@tarojs/taro/types/compile/hooks'
import type { Stats } from 'webpack'
import type { BuildConfig } from './utils/types'

export const customizeChain = async (chain, modifyWebpackChainFunc: Func, customizeFunc?: BuildConfig['webpackChain']) => {
  const data: IModifyChainData = {
    componentConfig
  }
  if (modifyWebpackChainFunc instanceof Function) {
    await modifyWebpackChainFunc(chain, webpack, data)
  }
  if (customizeFunc instanceof Function) {
    customizeFunc(chain, webpack)
  }
}

function errorHandling (errorLevel?: number, stats?: Stats) {
  if (errorLevel === 1 && stats?.hasErrors()) {
    process.exit(1)
  }
}

const buildProd = async (appPath: string, config: BuildConfig, appHelper: AppHelper): Promise<void> => {
  const webpackChain = prodConf(appPath, config, appHelper)
  await customizeChain(webpackChain, config.modifyWebpackChain!, config.webpackChain)
  if (typeof config.onWebpackChainReady === 'function') {
    config.onWebpackChainReady(webpackChain)
  }
  const errorLevel = typeof config.compiler !== 'string' && config.compiler?.errorLevel || 0
  const webpackConfig = webpackChain.toConfig()
  if (config.withoutBuild) return

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
      errorHandling(errorLevel, stats)
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
  const errorLevel = typeof config.compiler !== 'string' && config.compiler?.errorLevel || 0
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
  } else {
    proxy.push(...customProxy)
  }

  if (typeof config.onWebpackChainReady === 'function') {
    config.onWebpackChainReady(webpackChain)
  }

  const devServerOptions = recursiveMerge<WebpackDevServer.Configuration>(
    {
      open: !config.isBuildNativeComp,
      disableHostCheck: true,
      publicPath,
      contentBase: outputPath,
      writeToDisk: config.isBuildNativeComp,
      proxy,
    },
    baseDevServerOption,
    customDevServerOption,
    {
      historyApiFallback: {
        rewrites: [{
          from: /./,
          to: publicPath
        }]
      }
    }
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
  if (config.withoutBuild) return

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
    errorHandling(errorLevel, stats)
  })
  compiler.hooks.failed.tap('taroBuildDone', error => {
    if (typeof onBuildFinish === 'function') {
      onBuildFinish({
        error,
        stats: null,
        isWatch: true
      })
    }
    process.exit(1)
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
