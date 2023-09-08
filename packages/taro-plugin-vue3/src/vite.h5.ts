import { fs, getViteH5Compiler, REG_TARO_H5_RUNTIME_API } from '@tarojs/helper'
import { mergeWith } from 'lodash'

import apiLoader from './api-loader'
import { getLoaderMeta } from './loader-meta'
import { getH5VueLoaderOptions } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { PluginOption } from 'vite'
import type { IConfig } from './index'

export function h5VitePlugin (_ctx: IPluginContext, config: IConfig): PluginOption {
  return [
    // @TODO: 确认 webpack.h5 的 customStyle 逻辑是否需要迁移
    injectLoaderMeta(),
    setTaroApi(),
    require('@vitejs/plugin-vue').default({
      template: getH5VueLoaderOptions(config)
    })
  ]
}

function injectLoaderMeta (): PluginOption {
  function customizer (object = '', sources = '') {
    if ([object, sources].every(e => typeof e === 'string')) return object + sources
  }
  return {
    name: 'taro-vue3:loader-meta',
    async buildStart () {
      const compiler = await getViteH5Compiler(this)
      if (compiler) {
        compiler.loaderMeta = mergeWith(
          getLoaderMeta(), compiler.loaderMeta, customizer
        )
      }
    }
  }
}

function setTaroApi () {
  // dev 环境通过 esbuild 来做； pro 环境通过 rollup load 钩子来做；因为生产环境不会走 esbuild
  return {
    name: 'taro-vue3:process-import-taro',
    enforce: 'pre',
    config: () => ({
      optimizeDeps: {
        esbuildOptions: {
          plugins: [
            {
              name: 'taro:vue3-api',
              setup (build) {
                build.onLoad({ filter: REG_TARO_H5_RUNTIME_API }, async (args) => {
                  const input = await fs.readFile(args.path, 'utf8')
                  return {
                    contents: apiLoader(input + '\n' + 'const taro = Taro__default\n')
                  }
                })
              },
            }
          ]
        }
      },
    }),
    async load (id) {
      if (process.env.NODE_ENV === 'production' && REG_TARO_H5_RUNTIME_API.test(id)) {
        const input = await fs.readFile(id, 'utf8')
        return apiLoader(input + '\n' + 'const taro = Taro__default\n')
      }
    }
  }
}
