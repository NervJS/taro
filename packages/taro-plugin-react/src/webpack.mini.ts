
import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { Frameworks } from './index'

export function modifyMiniWebpackChain (ctx: IPluginContext, framework: Frameworks, chain) {
  setAlias(ctx, framework, chain)
  setLoader(framework, chain)
}

function setAlias (ctx: IPluginContext, framework: Frameworks, chain) {
  const config = ctx.initialConfig
  const alias = chain.resolve.alias

  if (framework === 'react') {
    alias.set('react-dom$', '@tarojs/react')
    if (process.env.NODE_ENV !== 'production' && config.mini?.debugReact !== true) {
      // 不是生产环境，且没有设置 debugReact，则使用压缩版本的 react 依赖，减少体积
      alias.set('react-reconciler$', 'react-reconciler/cjs/react-reconciler.production.min.js')
      alias.set('react$', 'react/cjs/react.production.min.js')
      alias.set('scheduler$', 'scheduler/cjs/scheduler.production.min.js')
      alias.set('react/jsx-runtime$', 'react/cjs/react-jsx-runtime.production.min.js')
    }
  }
}

function setLoader (framework: Frameworks, chain) {
  chain.plugin('miniPlugin')
    .tap(args => {
      args[0].loaderMeta = getLoaderMeta(framework)
      return args
    })
}
