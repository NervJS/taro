import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'

export type Frameworks = 'react' | 'preact' | 'nerv'

interface IOptions {
  framework?: Frameworks
}

let isBuildH5
let isProduction

export default (ctx: IPluginContext, options: IOptions) => {
  const { framework = 'react' } = options

  isBuildH5 = process.env.TARO_ENV === 'h5'
  isProduction = process.env.NODE_ENV === 'production'

  ctx.modifyWebpackChain(({ chain }) => {
    setAlias(ctx, framework, chain)
    setPlugin(ctx, framework, chain)
    setLoader(framework, chain)
  })
}

function setAlias (ctx: IPluginContext, framework: Frameworks, chain) {
  const config = ctx.initialConfig
  const alias = chain.resolve.alias

  switch (framework) {
    case 'react':
      if (!isBuildH5) {
        // 小程序
        alias.set('react-dom$', '@tarojs/react')
        if (!isProduction && config.mini?.debugReact !== true) {
          // 不是生产环境，且没有设置 debugReact，则使用压缩版本的 react 依赖，减少体积
          alias.set('react-reconciler$', 'react-reconciler/cjs/react-reconciler.production.min.js')
          alias.set('react$', 'react/cjs/react.production.min.js')
          alias.set('scheduler$', 'scheduler/cjs/scheduler.production.min.js')
          alias.set('react/jsx-runtime$', 'react/cjs/react-jsx-runtime.production.min.js')
        }
      }
      break
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

  if (isBuildH5) {
    if (config.h5?.useHtmlComponents) {
      alias['@tarojs/components$'] = '@tarojs/components-react/index'
    } else {
      alias['@tarojs/components$'] = '@tarojs/components/dist-h5/react'
    }
  }
}

function setLoader (framework: Frameworks, chain) {
  if (isBuildH5) {
    chain.plugin('mainPlugin')
      .tap(args => {
        args[0].loaderMeta = getLoaderMeta(framework)
        return args
      })
  } else {
    chain.plugin('miniPlugin')
      .tap(args => {
        args[0].loaderMeta = getLoaderMeta(framework)
        return args
      })
  }
}

function setPlugin (ctx: IPluginContext, framework: Frameworks, chain) {
  const config = ctx.initialConfig

  if (
    isBuildH5 &&
    !isProduction &&
    framework === 'react' &&
    config.h5?.devServer?.hot !== false
  ) {
    // 默认开启 fast-refresh
    chain
      .plugin('fastRefreshPlugin')
      .use(ReactRefreshWebpackPlugin)
  }
}
