import { REG_VUE } from '@tarojs/helper'

import { getLoaderMeta } from './loader-meta'
import { getMiniVueLoaderOptions, getVueLoaderPath } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { IConfig } from './index'


export function modifyMiniWebpackChain (ctx: IPluginContext, chain, data, config: IConfig) {
  setVueLoader(ctx, chain, data, config)
  setLoader(chain)
  setDefinePlugin(chain)
}

function setVueLoader (ctx: IPluginContext, chain, data, config: IConfig) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  // loader
  const vueLoaderOption = getMiniVueLoaderOptions(ctx, data.componentConfig, config)

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
