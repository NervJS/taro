import { REG_VUE } from '@tarojs/helper'
import { getLoaderMeta } from './loader-meta'
import { getVueLoaderPath } from './index'
import { transformTaroEnv, trnasformH5Tags } from './transforms'

import type { IPluginContext } from '@tarojs/service'

export function modifyH5WebpackChain (ctx: IPluginContext, chain) {
  setStyleLoader(ctx, chain)
  setVueLoader(chain)
  setLoader(chain)
  setTaroApiLoader(chain)
}

function setStyleLoader (ctx: IPluginContext, chain) {
  const config = ctx.initialConfig.h5 || {}

  const { styleLoaderOption = {} } = config
  chain.module
    .rule('customStyle')
    .merge({
      use: [{
        loader: 'style-loader',
        options: styleLoaderOption
      }]
    })
}

function setVueLoader (chain) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  // loader
  const vueLoaderOption = {
    transformAssetUrls: {
      video: ['src', 'poster'],
      'live-player': 'src',
      audio: 'src',
      source: 'src',
      image: 'src',
      'cover-image': 'src',
      'taro-video': ['src', 'poster'],
      'taro-live-player': 'src',
      'taro-audio': 'src',
      'taro-source': 'src',
      'taro-image': 'src',
      'taro-cover-image': 'src'
    },
    compilerOptions: {
      // https://github.com/vuejs/vue-next/blob/master/packages/compiler-core/src/options.ts
      nodeTransforms: [
        transformTaroEnv,
        trnasformH5Tags
      ]
    }
  }

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

function setTaroApiLoader (chain) {
  chain.merge({
    module: {
      rule: {
        'process-import-taro': {
          test: /taro-h5[\\/]dist[\\/]index/,
          loader: require.resolve('./api-loader')
        }
      }
    }
  })
}
