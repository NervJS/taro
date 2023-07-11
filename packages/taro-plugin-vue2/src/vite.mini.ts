import { getLoaderMeta } from './loader-meta'
import { getMiniVueLoaderOptions } from './webpack.mini'

import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { PluginOption } from 'vite'


export function miniVitePlugin (componentConfig: IComponentConfig | undefined): PluginOption {
  return [
    injectLoaderMeta(),
    require('@vitejs/plugin-vue2').default({
      template: getMiniVueLoaderOptions(componentConfig)
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
    },
  }
}

