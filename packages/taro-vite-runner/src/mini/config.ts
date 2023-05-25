import { babel, RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import inject, { RollupInjectOptions } from '@rollup/plugin-inject'
import { fs, PLATFORMS, recursiveMerge } from '@tarojs/helper'
import { getSassLoaderOption } from '@tarojs/runner-utils'
import { isArray, PLATFORM_TYPE } from '@tarojs/shared'
import path from 'path'

import { getDefaultPostcssConfig, getPostcssPlugins } from '../postcss/postcss.mini'
import { getMode,stripMultiPlatformExt } from '../utils'
import { logger } from '../utils/logger'

import type { CSSModulesOptions,PluginOption } from 'vite'
import type { MiniBuildConfig } from '../utils/types'

const DEFAULT_TERSER_OPTIONS = {
  parse: {
    ecma: 8
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
    evaluate: true
  },
  output: {
    ecma: 5,
    comments: false,
    ascii_only: true
  }
}

export default function (appPath: string, taroConfig: MiniBuildConfig): PluginOption {
  function getDefineOption () {
    const {
      env = {},
      runtime = {} as Record<string, boolean>,
      defineConstants = {},
      framework = 'react',
      buildAdapter = PLATFORMS.WEAPP
    } = taroConfig

    env.FRAMEWORK = JSON.stringify(framework)
    env.TARO_ENV = JSON.stringify(buildAdapter)
    env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || PLATFORM_TYPE.MINI)
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
      ENABLE_MUTATION_OBSERVER: runtime.enableMutationObserver ?? false
    }

    return {
      ...envConstants,
      ...defineConstants,
      ...runtimeConstants
    }
  }

  function getAliasOption () {
    const alias = taroConfig.alias || {}
    return Object.entries(alias).map(([find, replacement]) => {
      return { find, replacement }
    })
  }

  function getBabelOption (): RollupBabelInputPluginOptions {
    const { compile = {} } = taroConfig
    const babelOptions: RollupBabelInputPluginOptions = {
      extensions: ['.js', '.jsx', 'ts', 'tsx', '.es6', '.es', '.mjs'],
      babelHelpers: 'runtime',
      skipPreflightCheck: true
    }

    if (compile.exclude?.length) {
      const list = compile.exclude
      const isNodeModuleReseted = list.find(reg => reg.toString().includes('node_modules'))
      if (!isNodeModuleReseted) list.push(/node_modules[/\\](?!@tarojs)/)
      babelOptions.exclude = list
    } else if (compile.include?.length) {
      const sourceDir = path.join(appPath, taroConfig.sourceRoot || 'src')
      babelOptions.include = [
        ...compile.include,
        sourceDir,
        /taro/
      ]
    } else {
      babelOptions.exclude = [
        /node_modules[/\\](?!@tarojs)/
      ]
    }

    return babelOptions
  }

  function getInjectOption (): RollupInjectOptions {
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
      injectOptions.exclude.forEach(item => {
        delete options[item]
      })
    }

    return options
  }

  async function getSassOption () {
    const sassLoaderOption = taroConfig.sassLoaderOption
    const nativeStyleImporter = function importer (url, prev, done) {
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
              .then(res => {
                done({ contents: res.toString() })
              })
              .catch(err => {
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
      sass: option
    }
  }

  function getCSSModulesOptions (): false | CSSModulesOptions {
    if (taroConfig.postcss?.cssModules?.enable !== true) return false
    const config = recursiveMerge({}, {
      namingPattern: 'module',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }, taroConfig.postcss.cssModules.config)
    return {
      generateScopedName: config.generateScopedName
    }
  }

  function getMinify (): 'terser' | 'esbuild' | boolean {
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
    designWidth: taroConfig.designWidth || 750,
    deviceRatio: taroConfig.deviceRatio,
    postcssOption: taroConfig.postcss
  })

  return {
    name: 'taro:vite-mini-config',
    config: async () => ({
      mode: getMode(taroConfig),
      outDir: taroConfig.outputRoot || 'dist',
      build: {
        target: 'es6',
        cssCodeSplit: true,
        emptyOutDir: false,
        lib: {
          entry: taroConfig.entry.app,
          formats: ['cjs']
        },
        watch: taroConfig.isWatch ? {} : null,
        // @TODO doc needed: sourcemapType not supported
        sourcemap: taroConfig.enableSourceMap ?? taroConfig.isWatch ?? process.env.NODE_ENV !== 'production',
        rollupOptions: {
          output: {
            entryFileNames (chunkInfo) {
              return stripMultiPlatformExt(chunkInfo.name) + taroConfig.fileType.script
            },
            chunkFileNames: '[name].js',
            manualChunks (id, { getModuleInfo }) {
              const moduleInfo = getModuleInfo(id)

              if (/[\\/]node_modules[\\/]/.test(id) || /commonjsHelpers\.js$/.test(id)) {
                return 'vendors'
              } else if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1) {
                return 'common'
              }
            }
          },
          plugins: [
            inject(getInjectOption()),
            babel(getBabelOption()),
          ]
        },
        commonjsOptions: {
          exclude: [/\.esm/, /[/\\]esm[/\\]/],
          transformMixedEsModules: true
        },
        minify: getMinify(),
        terserOptions: getMinify() === 'terser'
          ? recursiveMerge({}, DEFAULT_TERSER_OPTIONS, taroConfig.terser?.config || {})
          : undefined
      },
      define: getDefineOption(),
      resolve: {
        mainFields: ['browser', 'module', 'jsnext:main', 'main'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue'],
        alias: [
          // 小程序使用 regenerator-runtime@0.11
          { find: 'regenerator-runtime', replacement: require.resolve('regenerator-runtime') },
          { find: /@tarojs\/components$/, replacement: taroConfig.taroComponentsPath || '@tarojs/components/mini' },
          ...getAliasOption()
        ],
        dedupe: [
          '@tarojs/shared',
          '@tarojs/runtime'
        ]
      },
      esbuild: {
        jsxDev: false
      },
      css: {
        postcss: {
          plugins: getPostcssPlugins(appPath, __postcssOption)
        },
        preprocessorOptions: {
          ...(await getSassOption()),
          less: taroConfig.lessLoaderOption || {},
          stylus: taroConfig.stylusLoaderOption || {}
        },
        modules: getCSSModulesOptions()
      }
      // @TODO xsscript loader
    }),
    configResolved (_resolvedConfig) {
      // console.log('resolvedConfig.plugins: ', resolvedConfig.plugins)
      // console.log('resolvedConfig.esbuild: ', resolvedConfig.esbuild)
    },
  }
}
