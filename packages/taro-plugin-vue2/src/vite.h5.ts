import { mergeWith } from 'lodash'

import { getLoaderMeta } from './loader-meta'
import { getH5VueLoaderOptions } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { PluginOption } from 'vite'

export function h5VitePlugin (_ctx: IPluginContext): PluginOption {
  // eslint-disable-next-line no-console
  return [
    // @TODO: 确认 webpack.h5 的 customStyle 逻辑是否需要迁移
    injectLoaderMeta(),
    require('@vitejs/plugin-vue2').default({
      template: getH5VueLoaderOptions()
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

