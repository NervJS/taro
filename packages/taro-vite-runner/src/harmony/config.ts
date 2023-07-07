import { type RollupBabelInputPluginOptions, babel } from '@rollup/plugin-babel'
import inject, { type RollupInjectOptions } from '@rollup/plugin-inject'
import { defaultMainFields, PLATFORMS } from '@tarojs/helper'
import { PLATFORM_TYPE } from '@tarojs/shared'
import path from 'path'

import { getMode, stripMultiPlatformExt } from '../utils'

import type { PluginOption } from 'vite'
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
      const isNodeModuleReseted = list.find((reg) => reg.toString().includes('node_modules'))
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
          external: [/^@system\./, /^@ohos\./, /^@hmscore\//],
          output: {
            entryFileNames(chunkInfo) {
              return stripMultiPlatformExt(chunkInfo.name) + taroConfig.fileType.script
            },
            chunkFileNames: '[name].js',
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
            inject(getInjectOption()),
            babel(getBabelOption()),
          ],
        },
      },
      define: getDefineOption(),
      resolve: {
        mainFields: [...defaultMainFields],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts', '.vue', '.ets'],
        alias: [
          { find: /@tarojs\/components$/, replacement: taroConfig.taroComponentsPath },
          { find: /@tarojs\/runtime$/, replacement: '@tarojs/plugin-platform-harmony/dist/runtime-ets' },
          { find: /@tarojs\/taro$/, replacement: '@tarojs/plugin-platform-harmony/dist/apis' },
          ...getAliasOption(),
        ],
        dedupe: ['@tarojs/shared', '@tarojs/runtime'],
      },
      esbuild: {
        jsxDev: false,
      },
      css: {
        // TODO postcss
      },
    }),
  }
}
