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
  const mainFields = ['unpkg', ...defaultMainFields]
  const resolveOptions = {
    basedir: process.cwd(),
    mainFields,
  }
  const alias = chain.resolve.alias
  // Note: 本地 link 调试时，避免 solid 重复打包
  alias.set('solid-js$', resolveSync('solid-js', resolveOptions))
}
