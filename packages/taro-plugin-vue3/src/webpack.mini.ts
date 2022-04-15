import { REG_VUE } from '@tarojs/helper'
import { getLoaderMeta } from './loader-meta'
import { getVueLoaderPath } from './index'
import { transformMiniNativeTags, transformTaroEnv } from './transforms'

import type { IPluginContext } from '@tarojs/service'
import type { IConfig } from './index'

type MiniConfig = IConfig['mini']

export function modifyMiniWebpackChain (_ctx: IPluginContext, chain, data, config: MiniConfig) {
  setVueLoader(chain, data, config)
  setLoader(chain)
  setDefinePlugin(chain)
}

function setVueLoader (chain, data, config: MiniConfig) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  // loader
  const vueLoaderOption: any = {
    optimizeSSR: false,
    transformAssetUrls: {
      video: ['src', 'poster'],
      'live-player': 'src',
      audio: 'src',
      source: 'src',
      image: 'src',
      'cover-image': 'src'
    },
    compilerOptions: {}
  }

  if (config?.compilerOptions) {
    vueLoaderOption.compilerOptions = Object.assign({}, config.compilerOptions)
  }

  vueLoaderOption.compilerOptions.nodeTransforms ||= []
  vueLoaderOption.compilerOptions.nodeTransforms.unshift(transformMiniNativeTags(data))
  vueLoaderOption.compilerOptions.nodeTransforms.unshift(transformTaroEnv)

  chain.module
    .rule('vue')
    .test(REG_VUE)
    .use('vueLoader')
    .loader(vueLoaderPath)
    .options(vueLoaderOption)
}

function setLoader (chain) {
  chain.plugin('miniPlugin')
    .tap(args => {
      args[0].loaderMeta = getLoaderMeta()
      return args
    })
}

function setDefinePlugin (chain) {
  chain
    .plugin('definePlugin')
    .tap(args => {
      args[0].ENABLE_ADJACENT_HTML = true
      args[0].ENABLE_CLONE_NODE = true
      args[0].ENABLE_TEMPLATE_CONTENT = true
      args[0].ENABLE_MUTATION_OBSERVER = true
      return args
    })
}
