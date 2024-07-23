import path from 'node:path'

import { fs, removeHeadSlash } from '@tarojs/helper'
import history from 'connect-history-api-fallback'

import { getDefaultPostcssConfig } from '../postcss/postcss.h5'
import { appendVirtualModulePrefix, generateQueryString, genRouterResource, getMode, getQueryParams } from '../utils'
import { ENTRY_QUERY, PAGENAME_QUERY } from '../utils/constants'
import { getHtmlScript } from '../utils/html'

import type { ViteH5CompilerContext, VitePageMeta } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteH5CompilerContext): PluginOption {
  const { pages, taroConfig, cwd: appPath, sourceDir, app } = viteCompilerContext
  const basename = taroConfig.router?.basename || ''
  const htmlTemplate = fs.readFileSync(path.join(appPath, taroConfig.sourceRoot || 'src', 'index.html')).toString()
  const isProd = getMode(taroConfig) === 'production'

  const __postcssOption = getDefaultPostcssConfig({
    designWidth: taroConfig.designWidth,
    deviceRatio: taroConfig.deviceRatio,
    option: taroConfig.postcss,
    esnextModules: taroConfig.esnextModules || []
  })

  const [, pxtransformOption] = __postcssOption.find(([name]) => name === 'postcss-pxtransform') || []

  function createRewire (
    reg: string,
    baseUrl: string,
    proxyUrlKeys: string[],
  ) {
    return {
      from: new RegExp(`/${reg}.html`),
      to({ parsedUrl }) {
        const pathname: string = parsedUrl.pathname
        const excludeBaseUrl = pathname.replace(baseUrl, '/')
        const template = path.resolve(baseUrl, 'index.html')
        if (excludeBaseUrl === '/') {
          return template
        }
        const isApiUrl = proxyUrlKeys.some((item) =>
          pathname.startsWith(path.resolve(baseUrl, item)),
        )
        return isApiUrl ? excludeBaseUrl : template
      },
    }
  }

  function getIsHtmlEntry (pathName: string) {
    return pages.some(({ name }) => {
      const pageName = removeHeadSlash(path.join(basename, name))
      const htmlPath = path.join(appPath, taroConfig.sourceRoot || 'src', `${pageName}.html`)
      return htmlPath === pathName
    })
  }

  function getInput() {
    const input = {}
    pages.forEach((page) => {
      const { name } = page
      const pageName = removeHeadSlash(path.join(basename, name))
      const htmlPath = path.join(appPath, taroConfig.sourceRoot || 'src', `${pageName}.html`)
      input[pageName] = htmlPath
    })
    return input
  }

  return {
    name: 'taro:vite-h5-mpa',
    enforce: 'pre',
    buildStart () {
      const getRoutesConfig = (pageName: string) => {
        const page = pages.find(({ name }) => name === pageName) || pages[0] as VitePageMeta
        const routesConfig = [
          'config.routes = []',
          `config.route = ${genRouterResource(page)}`,
          `config.pageName = "${pageName}"`
        ].join('\n')
        return routesConfig
      }
      viteCompilerContext.routerMeta = {
        routerCreator: 'createMultiRouter',
        getRoutesConfig
      }
    },
    config: () => ({
      build: {
        rollupOptions: {
          input: getInput(),
          output: {
            entryFileNames: (chunkInfo) => `js/${chunkInfo.name}.[hash].js`
          }
        }
      }
    }),
    configureServer (server) {
      const rewrites: { from: RegExp, to: any }[] = []
      const proxy = server.config.server.proxy || {}
      const proxyKeys = Object.keys(proxy)
      const baseUrl = server.config.base ?? '/'
      pages.forEach(({ name }) => {
        const pageName = removeHeadSlash(path.join(basename, name))
        rewrites.push(createRewire(pageName, baseUrl, proxyKeys))
      })
      server.middlewares.use(history({
        disableDotRule: undefined,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        rewrites: rewrites
      }))
    },
    async resolveId (source, importer, options) {
      // 处理 html 文件
      const isEntry = getIsHtmlEntry(source)
      if (isEntry) return source

      // 处理 config.ts 入口文件
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true })
      if (resolved?.id && pages.some(({ configPath }) => resolved.id.startsWith(configPath))) {
        // mpa 模式，入口文件为每个page下的config
        const queryParams = getQueryParams(source)
        const pageName = queryParams?.[PAGENAME_QUERY]
        const pureId = path.parse(resolved.id).dir
        const params = {
          [ENTRY_QUERY]: 'true',
          [PAGENAME_QUERY]: pageName as string
        }
        const queryString = generateQueryString(params)
        return appendVirtualModulePrefix(pureId + `?${queryString}`)
      }

      return null
    },
    load (id) {
      // 处理 html 文件
      const isEntryHtml = getIsHtmlEntry(id)
      if (isEntryHtml) return htmlTemplate
    },
    transformIndexHtml: {
      enforce: 'pre',
      transform(html, ctx) {
        const { originalUrl, path: filePath } = ctx
        const { configPath } = app
        let srciptSource = configPath.replace(sourceDir, '')
        let page
        if (isProd) {
          page = pages.filter(({ name }) => filePath?.startsWith(`/${removeHeadSlash(path.join(basename, name))}`))?.[0]
        } else {
          page = pages.filter(({ name }) => originalUrl?.startsWith(`/${removeHeadSlash(path.join(basename, name))}`))?.[0]
        }
        if (page) {
          const params = { [PAGENAME_QUERY]: page.name }
          const queryString = generateQueryString(params)
          srciptSource = page.configPath.replace(sourceDir, '') + `?${queryString}`
        }
        const htmlScript = getHtmlScript(srciptSource, pxtransformOption)

        return html.replace(/<script><%= htmlWebpackPlugin.options.script %><\/script>/, htmlScript)
      }
    },
  }
}
