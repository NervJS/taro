import { getLoaderMeta } from './loader-meta'
import { getHarmonyVueLoaderOptions } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { PluginOption } from 'vite'
import type { IConfig } from './index'

export function harmonyVitePlugin (ctx: IPluginContext, componentConfig: IComponentConfig | undefined, config: IConfig): PluginOption {
  return [
    injectLoaderMeta(ctx),
    harmonyConfig(),
    require('@vitejs/plugin-vue').default({
      template: getHarmonyVueLoaderOptions(ctx, componentConfig, config)
    })
  ]
}

function injectLoaderMeta (ctx: IPluginContext): PluginOption {
  return {
    name: 'taro-vue3:loader-meta',
    async buildStart () {
      const { runnerUtils } = ctx
      const { getViteHarmonyCompilerContext } = runnerUtils
      const viteCompilerContext = await getViteHarmonyCompilerContext(this)
      if (viteCompilerContext) {
        viteCompilerContext.loaderMeta ||= {}
        Object.assign(viteCompilerContext.loaderMeta, getLoaderMeta())
      }
    }
  }
}

function harmonyConfig (): PluginOption {
  return {
    name: 'taro-vue3:harmony-config',
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
