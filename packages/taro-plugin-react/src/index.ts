import { modifyMiniWebpackChain } from './webpack.mini'
import { modifyH5WebpackChain } from './webpack.h5'

import type { IPluginContext } from '@tarojs/service'

export type Frameworks = 'react' | 'preact' | 'nerv'

type IConfig = {
  reactMode?: 'legacy' | 'concurrent'
}

export default (ctx: IPluginContext, config: IConfig = {}) => {
  const { framework } = ctx.initialConfig
  const { reactMode = 'legacy' } = config // will change default value in the future

  if (framework !== 'react' && framework !== 'nerv' && framework !== 'preact') return

  ctx.modifyWebpackChain(({ chain }) => {
    // 通用
    setAlias(framework, chain)
    chain
      .plugin('definePlugin')
      .tap(args => {
        const config = args[0]
        config.__TARO_FRAMEWORK__ = `"${framework}"`
        config.__TARO_FRAMEWORK_REACT_MODE__ = `"${reactMode}"`
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

  ctx.modifyRunnerOpts(({ opts }) => {
    if (!opts?.compiler) return

    const { compiler } = opts
    const WEBPACK5 = 'webpack5'
    // 提供给 webpack5 依赖预编译收集器的第三方依赖
    const deps = [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@tarojs/plugin-framework-react/dist/runtime'
    ]
    if (compiler === WEBPACK5) {
      opts.compiler = {
        type: WEBPACK5,
        prebundle: {
          include: deps
        }
      }
    } else if (typeof compiler === 'object' && compiler.type === WEBPACK5) {
      compiler.prebundle ||= {}
      const prebundleOptions = compiler.prebundle
      prebundleOptions.include ||= []
      prebundleOptions.include = prebundleOptions.include.concat(deps)
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
