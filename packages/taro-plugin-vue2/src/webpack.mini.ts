import { REG_VUE } from '@tarojs/helper'

import { getLoaderMeta } from './loader-meta'
import { getMiniVueLoaderOptions, getVueLoaderPath } from './utils'

export function modifyMiniWebpackChain (chain, data) {
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
  const vueLoaderOption = getMiniVueLoaderOptions(data.componentConfig)

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

export { getMiniVueLoaderOptions }
