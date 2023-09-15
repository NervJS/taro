import { defaultMainFields, recursiveMerge } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isBoolean, isObject, isString } from '@tarojs/shared'
import path from 'path'

import { getDefaultPostcssConfig, getPostcssPlugins } from '../postcss/postcss.h5'
import { addTrailingSlash, getMode, isVirtualModule } from '../utils'
import { DEFAULT_TERSER_OPTIONS } from '../utils/constants'
import { getHtmlScript } from '../utils/html'

import type { ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { CSSModulesOptions, PluginOption } from 'vite'


export default function (viteCompilerContext: ViteH5CompilerContext): PluginOption {
  const { taroConfig, cwd: appPath, app, sourceDir } = viteCompilerContext
  const routerMode = taroConfig.router?.mode || 'hash'
  const isMultiRouterMode = routerMode === 'multi'
  const isProd = getMode(taroConfig) === 'production'

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

  function getMinify(): 'terser' | 'esbuild' | boolean {
    return !isProd
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
  if (!isProd) {
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
        sourcemap: taroConfig.enableSourceMap ?? taroConfig.isWatch ?? !isProd,
        rollupOptions: {
          output: {
            entryFileNames: 'js/app.[hash].js',
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


    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        // mpa 模式关于 html 的处理已经解藕到 mpa.ts
        if (isMultiRouterMode) return html
        const { configPath } = app
        const srciptSource = configPath.replace(sourceDir, '')
        const htmlScript = getHtmlScript(srciptSource, pxtransformOption)
        return html.replace(/<script><%= htmlWebpackPlugin.options.script %><\/script>/, htmlScript)
      } 
    },
  }
}

