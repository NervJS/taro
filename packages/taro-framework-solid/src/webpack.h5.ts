import { defaultMainFields, REG_TARO_H5, resolveSync } from '@tarojs/helper'
import { mergeWith } from 'lodash'

import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type Chain from 'webpack-chain'

export function modifyH5WebpackChain (ctx: IPluginContext, chain: Chain) {
  setLoader(chain)
  setPlugin(chain)

  const { isBuildNativeComp = false } = ctx.runOpts?.options || {}
  const externals: Record<string, { [externalType: string]: string } | string> = {}

  if (isBuildNativeComp) {
    chain.merge({
      externalsType: 'umd'
    })
  }

  chain.merge({
    externals,
    module: {
      rule: {
        'process-import-taro-h5': {
          test: REG_TARO_H5,
          loader: require.resolve('./api-loader'),
        },
      },
    },
  })

  chain.merge({
    externals,
    module: {
      rule: {
        'process-import-taro-harmony-hybrid': {
          test: /taro-platform-harmony-hybrid[\\/]dist[\\/]api[\\/]apis[\\/]taro/,
          loader: require.resolve('./api-loader')
        }
      }
    },
  })
}

function setLoader (chain) {
  function customizer (object = '', sources = '') {
    if ([object, sources].every((e) => typeof e === 'string')) return object + sources
  }
  chain.plugin('mainPlugin').tap((args) => {
    args[0].loaderMeta = mergeWith(getLoaderMeta(), args[0].loaderMeta, customizer)
    return args
  })
}

function setPlugin (chain) {
  const alias = chain.resolve.alias
  const resolveOptions = {
    basedir: process.cwd(),
    mainFields: ['unpkg', ...defaultMainFields],
  }
  // 第三方库使用了RECONCILER_NAME的包，需要指定到业务测的reconciler包 统一依赖版本
  alias.set('solid-js$', resolveSync('solid-js', resolveOptions))
  alias.set('solid-js/store$', resolveSync('solid-js/store', resolveOptions))
}
