import { mergeWith } from 'lodash'

import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { Frameworks } from './index'

export function modifyH5WebpackChain (ctx: IPluginContext, framework: Frameworks, chain) {
  setLoader(framework, chain)
  setPlugin(ctx, framework, chain)

  chain.merge({
    module: {
      rule: {
        'process-import-taro': {
          test: /taro-h5[\\/]dist[\\/]api[\\/]taro/,
          loader: require.resolve('./api-loader')
        }
      }
    }
  })
}

function setLoader (framework: Frameworks, chain) {
  function customizer (object = '', sources = '') {
    if ([object, sources].every(e => typeof e === 'string')) return object + sources
  }
  chain.plugin('mainPlugin')
    .tap(args => {
      args[0].loaderMeta = mergeWith(
        getLoaderMeta(framework), args[0].loaderMeta, customizer
      )
      return args
    })
}

function setPlugin (ctx: IPluginContext, framework: Frameworks, chain) {
  const config = ctx.initialConfig
  const webpackConfig = chain.toConfig()
  const isProd = webpackConfig.mode === 'production'
  if (!isProd && config.h5?.devServer?.hot !== false) {
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
