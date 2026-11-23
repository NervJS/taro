import path from 'node:path'

import { recursiveMerge, SOURCE_DIR } from '@tarojs/helper'
import detectPort from 'detect-port'

import AppHelper from './app'
import { addHtmlSuffix, addLeadingSlash, parsePublicPath, stripBasename, stripTrailingSlash } from './utils'

export interface BuildH5DevServerConfig {
  publicPath?: string
  outputRoot?: string
  sourceRoot?: string
  devServer?: Record<string, any>
  router?: {
    mode?: string
    basename?: string
    customRoutes?: Record<string, string | string[]>
  }
  entry?: Record<string, any>
  frameworkExts?: string[]
  entryFileName?: string
  alias?: Record<string, any>
  defineConstants?: Record<string, any>
  output?: Record<string, any>
  chunkDirectory?: string
  isBuildNativeComp?: boolean
}

export async function getH5DevServerOptions<T = Record<string, any>> (
  appPath: string,
  config: BuildH5DevServerConfig,
  normalizeLegacyHttps = false
): Promise<T> {
  const publicPath = parsePublicPath(config.publicPath)
  const outputPath = path.join(appPath, config.outputRoot || 'dist')
  const { proxy: customProxy = [], https: legacyHttps, ...customDevServerOption } = (config.devServer || {}) as any
  const routerConfig = config.router || {}
  const routerMode = routerConfig.mode || 'hash'
  const isMultiRouterMode = routerMode === 'multi'
  const proxy: any[] = []

  if (isMultiRouterMode) {
    const app = new AppHelper(config.entry as Record<string, any>, {
      sourceDir: path.join(appPath, config.sourceRoot || SOURCE_DIR),
      frameworkExts: config.frameworkExts,
      entryFileName: config.entryFileName,
      alias: config.alias,
      defineConstants: config.defineConstants
    })
    const appConfig = app.appConfig
    const customRoutes = routerConfig.customRoutes || {}
    const routerBasename = routerConfig.basename || '/'
    const getEntriesRoutes = (routes: Record<string, string | string[]> = {}) => {
      const conf: string[][] = []
      for (let key in routes) {
        const routePath = routes[key]
        key = addLeadingSlash(key)
        if (typeof routePath === 'string') {
          conf.push([key, addLeadingSlash(routePath)])
        } else if (routePath?.length > 0) {
          conf.push(...routePath.map(p => [key, addLeadingSlash(p)]))
        }
      }
      return conf
    }
    const bypass = (req: any) => {
      if (req.headers.accept?.indexOf('html') !== -1) {
        const pagePath = stripTrailingSlash(stripBasename(req.path, routerBasename))
        const getBypassUrl = (url: string) => addHtmlSuffix(addLeadingSlash(url))
        if (pagePath === '') {
          return getBypassUrl(appConfig.entryPagePath || appConfig.pages?.[0] || 'index')
        }

        const pageIdx = (appConfig.pages ?? []).findIndex(e => addLeadingSlash(e) === pagePath)
        if (pageIdx > -1) {
          return getBypassUrl(appConfig.pages?.[pageIdx] || '')
        }

        const customRoutesConf = getEntriesRoutes(customRoutes)
        const idx = customRoutesConf.findIndex(list => list[1] === pagePath)
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

  if (!Array.isArray(customProxy)) {
    proxy.push(...Object.entries(customProxy).map(([url, options = {}]) => {
      const item: Record<string, any> = {
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

  const chunkFilename = (config.output?.chunkFilename as string) ?? `${config.chunkDirectory || 'chunk'}/[name].js`
  const baseDefaults: Record<string, any> = {
    allowedHosts: 'all',
    devMiddleware: {
      publicPath
    },
    static: [{
      directory: outputPath, // webpack4: devServerOptions.contentBase
      publicPath,
      watch: true // webpack4: devServerOptions.watchContentBase
    }],
    compress: true,
    host: '0.0.0.0',
    hot: config.isBuildNativeComp ? true : 'only',
    client: {
      overlay: true
    },
    port: 10086,
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [{
        from: /\.hot-update\.(js|json)$/,
        to: function (context: any) {
          const pathname = chunkFilename.replace('[name]', path.basename(context.parsedUrl.pathname).replace(/\.[^.]*.hot-update\.(js|json)/, ''))
          return (['', 'auto'].includes(publicPath) ? '' : publicPath) + pathname
        }
      }]
    },
    proxy
  }
  if (!normalizeLegacyHttps) {
    baseDefaults.https = legacyHttps ?? false
  }

  const devServerOptions: Record<string, any> = recursiveMerge<any>(
    baseDefaults,
    customDevServerOption,
    {
      historyApiFallback: {
        rewrites: [{ from: /./, to: publicPath }]
      }
    }
  )

  if (normalizeLegacyHttps) {
    if (legacyHttps && !devServerOptions.server) {
      devServerOptions.server = typeof legacyHttps === 'object'
        ? { type: 'https', options: legacyHttps }
        : 'https'
    }
    delete devServerOptions.https
  }

  const originalPort = Number(devServerOptions.port)
  const availablePort = await detectPort(originalPort)

  if (availablePort !== originalPort) {
    // eslint-disable-next-line no-console
    console.log(`ℹ 预览端口 ${originalPort} 被占用, 自动切换到空闲端口 ${availablePort}`)
    devServerOptions.port = availablePort
  }

  return devServerOptions as T
}
