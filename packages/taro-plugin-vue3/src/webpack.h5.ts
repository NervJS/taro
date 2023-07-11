import { REG_TARO_H5, REG_VUE } from '@tarojs/helper'
import { mergeWith } from 'lodash'

import { getLoaderMeta } from './loader-meta'
import { getH5VueLoaderOptions, getVueLoaderPath } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { IConfig } from './index'

export function modifyH5WebpackChain(ctx: IPluginContext, chain, config: IConfig) {
  // vue3 tsx 使用原生组件
  setStyleLoader(ctx, chain)
  setVueLoader(chain, config)
  setLoader(chain)
  setTaroApiLoader(chain)

  const { isBuildNativeComp = false } = ctx.runOpts?.options || {}
  const externals: Record<string, string> = {}
  if (isBuildNativeComp) {
    // Note: 该模式不支持 prebundle 优化，不必再处理
    externals.vue = 'vue'
  }

  chain.merge({ externals })
}

function setStyleLoader(ctx: IPluginContext, chain) {
  const config = ctx.initialConfig.h5 || {}

  const { styleLoaderOption = {} } = config
  chain.module.rule('customStyle').merge({
    use: [
      {
        loader: 'style-loader',
        options: styleLoaderOption,
      },
    ],
  })
}

function setVueLoader(chain, config: IConfig) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain.plugin('vueLoaderPlugin').use(VueLoaderPlugin)

  // loader
  const vueLoaderOption = getH5VueLoaderOptions(config)

  chain.module.rule('vue').test(REG_VUE).use('vueLoader').loader(vueLoaderPath).options(vueLoaderOption)
}

function setLoader(chain) {
  function customizer(object = '', sources = '') {
    if ([object, sources].every((e) => typeof e === 'string')) return object + sources
  }
  chain.plugin('mainPlugin').tap((args) => {
    args[0].loaderMeta = mergeWith(getLoaderMeta(), args[0].loaderMeta, customizer)
    return args
  })
}

function setTaroApiLoader(chain) {
  chain.merge({
    module: {
      rule: {
        'process-import-taro': {
          test: REG_TARO_H5,
          loader: require.resolve('./api-loader'),
        },
      },
    },
  })
}
