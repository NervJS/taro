
import { RECONCILER_NAME } from './constant'
import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { PluginOption } from 'vite'

export function harmonyVitePlugin (ctx: IPluginContext): PluginOption {
  return [
    injectLoaderMeta(ctx),
    aliasPlugin(),
  ]
}

function injectLoaderMeta (ctx: IPluginContext): PluginOption {
  return {
    name: 'taro-solid:loader-meta',
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

function aliasPlugin (): PluginOption {
  return {
    name: 'taro-solid:alias',
    config () {
      const alias = [
        { find: 'solid-js/web$', replacement: RECONCILER_NAME },
        { find: 'react/jsx-runtime', replacement: RECONCILER_NAME },
      ]

      return {
        resolve: {
          alias
        }
      }
    }
  }
}
