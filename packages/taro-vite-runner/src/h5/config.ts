import { defaultMainFields, recursiveMerge, removeHeadSlash } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isBoolean, isObject, isString } from '@tarojs/shared'
import history from 'connect-history-api-fallback'
import path from 'path'

import { getDefaultPostcssConfig, getPostcssPlugins } from '../postcss/postcss.h5'
import { addTrailingSlash, getMode } from '../utils'

import type { CSSModulesOptions, PluginOption } from 'vite'
import type { TaroCompiler } from '../utils/compiler/h5'

export default function (complier: TaroCompiler): PluginOption {
  const { taroConfig, cwd: appPath, pages, app, sourceDir } = complier
  const routerMode = taroConfig.router?.mode || 'hash'
  const basename = taroConfig.router?.basename || ''
  const isMultiRouterMode = routerMode === 'multi'
  function parsePublicPath(publicPath = '/') {
    return ['', 'auto'].includes(publicPath) ? publicPath : addTrailingSlash(publicPath)
  }

  function getDefineOption() {
    const { env = {}, defineConstants = {}, useDeprecatedAdapterComponent = false } = taroConfig

    env.SUPPORT_DINGTALK_NAVIGATE = env.SUPPORT_DINGTALK_NAVIGATE || '"disabled"'
    const envConstants = Object.keys(env).reduce((target, key) => {
      target[`process.env.${key}`] = env[key]
      return target
    }, {})

    defineConstants.DEPRECATED_ADAPTER_COMPONENT = JSON.stringify(!!useDeprecatedAdapterComponent)

    return {
      ...envConstants,
      ...defineConstants,
    }
  }

  function getAliasOption() {
    const alias = taroConfig.alias || {}
    return Object.entries(alias).map(([find, replacement]) => {
      return { find, replacement }
    })
  }

  async function getSassOption() {
    const sassLoaderOption = taroConfig.sassLoaderOption
    const option = {
      ...(await getSassLoaderOption(taroConfig)),
      ...sassLoaderOption,
    }
    return {
      scss: option,
      sass: option,
    }
  }

  function getCSSModulesOptions(): false | CSSModulesOptions {
    if (taroConfig.postcss?.cssModules?.enable !== true) return false
    const config = recursiveMerge(
      {},
      {
        namingPattern: 'module',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      taroConfig.postcss.cssModules.config
    )
    return {
      generateScopedName: config.generateScopedName,
    }
  }

  function createRewire(
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

  const __postcssOption = getDefaultPostcssConfig({
    designWidth: taroConfig.designWidth,
    deviceRatio: taroConfig.deviceRatio,
    option: taroConfig.postcss,
    esnextModules: taroConfig.esnextModules || []
  })
  const [, pxtransformOption] = __postcssOption.find(([name]) => name === 'postcss-pxtransform') || []
  const serverOption = taroConfig.devServer || {}
  let headers = {}
  if (isObject<Record<string, any>>(serverOption.headers)) {
    headers = serverOption.headers
  }
  let hmr = true
  if (isBoolean(serverOption.hot)) {
    hmr = serverOption.hot
  }
  let open: string | boolean = true
  if (isBoolean(serverOption.open) || isString(serverOption.open)) {
    open = serverOption.open
  }
  const mode = getMode(taroConfig)
  const mainFields = [...defaultMainFields]
  if (mode !== 'production') {
    mainFields.unshift('main:h5')
  }

  return {
    name: 'taro:vite-h5-config',
    enforce: 'pre',
    config: async () => ({
      root: path.join(appPath, taroConfig.sourceRoot || 'src'),
      base: parsePublicPath(taroConfig.publicPath),
      mode,
      outDir: taroConfig.outputRoot || 'dist',
      define: getDefineOption(),
      resolve: {
        mainFields,
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue'],
        alias: getAliasOption(),
        dedupe: ['@tarojs/shared', '@tarojs/runtime'],
      },
      esbuild: {
        jsxDev: false,
      },
      server: {
        host: serverOption.host || '0.0.0.0',
        port: serverOption.port ? Number(serverOption.port) : 10086,
        https: serverOption.https || false,
        open,
        proxy: (serverOption.proxy as any) || {},
        headers,
        hmr,
      },
      css: {
        postcss: {
          // @Todo Vite 的 postcss 功能不支持 filter 逻辑，Webpack 里的 filter 逻辑需要判断是否仍需要迁移过来 等待 vite pr 合并
          plugins: getPostcssPlugins(appPath, __postcssOption),
          // exclude: postcssExclude
        },
        preprocessorOptions: {
          ...(await getSassOption()),
          less: taroConfig.lessLoaderOption || {},
          stylus: taroConfig.stylusLoaderOption || {},
        },
        modules: getCSSModulesOptions()
      },
    }),

    configureServer(server){
      if (!isMultiRouterMode) return
      const rewrites: { from: RegExp, to: any }[] = []
      const proxy = server.config.server.proxy || {}
      const proxyKeys = Object.keys(proxy)
      const baseUrl = server.config.base ?? '/'
      pages.forEach(({ name })=> {
        const pageName = removeHeadSlash(path.join(basename, name))
        rewrites.push(createRewire(pageName, baseUrl, proxyKeys))
      })
      server.middlewares.use(history({          
        disableDotRule: undefined,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        rewrites: rewrites
      }) )
    },

    transformIndexHtml(html, ctx) {
      const { configPath } = app
      let srciptSource = configPath.replace(sourceDir, '')
      // mpa 模式
      if (isMultiRouterMode) {
        const { originalUrl } = ctx
        const page = pages.filter(({ name })=> originalUrl?.startsWith(`/${removeHeadSlash(path.join(basename, name))}`))?.[0]
        if (page) {
          srciptSource = page.configPath.replace(sourceDir, '')
          const pageName = page.name
          complier.setPageName(pageName)
        } else {
          complier.setPageName('')
        }
      }
      let htmlScript = ''
      const options = pxtransformOption?.config || {}
      const max = options?.maxRootSize ?? 40
      const min = options?.minRootSize ?? 20
      const baseFontSize = options?.baseFontSize || (min > 1 ? min : 20)
      const designWidth = ((input) =>
        typeof options.designWidth === 'function' ? options.designWidth(input) : options.designWidth)(baseFontSize)
      const rootValue = (baseFontSize / options.deviceRatio[designWidth]) * 2

      if ((options?.targetUnit ?? 'rem') === 'rem') {
        htmlScript = `<script>!function(n){function f(){var e=n.document.documentElement,w=e.getBoundingClientRect().width,x=${rootValue}*w/${designWidth};e.style.fontSize=x>=${max}?"${max}px":x<=${min}?"${min}px":x+"px"}n.addEventListener("resize",(function(){f()})),f()}(window);</script>\n`
      }
      htmlScript += `  <script type="module" src="${srciptSource}"></script>`

      return html.replace(/<script><%= htmlWebpackPlugin.options.script %><\/script>/, htmlScript)
    },
  }
}

