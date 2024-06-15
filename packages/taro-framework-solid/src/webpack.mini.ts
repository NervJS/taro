import { defaultMainFields, resolveSync } from '@tarojs/helper'

import { RECONCILER_NAME } from './constant'
import { getLoaderMeta } from './loader-meta'

export function modifyMiniWebpackChain (chain) {
  setAlias(chain)
  setLoader(chain)
}

function setAlias (chain) {
  const alias = chain.resolve.alias
  const mainFields = ['unpkg', ...defaultMainFields]
  const resolveOptions = {
    basedir: process.cwd(),
    mainFields,
  }
  alias.set('solid-js/web$', RECONCILER_NAME)
  // Note: 本地 link 调试时，避免 solid 重复打包
  alias.set('solid-js$', resolveSync('solid-js', resolveOptions))
}

function setLoader (chain) {
  chain.plugin('miniPlugin')
    .tap(args => {
      args[0].loaderMeta = getLoaderMeta()
      return args
    })
}
