import { PLATFORMS } from '@tarojs/helper'

import type { PluginOption } from 'vite'
import type { MiniBuildConfig } from '../utils/types'

export default function (taroConfig: MiniBuildConfig): PluginOption {
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

  function getAliasOption (taroConfig: MiniBuildConfig) {
    const alias = taroConfig.alias || {}
    return Object.entries(alias).map(([find, replacement]) => {
      return { find, replacement }
    })
  }

  return {
    name: 'taro:vite-mini-config',
    config: () => ({
      mode: taroConfig.mode,
      outDir: taroConfig.outputRoot || 'dist',
      build: {
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
            chunkFileNames: '[name].js',
            manualChunks (id, { getModuleInfo }) {
              const moduleInfo = getModuleInfo(id)

              if (/@tarojs[\\/][a-z]+/.test(id)) {
                return 'taro'
              } else if (/[\\/]node_modules[\\/]/.test(id)) {
                return 'vendors'
              } else if (moduleInfo?.importers?.length && moduleInfo.importers.length > 1) {
                return 'common'
              }
            }
          }
        },
        commonjsOptions: {
          exclude: [/\.esm/],
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
          ...getAliasOption(taroConfig)
        ],
        dedupe: [
          '@tarojs/shared',
          '@tarojs/runtime'
        ]
      },
      esbuild: {
        jsxDev: false
      }

      // @TODO providerPlugin
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
