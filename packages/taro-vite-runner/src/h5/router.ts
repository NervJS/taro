import { genRouterResource } from '../utils/index'

import type { PluginOption } from 'vite'
import type { TaroCompiler } from '../utils/compiler/h5'

export default function (compiler: TaroCompiler): PluginOption {
  const { pages, taroConfig } = compiler
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

      compiler.routerMeta = {
        routerCreator: 'createRouter',
        getRoutesConfig
      }
    },
  }
}
