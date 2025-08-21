import path from 'node:path'

import { defaultMainFields, PLATFORMS, recursiveMerge, REG_NODE_MODULES_DIR } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isBoolean, isNumber, isObject, isString, PLATFORM_TYPE } from '@tarojs/shared'
import { get } from 'lodash'

import { getDefaultPostcssConfig } from '../postcss/postcss.h5'
import { addTrailingSlash, getCSSModulesOptions, getMinify, getMode, getPostcssPlugins, isVirtualModule } from '../utils'
import { DEFAULT_TERSER_OPTIONS, H5_EXCLUDE_POSTCSS_PLUGIN_NAME } from '../utils/constants'
import { getHtmlScript } from '../utils/html'

import type { PostcssOption } from '@tarojs/taro/types/compile'
import type { ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteH5CompilerContext): PluginOption {
  const { taroConfig, cwd: appPath, app, sourceDir } = viteCompilerContext
  const routerMode = taroConfig.router?.mode || 'hash'
  const isMultiRouterMode = routerMode === 'multi'
  const isProd = getMode(taroConfig) === 'production'

  function parsePublicPath(publicPath = '/') {
    return ['', 'auto'].includes(publicPath) ? publicPath : addTrailingSlash(publicPath)
  }

  function getDefineOption() {
    const {
      env = {},
      defineConstants = {},
      framework = 'react',
      buildAdapter = PLATFORMS.H5,
      useDeprecatedAdapterComponent = false
    } = taroConfig

    env.FRAMEWORK = JSON.stringify(framework)
    env.TARO_ENV = JSON.stringify(buildAdapter)
    env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || PLATFORM_TYPE.WEB)
    env.SUPPORT_DINGTALK_NAVIGATE = env.SUPPORT_DINGTALK_NAVIGATE || '"disabled"'
    env.SUPPORT_TARO_POLYFILL = env.SUPPORT_TARO_POLYFILL || '"disabled"'
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

  function getAssetsInlineLimit () :number {
    const urlOptions = get(taroConfig, 'postcss.url', {}) as PostcssOption.url
    const url = urlOptions.config?.url
    const maxSize = urlOptions.config?.maxSize
    // 如果 enable 等于 false，不给转 base64
    if (urlOptions.enable === false) return 0
    if (url === 'inline') {
      // inline 模式下可以转 base64
      let _maxSize = Number.MAX_SAFE_INTEGER
      if (isNumber(maxSize)) _maxSize = maxSize
      return _maxSize
    }
    return 0
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
  let cors: boolean | Record<string, any> = true // 明确声明为联合类型
  const corsOption = (serverOption as any).cors
  if (isBoolean(corsOption) || isObject<Record<string, any>>(corsOption)) {
    cors = corsOption
  }
  let watch: Record<string, any> = {} // 默认值为空对象
  const watchOption = (serverOption as any).watch
  if (isObject<Record<string, any>>(watchOption)) {
    watch = watchOption
  }
  let strictPort = false // 默认值为false
  const strictPortOption = (serverOption as any).strictPort
  if (isBoolean(strictPortOption)) {
    strictPort = strictPortOption
  }
  let middlewareMode: 'ssr' | 'html' | false = false // 默认值为false（禁用中间件模式）
  const middlewareModeOption = (serverOption as any).middlewareMode
  if (middlewareModeOption === 'ssr' || middlewareModeOption === 'html') {
    middlewareMode = middlewareModeOption
  }
  let base: string | undefined // 默认值为undefined
  const baseOption = (serverOption as any).base
  if (isString(baseOption)) {
    let formattedBase = baseOption
    if (!formattedBase.startsWith('/')) {
      formattedBase = '/' + formattedBase
    }
    if (!formattedBase.endsWith('/')) {
      formattedBase += '/'
    }
    base = formattedBase
  }
  let origin = '' // 默认值为空字符串
  const originOption = (serverOption as any).origin
  if (isString(originOption)) {
    origin = originOption
  }
  let fsStrict = true // 默认值为true（自Vite 2.7起默认启用）
  const fsStrictOption = (serverOption as any).strict
  if (isBoolean(fsStrictOption)) {
    fsStrict = fsStrictOption
  }
  let fsAllow: string[] = [] // 默认值为空数组
  const fsAllowOption = (serverOption as any).allow
  if (Array.isArray(fsAllowOption)) {
    fsAllow = fsAllowOption
  }
  let fsDeny: string[] = ['.env', '.env.*', '*.{crt,pem}', '**/.git/**'] // 默认值为安全的黑名单
  const fsDenyOption = (serverOption as any).deny
  if (Array.isArray(fsDenyOption)) {
    fsDeny = fsDenyOption
  }
  const mode = getMode(taroConfig)
  const mainFields = [...defaultMainFields]
  if (!isProd) {
    mainFields.unshift('main:h5')
  }
  let allowedHosts: true | string[] | undefined
  if ((serverOption as any).allowedHosts === true || Array.isArray((serverOption as any).allowedHosts)) {
    allowedHosts = (serverOption as any).allowedHosts
  } else if (isString((serverOption as any).allowedHosts) && (serverOption as any).allowedHosts) {
    allowedHosts = [(serverOption as any).allowedHosts]
  }

  return {
    name: 'taro:vite-h5-config',
    enforce: 'pre',
    config: async () => ({
      root: sourceDir,
      base: parsePublicPath(taroConfig.publicPath),
      mode,
      build: {
        outDir: path.join(appPath, taroConfig.outputRoot as string),
        target: taroConfig.legacy ? undefined : 'es6',
        cssCodeSplit: true,
        emptyOutDir: false,
        watch: taroConfig.isWatch ? {} : null,
        // @TODO doc needed: sourcemapType not supported
        sourcemap: taroConfig.enableSourceMap ?? taroConfig.isWatch ?? !isProd,
        chunkSizeWarningLimit: Number.MAX_SAFE_INTEGER,
        rollupOptions: {
          output: {
            entryFileNames: ({ facadeModuleId }) => {
              if (facadeModuleId?.startsWith(sourceDir)) return 'js/app.[hash].js'
              return 'js/[name].[hash].js'
            },
            chunkFileNames: taroConfig.output!.chunkFileNames,
            assetFileNames: taroConfig.output!.assetFileNames,
            manualChunks(id, { getModuleInfo }) {
              const moduleInfo = getModuleInfo(id)
              const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)

              if (nodeModulesDirRegx.test(id) || /commonjsHelpers\.js$/.test(id)) {
                return 'vendors'
              } else if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1 && !isVirtualModule(id)) {
                return 'common'
              }
            },
          }
        },
        commonjsOptions: {
          exclude: [/\.esm/, /[/\\]esm[/\\]/],
          transformMixedEsModules: true,
        },
        assetsInlineLimit: getAssetsInlineLimit(),
        minify: getMinify(taroConfig),
        terserOptions:
          getMinify(taroConfig) === 'terser'
            ? recursiveMerge({}, DEFAULT_TERSER_OPTIONS, taroConfig.terser?.config || {})
            : undefined,
      },
      define: getDefineOption(),
      resolve: {
        mainFields,
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.vue'],
        alias: getAliasOption(),
        dedupe: ['@tarojs/shared', '@tarojs/runtime'],
      },
      esbuild: {
        jsxDev: false,
      },
      server: {
        host: serverOption.host || '0.0.0.0',
        port: serverOption.port ? Number(serverOption.port) : 10086,
        https: typeof serverOption.https !== 'boolean' ? serverOption.https : undefined,
        open,
        proxy: (serverOption.proxy as any) || {},
        headers,
        hmr,
        watch,
        fs: {
          strict: fsStrict,
          allow: fsAllow,
          deny: fsDeny,
        },
        allowedHosts,
        middlewareMode,
        strictPort,
        base,
        origin,
        cors,
      },
      css: {
        postcss: {
          // @Todo Vite 的 postcss 功能不支持 filter 逻辑，Webpack 里的 filter 逻辑需要判断是否仍需要迁移过来 等待 vite pr 合并
          plugins: getPostcssPlugins(appPath, __postcssOption, H5_EXCLUDE_POSTCSS_PLUGIN_NAME),
          // exclude: postcssExclude
        },
        preprocessorOptions: {
          ...(await getSassOption()),
          less: taroConfig.lessLoaderOption || {},
          stylus: taroConfig.stylusLoaderOption || {},
        },
        modules: getCSSModulesOptions(taroConfig)
      },
    }),

    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        // mpa 模式关于 html 的处理已经解藕到 mpa.ts
        if (isMultiRouterMode) return html
        const { configPath } = app
        const scriptSource = configPath.replace(sourceDir, '')
        const htmlScript = getHtmlScript(scriptSource, pxtransformOption)
        return html.replace(/<script><%= htmlWebpackPlugin.options.script %><\/script>/, htmlScript)
      },
    },
  }
}
