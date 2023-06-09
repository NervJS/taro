import { fs } from '@tarojs/helper'
import type { IPluginContext } from '@tarojs/service'

import type { Frameworks } from './index'
import { getLoaderMeta } from './loader-meta'

export function modifyMiniWebpackChain(ctx: IPluginContext, framework: Frameworks, chain) {
  setLoader(framework, chain)
}

function setLoader(framework: Frameworks, chain) {
  chain.plugin('miniPlugin').tap((args) => {
    args[0].loaderMeta = getLoaderMeta(framework)
    return args
  })
}
