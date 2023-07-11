import { getLoaderMeta } from './loader-meta'
import { getMiniVueLoaderOptions } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { PluginOption } from 'vite'
import type { IConfig } from './index'

export function miniVitePlugin (ctx: IPluginContext, componentConfig: IComponentConfig | undefined, config: IConfig): PluginOption {
  return [
    injectLoaderMeta(),
    miniConfig(),
    require('@vitejs/plugin-vue').default({
      template: getMiniVueLoaderOptions(ctx, componentConfig, config)
    })
  ]
}

function injectLoaderMeta (): PluginOption {
  return {
    name: 'taro-vue3:loader-meta',
    buildStart () {
      const info = this.getModuleInfo('taro:compiler')
      const compiler = info?.meta.compiler
      if (compiler) {
        compiler.loaderMeta = getLoaderMeta()
      }
    }
  }
}

function miniConfig (): PluginOption {
  return {
    name: 'taro-vue3:mini-config',
    config: () => ({
      define: {
        'ENABLE_ADJACENT_HTML': true,
        'ENABLE_CLONE_NODE': true,
        'ENABLE_TEMPLATE_CONTENT': true,
        'ENABLE_MUTATION_OBSERVER': true,
      }
    })
  }
}
