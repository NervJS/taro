import { getLoaderMeta } from './loader-meta'
import { getMiniVueLoaderOptions } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { PluginOption } from 'vite'
import type { IConfig } from './index'

export function miniVitePlugin (ctx: IPluginContext, componentConfig: IComponentConfig | undefined, config: IConfig): PluginOption {
  return [
    injectLoaderMeta(ctx),
    miniConfig(),
    require('@vitejs/plugin-vue').default({
      template: getMiniVueLoaderOptions(ctx, componentConfig, config)
    })
  ]
}

function injectLoaderMeta (ctx: IPluginContext): PluginOption {
  return {
    name: 'taro-vue3:loader-meta',
    buildStart () {
      const { runnerUtils } = ctx
      const { getViteMiniCompilerContext } = runnerUtils
      const viteCompilerContext = getViteMiniCompilerContext(this)
      if (viteCompilerContext) {
        viteCompilerContext.loaderMeta ||= {}
        Object.assign(viteCompilerContext.loaderMeta, getLoaderMeta())
      }
    }
  }
}

function miniConfig (): PluginOption {
  return {
    name: 'taro-vue3:mini-config',
    config: () => ({
      define: {
        ENABLE_ADJACENT_HTML: true,
        ENABLE_CLONE_NODE: true,
        ENABLE_TEMPLATE_CONTENT: true,
        ENABLE_MUTATION_OBSERVER: true,
      }
    })
  }
}
