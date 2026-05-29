import { defaultMainFields, resolveSync } from '@tarojs/helper'

import { RECONCILER_NAME } from './constant'
import { getLoaderMeta } from './loader-meta'

export function modifyHarmonyWebpackChain (chain) {
  setAlias(chain)
  setLoader(chain)
}

function setAlias (chain) {
  const alias = chain.resolve.alias
  const resolveOptions = {
    basedir: process.cwd(),
    mainFields: ['unpkg', ...defaultMainFields],
  }

  // 第三方库使用了RECONCILER_NAME的包，需要指定到业务测的reconciler包 统一依赖版本
  alias.set(RECONCILER_NAME, resolveSync(RECONCILER_NAME, resolveOptions))
  alias.set('solid-js/web$', resolveSync(RECONCILER_NAME, resolveOptions))
  alias.set('solid-js$', resolveSync('solid-js', resolveOptions))
  alias.set('solid-js/store$', resolveSync('solid-js/store', resolveOptions))
  alias.set('solid-js/universal$', resolveSync('solid-js/universal', resolveOptions))
  alias.set('solid-js/html$', resolveSync('solid-js/html', resolveOptions))
  alias.set('solid-js/h$', resolveSync('solid-js/h', resolveOptions))
}

function setLoader (chain) {
  chain.plugin('mainPlugin').tap((args) => {
    args[0].loaderMeta ||= {}
    Object.assign(args[0].loaderMeta, getLoaderMeta())
    return args
  })
}
