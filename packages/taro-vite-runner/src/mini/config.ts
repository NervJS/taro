import path from 'node:path'

import { babel } from '@rollup/plugin-babel'
import inject, { RollupInjectOptions } from '@rollup/plugin-inject'
import { defaultMainFields, fs, PLATFORMS, recursiveMerge, REG_NODE_MODULES_DIR, REG_TARO_SCOPED_PACKAGE } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isArray, PLATFORM_TYPE } from '@tarojs/shared'

import { getDefaultPostcssConfig } from '../postcss/postcss.mini'
import {
  getBabelOption,
  getCSSModulesOptions,
  getMinify,
  getMode,
  getPostcssPlugins,
  stripMultiPlatformExt
} from '../utils'
import { DEFAULT_TERSER_OPTIONS, MINI_EXCLUDE_POSTCSS_PLUGIN_NAME } from '../utils/constants'
import { logger } from '../utils/logger'

import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { GetManualChunk, InputPluginOption } from 'rollup'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteMiniCompilerContext): PluginOption {
  const { taroConfig, cwd: appPath, sourceDir } = viteCompilerContext
  const isProd = getMode(taroConfig) === 'production'
  function getDefineOption() {
    const {
      env = {},
      runtime = {} as Record<string, boolean>,
      defineConstants = {},
      framework = 'react',
      buildAdapter = PLATFORMS.WEAPP,
    } = taroConfig

    env.FRAMEWORK = JSON.stringify(framework)
    env.TARO_ENV = JSON.stringify(buildAdapter)
    env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || PLATFORM_TYPE.MINI)
    env.NODE_ENV = JSON.stringify(process.env.NODE_ENV)
    env.SUPPORT_TARO_POLYFILL = env.SUPPORT_TARO_POLYFILL || '"disabled"'
    const envConstants = Object.keys(env).reduce((target, key) => {
      target[`process.env.${key}`] = env[key]
      return target
    }, {})

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
    const alias = taroConfig.alias || {}
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
      URL: ['@tarojs/runtime', 'URL'],
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

  const __postcssOption = getDefaultPostcssConfig({
    designWidth: taroConfig.designWidth || 750,
    deviceRatio: taroConfig.deviceRatio,
    postcssOption: taroConfig.postcss,
  })

  // Note: 分 chunks, commonjs 的循环依赖令人头疼，需要把根据不同的框架，把 taro 和 框架的依赖，打成一个 base chunk（命名为 taro），保证这个 chunk 不会去引用别的 chunk
  function getManualChunks (): GetManualChunk {
    const { framework } = taroConfig
    const reactRelatedDeps: RegExp[] = [
      /node_modules[\\/]react-reconciler[\\/]/,
      /node_modules[\\/]react[\\/]/,
      /node_modules[\\/]scheduler[\\/]/
    ]
    const vueRelatedDeps: RegExp[] = [
      /node_modules[\\/]@vue[\\/]/,
      /node_modules[\\/]vue[\\/]/
    ]
    const taroDeps: RegExp[] = [REG_TARO_SCOPED_PACKAGE]
    const taroViteRunnerDeps: RegExp[] = [/node_modules[\\/]@tarojs[\\/]vite-runner/]
    const nodeModulesDeps: RegExp[] = [REG_NODE_MODULES_DIR]
    const commonjsHelpersDeps: RegExp[] = [/commonjsHelpers\.js$/]
    const tslibDeps: RegExp [] = [/node_modules[\\/]tslib[\\/]/]
    const testByReg2DExpList = (reg2DExpList: RegExp[][]) => (id: string) => reg2DExpList.some(regExpList => regExpList.some(regExp => regExp.test(id)))
    switch (framework) {
      case 'react':
        return (id, { getModuleInfo }) => {
          REG_NODE_MODULES_DIR.lastIndex = 0
          const moduleInfo = getModuleInfo(id)
          // Note: vite-runner 里面涉及到一些js文件的注入，比如 comp.js， 为了避免这些文件被打包进 vendors，这里做了特殊处理
          if (testByReg2DExpList([taroViteRunnerDeps])(id)) return null
          if (testByReg2DExpList([taroDeps, reactRelatedDeps, tslibDeps, commonjsHelpersDeps])(id)) return 'taro'
          if (testByReg2DExpList([nodeModulesDeps])(id)) return 'vendors'
          if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1) return 'common'
        }
      case 'vue3':
        return (id, { getModuleInfo }) => {
          REG_NODE_MODULES_DIR.lastIndex = 0
          const moduleInfo = getModuleInfo(id)
          // Note: vite-runner 里面涉及到一些js文件的注入，比如 comp.js， 为了避免这些文件被打包进 vendors，这里做了特殊处理
          if (testByReg2DExpList([taroViteRunnerDeps])(id)) return null
          if (testByReg2DExpList([taroDeps, vueRelatedDeps, tslibDeps, commonjsHelpersDeps])(id)) return 'taro'
          if (testByReg2DExpList([nodeModulesDeps])(id)) return 'vendors'
          if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1) return 'common'
        }
      default:
        // Note: 其他框架就先不分 chunks 了
        return (id, { getModuleInfo }) => {
          REG_NODE_MODULES_DIR.lastIndex = 0
          const moduleInfo = getModuleInfo(id)
          // Note: vite-runner 里面涉及到一些js文件的注入，比如 comp.js， 为了避免这些文件被打包进 vendors，这里做了特殊处理
          if (testByReg2DExpList([taroViteRunnerDeps])(id)) return null
          if (testByReg2DExpList([nodeModulesDeps, commonjsHelpersDeps])(id)) return 'vendors'
          if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1) return 'common'
        }
    }
  }

  return {
    name: 'taro:vite-mini-config',
    config: async () => ({
      mode: getMode(taroConfig),
      build: {
        outDir: path.join(appPath, taroConfig.outputRoot || 'dist'),
        target: 'es6',
        cssCodeSplit: true,
        emptyOutDir: false,
        lib: {
          entry: taroConfig.entry.app,
          formats: ['cjs'],
        },
        watch: taroConfig.isWatch ? {} : null,
        chunkSizeWarningLimit: Number.MAX_SAFE_INTEGER,
        // @TODO doc needed: sourcemapType not supported
        sourcemap: taroConfig.enableSourceMap ?? taroConfig.isWatch ?? isProd,
        rollupOptions: {
          output: {
            entryFileNames(chunkInfo) {
              return stripMultiPlatformExt(chunkInfo.name) + taroConfig.fileType.script
            },
            chunkFileNames: taroConfig.output!.chunkFileNames,
            manualChunks: getManualChunks(),
          },
          plugins: [
            inject(getInjectOption()) as InputPluginOption,
            babel(getBabelOption(
              taroConfig,
              {
                defaultExclude: [],
                defaultInclude: [sourceDir, /(?<=node_modules[\\/]).*taro/]
              }
            )) as InputPluginOption,
          ],
        },
        commonjsOptions: {
          exclude: [/\.esm/, /[/\\]esm[/\\]/],
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
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.vue'],
        alias: [
          // 小程序使用 regenerator-runtime@0.11
          { find: 'regenerator-runtime', replacement: require.resolve('regenerator-runtime') },
          { find: /@tarojs\/components$/, replacement: taroConfig.taroComponentsPath },
          ...getAliasOption(),
        ],
        dedupe: ['@tarojs/shared', '@tarojs/runtime'],
      },
      esbuild: {
        jsxDev: false,
      },
      css: {
        postcss: {
          plugins: getPostcssPlugins(appPath, __postcssOption, MINI_EXCLUDE_POSTCSS_PLUGIN_NAME),
        },
        preprocessorOptions: {
          ...(await getSassOption()),
          less: taroConfig.lessLoaderOption || {},
          stylus: taroConfig.stylusLoaderOption || {},
        },
        modules: getCSSModulesOptions(taroConfig),
      },
      // @TODO xsscript loader
    }),
    configResolved(_resolvedConfig) {
      // console.log('resolvedConfig.plugins: ', resolvedConfig.plugins)
      // console.log('resolvedConfig.esbuild: ', resolvedConfig.esbuild)
    },
  }
}
