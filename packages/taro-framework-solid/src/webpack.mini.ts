import { RECONCILER_NAME } from './constant'
import { getLoaderMeta } from './loader-meta'

export function modifyMiniWebpackChain (chain) {
  setAlias(chain)
  setLoader(chain)
}

function setAlias (chain) {
  const alias = chain.resolve.alias
  alias.set('solid-js/web$', RECONCILER_NAME)
}

function setLoader (chain) {
  chain.plugin('miniPlugin')
    .tap(args => {
      args[0].loaderMeta ||= {}
      Object.assign(args[0].loaderMeta, getLoaderMeta())
      return args
    })
}
