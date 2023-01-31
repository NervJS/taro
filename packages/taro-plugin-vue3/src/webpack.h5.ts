import { REG_VUE } from '@tarojs/helper'
import { DEFAULT_Components } from '@tarojs/runner-utils'
import { mergeWith } from 'lodash'

import { getLoaderMeta } from './loader-meta'
import { getVueLoaderPath } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { ElementNode, RootNode, TemplateChildNode } from '@vue/compiler-core'
import type { IConfig } from './index'

export function modifyH5WebpackChain (ctx: IPluginContext, chain, config: IConfig) {
  // vue3 tsx 使用原生组件
  setStyleLoader(ctx, chain)
  setVueLoader(chain, config)
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

function setVueLoader (chain, config: IConfig) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  const compilerOptions = config.vueLoaderOption?.compilerOptions || {}
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
    ...(config.vueLoaderOption ?? {}),
    compilerOptions: {
      ...compilerOptions,
      // https://github.com/vuejs/vue-next/blob/master/packages/compiler-core/src/options.ts
      nodeTransforms: [(node: RootNode | TemplateChildNode) => {
        if (node.type === 1 /* ELEMENT */) {
          node = node as ElementNode
          const nodeName = node.tag
          if (DEFAULT_Components.has(nodeName)) {
            node.tag = `taro-${nodeName}`
            node.tagType = 1 /* 0: ELEMENT, 1: COMPONENT */
          }
        }
      }]
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
  function customizer (object = '', sources = '') {
    if ([object, sources].every(e => typeof e === 'string')) return object + sources
  }
  chain.plugin('mainPlugin')
    .tap(args => {
      args[0].loaderMeta = mergeWith(
        getLoaderMeta(), args[0].loaderMeta, customizer
      )
      return args
    })
}

function setTaroApiLoader (chain) {
  chain.merge({
    module: {
      rule: {
        'process-import-taro': {
          test: /taro-h5[\\/]dist[\\/]api[\\/]taro/,
          loader: require.resolve('./api-loader')
        }
      }
    }
  })
}
