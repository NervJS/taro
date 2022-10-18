import { getLoaderMetaForH5 } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { Frameworks } from './index'

export function modifyH5WebpackChain (ctx: IPluginContext, framework: Frameworks, chain) {
  setAlias(ctx, chain)
  setLoader(framework, chain)
  setPlugin(ctx, framework, chain)

  chain.merge({
    module: {
      rule: {
        'process-import-taro': {
          test: /taro-h5[\\/]dist[\\/]index/,
          loader: require.resolve('./api-loader')
        }
      }
    }
  })
}

function setAlias (ctx: IPluginContext, chain) {
  const config = ctx.initialConfig
  const alias = chain.resolve.alias

  if (config.h5?.useHtmlComponents) {
    alias.set('@tarojs/components$', '@tarojs/components-react/index')
  } else {
    alias.set('@tarojs/components$', '@tarojs/components/dist-h5/react')
  }
}

function setLoader (framework: Frameworks, chain) {
  chain.plugin('mainPlugin')
    .tap(args => {
      args[0].loaderMeta = getLoaderMetaForH5(framework)
      return args
    })
}

function setPlugin (ctx: IPluginContext, framework: Frameworks, chain) {
  const config = ctx.initialConfig

  if (config.isWatch && config.h5?.devServer?.hot !== false) {
    // 默认开启 fast-refresh
    if (framework === 'react') {
      chain
        .plugin('fastRefreshPlugin')
        .use(require('@pmmmwh/react-refresh-webpack-plugin'))
    } else if (framework === 'preact') {
      chain
        .plugin('hotModuleReplacementPlugin')
        .use(require('webpack').HotModuleReplacementPlugin)
      chain
        .plugin('fastRefreshPlugin')
        .use(require('@prefresh/webpack'))
    }
  }
}
