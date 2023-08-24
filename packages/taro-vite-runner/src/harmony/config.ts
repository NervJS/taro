import { type RollupBabelInputPluginOptions, babel } from '@rollup/plugin-babel'
import inject, { type RollupInjectOptions } from '@rollup/plugin-inject'
import { defaultMainFields, fs, NODE_MODULES, PLATFORMS, recursiveMerge } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isArray, PLATFORM_TYPE } from '@tarojs/shared'
import path from 'path'

import { getDefaultPostcssConfig, getPostcssPlugins } from '../postcss/postcss.mini'
import { getMode, stripMultiPlatformExt } from '../utils'
import { HARMONY_SCOPES } from '../utils/constants'
import { logger } from '../utils/logger'

import type { CSSModulesOptions, PluginOption } from 'vite'
import type { HarmonyBuildConfig } from '../utils/types'

export default function (appPath: string, taroConfig: HarmonyBuildConfig): PluginOption {
  function getDefineOption() {
    const {
      env = {},
      defineConstants = {},
      framework = 'react',
      buildAdapter = PLATFORMS.HARMONY,
    } = taroConfig

    env.FRAMEWORK = JSON.stringify(framework)
    env.TARO_ENV = JSON.stringify(buildAdapter)
    env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || PLATFORM_TYPE.HARMONY)
    const envConstants = Object.keys(env).reduce((target, key) => {
      target[`process.env.${key}`] = env[key]
      return target
    }, {})

    return {
      ...envConstants,
      ...defineConstants,
    }
  }

  function getAliasOption() {
    const { alias = {} } = taroConfig
    return Object.entries(alias).map(([find, replacement]) => {
      return { find, replacement }
    })
  }

  function getBabelOption(): RollupBabelInputPluginOptions {
    const { compile = {} } = taroConfig
    const babelOptions: RollupBabelInputPluginOptions = {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.es6', '.es', '.ets'],
      babelHelpers: 'runtime',
      skipPreflightCheck: true,
    }

    if (compile.exclude?.length) {
      const list = compile.exclude
      const isNodeModuleReseted = list.find((reg) => reg.toString().includes(NODE_MODULES))
      if (!isNodeModuleReseted) list.push(/node_modules[/\\](?!@tarojs)/)
      babelOptions.exclude = list
    } else if (compile.include?.length) {
      const sourceDir = path.join(appPath, taroConfig.sourceRoot || 'src')
      babelOptions.include = [...compile.include, sourceDir, /taro/]
    } else {
      babelOptions.exclude = [/node_modules[/\\](?!@tarojs)/]
    }

    return babelOptions
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

    const injectOptions: Record<string, any> = {}
    // const injectOptions = taroConfig.injectOptions

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
          treeshake: false,
          // TODO 考虑默认排除 taro components、runtime 等相关的依赖，并通过 copy 插件进行拷贝
          external: HARMONY_SCOPES,
          output: {
            entryFileNames(chunkInfo) {
              return stripMultiPlatformExt(chunkInfo.name) + taroConfig.fileType.script
            },
            chunkFileNames(chunkInfo) {
              if (chunkInfo.moduleIds?.some(id => id.includes(taroConfig.fileType.script))) {
                return `[name]${taroConfig.fileType.script}`
              }
              return '[name].js'
            },
            manualChunks(id, { getModuleInfo }) {
              const moduleInfo = getModuleInfo(id)

              if (/[\\/]node_modules[\\/]/.test(id) || /commonjsHelpers\.js$/.test(id)) {
                return 'vendors'
              } else if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1) {
                return 'common'
              }
            },
          },
          plugins: [
            inject(getInjectOption()) as PluginOption,
            babel(getBabelOption()) as PluginOption,
          ],
        },
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
        modules: getCSSModulesOptions(),
      },
    }),
  }
}
