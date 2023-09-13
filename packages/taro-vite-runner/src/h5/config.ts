import { defaultMainFields, recursiveMerge, removeHeadSlash } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isBoolean, isObject, isString } from '@tarojs/shared'
import history from 'connect-history-api-fallback'
import path from 'path'

import { getDefaultPostcssConfig, getPostcssPlugins } from '../postcss/postcss.h5'
import { addTrailingSlash, getMode, isVirtualModule } from '../utils'

import type { CSSModulesOptions, PluginOption } from 'vite'
import type { TaroCompiler } from '../utils/compiler/h5'

const DEFAULT_TERSER_OPTIONS = {
  parse: {
    ecma: 8,
  },
  compress: {
    ecma: 5,
    warnings: false,
    arrows: false,
    collapse_vars: false,
    comparisons: false,
    computed_props: false,
    hoist_funs: false,
    hoist_props: false,
    hoist_vars: false,
    inline: false,
    loops: false,
    negate_iife: false,
    properties: false,
    reduce_funcs: false,
    reduce_vars: false,
    switches: false,
    toplevel: false,
    typeofs: false,
    booleans: true,
    if_return: true,
    sequences: true,
    unused: true,
    conditionals: true,
    dead_code: true,
    evaluate: true,
  },
  output: {
    ecma: 5,
    comments: false,
    ascii_only: true,
  },
}

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

  function getMinify(): 'terser' | 'esbuild' | boolean {
    return taroConfig.mode !== 'production'
      ? false
      : taroConfig.jsMinimizer === 'esbuild'
        ? taroConfig.esbuild?.minify?.enable === false
          ? false // 只有在明确配置了 esbuild.minify.enable: false 时才不启用压缩
          : 'esbuild'
        : taroConfig.terser?.enable === false
          ? false // 只有在明确配置了 terser.enable: false 时才不启用压缩
          : 'terser'
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
      build: {
        outDir: path.join(appPath, taroConfig.outputRoot || 'dist'),
        target: 'es6',
        cssCodeSplit: true,
        emptyOutDir: false,
        watch: taroConfig.isWatch ? {} : null,
        
        // @TODO doc needed: sourcemapType not supported
        sourcemap: taroConfig.enableSourceMap ?? taroConfig.isWatch ?? process.env.NODE_ENV !== 'production',
        rollupOptions: {
          input: { 'pages/answer/answer': path.join(appPath, 'src/index3.html'), 'pages/index/index': path.join(appPath, 'src/index.html') },
          output: {
            entryFileNames: (a)=>{ 
              return a.name
            },
            chunkFileNames: taroConfig.viteOutput!.chunkFileNames,
            assetFileNames: taroConfig.viteOutput!.assetFileNames,
            manualChunks(id, { getModuleInfo }) {
              const moduleInfo = getModuleInfo(id)
              if (/[\\/]node_modules[\\/]/.test(id) || /commonjsHelpers\.js$/.test(id)) {
                return 'vendors'
              } else if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1 && !isVirtualModule(id)) {
                return 'common'
              }
            },
          },
        },
        commonjsOptions: {
          exclude: [/\.esm/, /[/\\]esm[/\\]/],
          transformMixedEsModules: true,
        },

        minify: getMinify(),
        terserOptions:
          getMinify() === 'terser'
            ? recursiveMerge({}, DEFAULT_TERSER_OPTIONS, taroConfig.terser?.config || {})
            : undefined,
      },
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

    transformIndexHtml: {
      enforce: 'pre',
      transform(html, ctx) {
        debugger
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
      } 
    },
  }
}

