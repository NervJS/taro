import { modifyMiniWebpackChain } from './webpack.mini'
import { modifyH5WebpackChain } from './webpack.h5'

import type { IPluginContext } from '@tarojs/service'

export type Frameworks = 'react' | 'preact' | 'nerv'

export default (ctx: IPluginContext) => {
  const { framework } = ctx.initialConfig

  if (framework !== 'react' && framework !== 'nerv' && framework !== 'preact') return

  ctx.modifyWebpackChain(({ chain }) => {
    // 通用
    setAlias(framework, chain)
    chain
      .plugin('definePlugin')
      .tap(args => {
        const config = args[0]
        config.__TARO_FRAMEWORK__ = `"${framework}"`
        return args
      })

    if (process.env.TARO_ENV === 'h5') {
      // H5
      modifyH5WebpackChain(ctx, framework, chain)
    } else {
      // 小程序
      modifyMiniWebpackChain(ctx, framework, chain)
    }
  })
}

function setAlias (framework: Frameworks, chain) {
  const alias = chain.resolve.alias

  switch (framework) {
    case 'preact':
      alias.set('react', 'preact/compat')
      alias.set('react-dom/test-utils', 'preact/test-utils')
      alias.set('react-dom', 'preact/compat')
      alias.set('react/jsx-runtime', 'preact/jsx-runtime')
      break
    case 'nerv':
      alias.set('react$', 'nervjs')
      alias.set('react-dom$', 'nervjs')
      break
  }
}
