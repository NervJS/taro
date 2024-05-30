import { REG_VUE } from '@tarojs/helper'

import { getLoaderMeta } from './loader-meta'
import { getHarmonyVueLoaderOptions, getVueLoaderPath } from './utils'

export function modifyHarmonyWebpackChain (chain, data) {
  setVueLoader(chain, data)
  setLoader(chain)
}

function setVueLoader (chain, data) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  // loader
  const vueLoaderOption = getHarmonyVueLoaderOptions(data.componentConfig)

  chain.module
    .rule('vue')
    .test(REG_VUE)
    .use('vueLoader')
    .loader(vueLoaderPath)
    .options(vueLoaderOption)
}

function setLoader (chain) {
  chain.plugin('mainPlugin')
    .tap(args => {
      args[0].loaderMeta = getLoaderMeta()
      return args
    })
}

export { getHarmonyVueLoaderOptions }
