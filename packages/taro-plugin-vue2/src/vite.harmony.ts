import { getLoaderMeta } from './loader-meta'
import { getHarmonyVueLoaderOptions } from './webpack.harmony'

import type { IPluginContext } from '@tarojs/service'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { PluginOption } from 'vite'

export function harmonyVitePlugin (ctx: IPluginContext, componentConfig: IComponentConfig | undefined): PluginOption {
  return [
    injectLoaderMeta(ctx),
    require('@vitejs/plugin-vue2').default({
      template: getHarmonyVueLoaderOptions(componentConfig)
    })
  ]
}

function injectLoaderMeta (ctx: IPluginContext): PluginOption {
  return {
    name: 'taro-vue3:loader-meta',
    buildStart () {
      const { runnerUtils } = ctx
      const { getViteHarmonyCompilerContext } = runnerUtils
      const viteCompilerContext = getViteHarmonyCompilerContext(this)
      if (viteCompilerContext) {
        viteCompilerContext.loaderMeta = getLoaderMeta()
      }
    },
  }
}
