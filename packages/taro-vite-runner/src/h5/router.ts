import { genRouterResource } from '../utils/index'

import type { ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteH5CompilerContext): PluginOption {
  const { pages, taroConfig } = viteCompilerContext
  const { router } = taroConfig
  const isMultiRouterMode = router?.mode === 'multi'
  return {
    name: 'taro:vite-h5-router',
    enforce: 'pre',
    buildStart () {
      if (isMultiRouterMode) return
      const getRoutesConfig = () => [
        'config.routes = [',
        `${pages.map(page => genRouterResource(page)).join(',\n')}`,
        ']',
      ].join('\n')

      viteCompilerContext.routerMeta = {
        routerCreator: 'createRouter',
        getRoutesConfig
      }
    },
  }
}
