import { fs } from '@tarojs/helper'
import { mergeWith } from 'lodash'

import apiLoader from './api-loader'
import { getLoaderMeta } from './loader-meta'
import { getH5VueLoaderOptions } from './webpack.h5'

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
      await this.load({ id: 'taro:compiler' })
      const info = this.getModuleInfo('taro:compiler')
      const compiler = info?.meta.compiler
      if (compiler) {
        compiler.loaderMeta = mergeWith(
          getLoaderMeta(), compiler.loaderMeta, customizer
        )
      }
    }
  }
}

function setTaroApi () {
  return {
    name: 'taro-vue3:process-import-taro',
    enforce: 'pre',
    config: () => ({
      optimizeDeps: {
        force: true,
        esbuildOptions: {
          plugins: [
            {
              name: 'taro:vue3-api',
              setup (build) {
                build.onLoad({ filter: /@tarojs[\\/]plugin-platform-h5[\\/]dist[\\/]runtime[\\/]apis[\\/]index/ }, async (args) => {
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
    })
  }
}
