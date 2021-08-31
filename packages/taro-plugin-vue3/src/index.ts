import * as webpack from 'webpack'
import { REG_VUE, chalk } from '@tarojs/helper'
import { DEFAULT_Components } from '@tarojs/runner-utils'
import { internalComponents, toCamelCase, capitalize } from '@tarojs/shared/dist/template'
import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { RootNode, TemplateChildNode, ElementNode, AttributeNode, DirectiveNode, SimpleExpressionNode } from '@vue/compiler-core'

const CUSTOM_WRAPPER = 'custom-wrapper'
let isBuildH5

export default (ctx: IPluginContext) => {
  const { framework } = ctx.initialConfig
  if (framework !== 'vue3') return

  isBuildH5 = process.env.TARO_ENV === 'h5'

  ctx.modifyWebpackChain(({ chain, data }) => {
    customVueChain(chain, data)
    setLoader(chain)

    if (isBuildH5) {
      setStyleLoader(ctx, chain)
    }
  })
}

function customVueChain (chain, data) {
  chain.resolve.alias
    .set('vue', '@vue/runtime-dom')

  chain
    .plugin('defined')
    .use(webpack.DefinePlugin, [{
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
    }])

  setVueLoader(chain, data)
}

function getVueLoaderPath (): string {
  try {
    return require.resolve('vue-loader', {
      paths: [process.cwd()]
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(chalk.yellow('找不到 vue-loader，请先安装。'))
    process.exit(1)
  }
}

function setVueLoader (chain, data) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  // loader
  let vueLoaderOption

  if (isBuildH5) {
    // H5
    vueLoaderOption = {
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
  } else {
    // 小程序
    vueLoaderOption = {
      optimizeSSR: false,
      transformAssetUrls: {
        video: ['src', 'poster'],
        'live-player': 'src',
        audio: 'src',
        source: 'src',
        image: 'src',
        'cover-image': 'src'
      },
      compilerOptions: {
        // https://github.com/vuejs/vue-next/blob/master/packages/compiler-core/src/options.ts
        nodeTransforms: [(node: RootNode | TemplateChildNode) => {
          if (node.type === 1 /* ELEMENT */) {
            node = node as ElementNode
            const nodeName = node.tag

            if (capitalize(toCamelCase(nodeName)) in internalComponents) {
              // change only ElementTypes.COMPONENT to ElementTypes.ELEMENT
              // and leave ElementTypes.SLOT untouched
              if (node.tagType === 1 /* COMPONENT */) {
                node.tagType = 0 /* ELEMENT */
              }
              data.componentConfig.includes.add(nodeName)
            }

            if (nodeName === CUSTOM_WRAPPER) {
              node.tagType = 0 /* ELEMENT */
              data.componentConfig.thirdPartyComponents.set(CUSTOM_WRAPPER, new Set())
            }

            const usingComponent = data.componentConfig.thirdPartyComponents.get(nodeName)
            if (usingComponent != null) {
              node.props.forEach(prop => {
                if (prop.type === 6 /* ATTRIBUTE */) {
                  usingComponent.add((prop as AttributeNode).name)
                } else if ((prop as any).type === 7 /* DIRECTIVE */) {
                  prop = prop as DirectiveNode
                  if (prop.arg?.type === 4 /* SimpleExpression */) {
                    let value = (prop.arg as SimpleExpressionNode).content
                    if (prop.name === 'on') {
                      value = `on${value}`
                    }
                    usingComponent.add(value)
                  }
                }
              })
            }
          }
        }]
      }
    }
  }

  chain.module
    .rule('vue')
    .test(REG_VUE)
    .use('vueLoader')
    .loader(vueLoaderPath)
    .options(vueLoaderOption)
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

function setLoader (chain) {
  if (isBuildH5) {
    chain.plugin('mainPlugin')
      .tap(args => {
        args[0].loaderMeta = getLoaderMeta()
        return args
      })
  } else {
    chain.plugin('miniPlugin')
      .tap(args => {
        args[0].loaderMeta = getLoaderMeta()
        return args
      })
  }
}
