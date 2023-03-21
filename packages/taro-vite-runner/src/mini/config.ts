import { babel, RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import inject, { RollupInjectOptions } from '@rollup/plugin-inject'
import { PLATFORMS } from '@tarojs/helper'
import path from 'path'

import { stripMultiPlatformExt } from '../utils'

import type { PluginOption } from 'vite'
import type { MiniBuildConfig } from '../utils/types'

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
      babelOptions.exclude = [
        ...compile.exclude,
        /css-loader/,
        /node_modules[/\\](?!@tarojs)/
      ]
    } else if (compile.include?.length) {
      const sourceDir = path.join(appPath, taroConfig.sourceRoot || 'src')
      babelOptions.include = [
        ...compile.include,
        sourceDir,
        /taro/
      ]
    } else {
      babelOptions.exclude = [
        /css-loader/,
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

  return {
    name: 'taro:vite-mini-config',
    config: () => ({
      mode: taroConfig.mode,
      outDir: taroConfig.outputRoot || 'dist',
      build: {
        emptyOutDir: false,
        lib: {
          entry: taroConfig.entry.app,
          formats: ['cjs']
        },
        // @TODO Minify tools support selected
        minify: taroConfig.mode === 'production',
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
        }
      },
      define: getDefineOption(),
      resolve: {
        // @TODO mutiPlatformPlugin
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
      }

      // @TODO cssExtractPlugin
      // @TODO copy
      // @TODO css sass scss less stylus loader
      // @TODO babelLoader
      // @TODO template loader
      // @TODO assets loader
      // @TODO xsscript loader
    }),
    configResolved (_resolvedConfig) {
      // console.log('resolvedConfig.plugins: ', resolvedConfig.plugins)
      // console.log('resolvedConfig.esbuild: ', resolvedConfig.esbuild)
    },
  }
}
