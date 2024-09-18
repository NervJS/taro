import { RECONCILER_NAME } from './constant'
import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { PluginOption } from 'vite'

export function miniVitePlugin (ctx: IPluginContext): PluginOption {
  return [
    injectLoaderMeta(ctx),
    aliasPlugin(),
  ]
}

function injectLoaderMeta (ctx: IPluginContext): PluginOption {
  return {
    name: 'taro-solid:loader-meta',
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

function aliasPlugin (): PluginOption {
  return {
    name: 'taro-solid:alias',
    config () {
      const alias = [
        { find: 'solid-js/web$', replacement: RECONCILER_NAME },
      ]

      return {
        resolve: {
          alias
        }
      }
    }
  }
}
