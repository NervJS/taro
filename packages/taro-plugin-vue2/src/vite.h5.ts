import { mergeWith } from 'lodash'

import { getLoaderMeta } from './loader-meta'
import { getH5VueLoaderOptions } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { PluginOption } from 'vite'

export function h5VitePlugin (ctx: IPluginContext): PluginOption {
  // eslint-disable-next-line no-console
  return [
    // @TODO: 确认 webpack.h5 的 customStyle 逻辑是否需要迁移
    injectLoaderMeta(ctx),
    require('@vitejs/plugin-vue2').default({
      template: getH5VueLoaderOptions()
    })
  ]
}

function injectLoaderMeta (ctx: IPluginContext): PluginOption {
  function customizer (object = '', sources = '') {
    if ([object, sources].every(e => typeof e === 'string')) return object + sources
  }
  const { runnerUtils } = ctx
  const { getViteH5CompilerContext } = runnerUtils
  return {
    name: 'taro-vue3:loader-meta',
    async buildStart () {
      const viteCompilerContext = await getViteH5CompilerContext(this)
      if (viteCompilerContext) {
        viteCompilerContext.loaderMeta = mergeWith(
          getLoaderMeta(), viteCompilerContext.loaderMeta, customizer
        )
      }
    }
  }
}

