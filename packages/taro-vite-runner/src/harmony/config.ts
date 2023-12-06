import { babel } from '@rollup/plugin-babel'
import inject, { type RollupInjectOptions } from '@rollup/plugin-inject'
import { defaultMainFields, fs, PLATFORMS, recursiveMerge } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isArray, PLATFORM_TYPE } from '@tarojs/shared'
import path from 'path'

import { getDefaultPostcssConfig } from '../postcss/postcss.harmony'
import { getBabelOption, getCSSModulesOptions, getMinify, getMode, getPostcssPlugins, isVirtualModule, stripMultiPlatformExt } from '../utils'
import { DEFAULT_TERSER_OPTIONS, HARMONY_SCOPES } from '../utils/constants'
import { logger } from '../utils/logger'
import { TARO_COMP_SUFFIX } from './entry'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { InputPluginOption } from 'rollup'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  const { taroConfig, cwd: appPath } = viteCompilerContext
  function getDefineOption() {
    const {
      buildAdapter = PLATFORMS.HARMONY,
      env = {},
      defineConstants = {},
      framework = 'react',
      // @ts-ignore
      runtime = {} as Record<string, boolean>,
    } = taroConfig

    env.FRAMEWORK = JSON.stringify(framework)
    env.TARO_ENV = JSON.stringify(buildAdapter)
    env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || env.TARO_PLATFORM || PLATFORM_TYPE.HARMONY)
    env.TARO_VERSION = JSON.stringify(process.env.TARO_VERSION || env.TARO_VERSION)
    env.NODE_ENV = JSON.stringify(process.env.NODE_ENV || env.NODE_ENV || 'development')
    const envConstants = Object.keys(env).reduce((target, key) => {
      target[`process.env.${key}`] = env[key]
      return target
    }, {})

    // FIXME 小程序运行时包含的变量，后续需要从鸿蒙运行时中排除
    const runtimeConstants = {
      ENABLE_INNER_HTML: runtime.enableInnerHTML ?? true,
      ENABLE_ADJACENT_HTML: runtime.enableAdjacentHTML ?? false,
      ENABLE_SIZE_APIS: runtime.enableSizeAPIs ?? false,
      ENABLE_TEMPLATE_CONTENT: runtime.enableTemplateContent ?? false,
      ENABLE_CLONE_NODE: runtime.enableCloneNode ?? false,
      ENABLE_CONTAINS: runtime.enableContains ?? false,
      ENABLE_MUTATION_OBSERVER: runtime.enableMutationObserver ?? false,
    }

    return {
      ...envConstants,
      ...defineConstants,
      ...runtimeConstants,
    }
  }

  function getAliasOption() {
    const { alias = {} } = taroConfig
    return Object.entries(alias).map(([find, replacement]) => {
      return { find, replacement }
    })
  }

  function getInjectOption(): RollupInjectOptions {
    const options: RollupInjectOptions = {
      window: ['@tarojs/runtime', 'window'],
      document: ['@tarojs/runtime', 'document'],
      navigator: ['@tarojs/runtime', 'navigator'],
      requestAnimationFrame: ['@tarojs/runtime', 'requestAnimationFrame'],
      cancelAnimationFrame: ['@tarojs/runtime', 'cancelAnimationFrame'],
      Element: ['@tarojs/runtime', 'TaroElement'],
      SVGElement: ['@tarojs/runtime', 'SVGElement'],
      MutationObserver: ['@tarojs/runtime', 'MutationObserver'],
      history: ['@tarojs/runtime', 'history'],
      location: ['@tarojs/runtime', 'location'],
      URLSearchParams: ['@tarojs/runtime', 'URLSearchParams'],
      getComputedStyle: ['@tarojs/runtime', 'getComputedStyle'],
      URL: ['@tarojs/runtime', 'URL'],
      wx: ['@tarojs/taro', 'default'],
      getCurrentPages: ['@tarojs/taro', 'getCurrentPages']
    }

    const injectOptions = taroConfig.injectOptions

    if (injectOptions?.include) {
      for (const key in injectOptions.include) {
        options[key] = injectOptions.include[key]
      }
    }

    if (injectOptions?.exclude?.length) {
      injectOptions.exclude.forEach((item) => {
        delete options[item]
      })
    }

    return options
  }

  const __postcssOption = getDefaultPostcssConfig({
    designWidth: taroConfig.designWidth || 750,
    deviceRatio: taroConfig.deviceRatio,
    postcssOption: taroConfig.postcss,
  })

  async function getSassOption() {
    const sassLoaderOption = taroConfig.sassLoaderOption
    const nativeStyleImporter = function importer(url, prev, done) {
      // 让 sass 文件里的 @import 能解析小程序原生样式文体，如 @import "a.wxss";
      const extname = path.extname(url)
      // fix: @import 文件可以不带scss/sass缀，如: @import "define";
      if (extname === '.scss' || extname === '.sass' || extname === '.css' || !extname) {
        return null
      } else {
        const filePath = path.resolve(path.dirname(prev), url)
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            logger.error(err.message)
            return null
          } else {
            fs.readFile(filePath)
              .then((res) => {
                done({ contents: res.toString() })
              })
              .catch((err) => {
                logger.error(err)
                return null
              })
          }
        })
      }
    }
    const importer = [nativeStyleImporter]
    if (sassLoaderOption?.importer) {
      isArray(sassLoaderOption.importer)
        ? importer.unshift(...sassLoaderOption.importer)
        : importer.unshift(sassLoaderOption.importer)
    }
    const option = {
      ...(await getSassLoaderOption(taroConfig)),
      ...sassLoaderOption,
      importer,
    }
    return {
      scss: option,
      sass: option,
    }
  }

  return {
    name: 'taro:vite-harmony-config',
    config: async () => ({
      mode: getMode(taroConfig),
      build: {
        outDir: taroConfig.outputRoot || 'dist',
        target: 'esnext',
        cssCodeSplit: true,
        emptyOutDir: false,
        lib: {
          entry: taroConfig.entry.app,
          formats: ['es'],
        },
        watch: taroConfig.isWatch ? {} : null,
        // @TODO doc needed: sourcemapType not supported
        sourcemap: taroConfig.enableSourceMap ?? taroConfig.isWatch ?? process.env.NODE_ENV !== 'production',
        rollupOptions: {
          // FIXME 考虑是否可以移除，需在 ets acornInjectPlugins 插件完成后
          // treeshake: false,
          // TODO 考虑默认排除 taro components、runtime 等相关的依赖，并通过 copy 插件进行拷贝
          external: HARMONY_SCOPES,
          makeAbsoluteExternalsRelative: 'ifRelativeSource',
          output: {
            entryFileNames(chunkInfo) {
              return stripMultiPlatformExt(chunkInfo.name + TARO_COMP_SUFFIX) + taroConfig.fileType.script
            },
            chunkFileNames(chunkInfo) {
              if (chunkInfo.moduleIds?.some(id => id.includes(taroConfig.fileType.script))) {
                return `[name]${taroConfig.fileType.script}`
              }
              return '[name].js'
            },
            manualChunks(id, { getModuleInfo }) {
              const moduleInfo = getModuleInfo(id)
              // const isBabelModule = id.includes('@babel/runtime')
              const isNodeModules = /[\\/]node_modules[\\/]/.test(id)

              if (isNodeModules || /commonjsHelpers\.js$/.test(id)) {
                return 'vendors'
              } else if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1 && !isVirtualModule(id)) {
                return 'common'
              }
            },
          },
          plugins: [
            inject(getInjectOption()) as InputPluginOption,
            babel(getBabelOption(
              taroConfig,
              {
                babelOption: {
                  extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.es6', '.es', '.ets'],
                },
              }
            )) as InputPluginOption,
          ],
        },
        commonjsOptions: {
          // TODO: 优化过滤
          include: [/./],
          extensions: ['.js', '.ts'],
          transformMixedEsModules: true,
        },
        minify: getMinify(taroConfig),
        terserOptions:
          getMinify(taroConfig) === 'terser'
            ? recursiveMerge({}, DEFAULT_TERSER_OPTIONS, taroConfig.terser?.config || {})
            : undefined,
      },
      define: getDefineOption(),
      resolve: {
        mainFields: [...defaultMainFields],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.vue', '.ets'],
        alias: [
          ...getAliasOption(),
        ],
        dedupe: ['@tarojs/shared', '@tarojs/runtime'],
      },
      esbuild: {
        jsxDev: false,
      },
      css: {
        postcss: {
          plugins: getPostcssPlugins(appPath, __postcssOption),
        },
        preprocessorOptions: {
          ...(await getSassOption()),
        },
        modules: getCSSModulesOptions(taroConfig),
      },
    }),
  }
}
