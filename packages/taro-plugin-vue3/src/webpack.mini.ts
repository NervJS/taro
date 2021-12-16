import { REG_VUE } from '@tarojs/helper'
import { internalComponents, toCamelCase, capitalize } from '@tarojs/shared/dist/template'
import { getLoaderMeta } from './loader-meta'
import { getVueLoaderPath } from './index'

import type { IPluginContext } from '@tarojs/service'
import type { RootNode, TemplateChildNode, ElementNode, AttributeNode, DirectiveNode, SimpleExpressionNode } from '@vue/compiler-core'
import type { IConfig } from './index'

const CUSTOM_WRAPPER = 'custom-wrapper'

type MiniConfig = IConfig['mini']

export function modifyMiniWebpackChain (_ctx: IPluginContext, chain, data, config: MiniConfig) {
  setVueLoader(chain, data, config)
  setLoader(chain)
  setDefinePlugin(chain)
}

function setVueLoader (chain, data, config: MiniConfig) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  // loader
  const vueLoaderOption: any = {
    optimizeSSR: false,
    transformAssetUrls: {
      video: ['src', 'poster'],
      'live-player': 'src',
      audio: 'src',
      source: 'src',
      image: 'src',
      'cover-image': 'src'
    },
    compilerOptions: {}
  }

  if (config?.compilerOptions) {
    vueLoaderOption.compilerOptions = Object.assign({}, config.compilerOptions)
  }

  vueLoaderOption.compilerOptions.nodeTransforms ||= []
  vueLoaderOption.compilerOptions.nodeTransforms.unshift((node: RootNode | TemplateChildNode) => {
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
  })

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

function setDefinePlugin (chain) {
  chain
    .plugin('definePlugin')
    .tap(args => {
      args[0].ENABLE_ADJACENT_HTML = true
      args[0].ENABLE_CLONE_NODE = true
      args[0].ENABLE_TEMPLATE_CONTENT = true
      return args
    })
}
