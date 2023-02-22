/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { REG_VUE } from '@tarojs/helper'
import { capitalize, internalComponents, toCamelCase } from '@tarojs/shared/dist/template'

import { getLoaderMeta } from './loader-meta'
import { getVueLoaderPath } from './utils'

import type { IPluginContext } from '@tarojs/service'
import type { AttributeNode, DirectiveNode, ElementNode, RootNode, SimpleExpressionNode, TemplateChildNode } from '@vue/compiler-core'
import type { IConfig } from './index'

const CUSTOM_WRAPPER = 'custom-wrapper'

export function modifyMiniWebpackChain (ctx: IPluginContext, chain, data, config: IConfig) {
  setVueLoader(ctx, chain, data, config)
  setLoader(chain)
  setDefinePlugin(chain)
}

function setVueLoader (ctx: IPluginContext, chain, data, config: IConfig) {
  const vueLoaderPath = getVueLoaderPath()

  // plugin
  const { VueLoaderPlugin } = require(vueLoaderPath)
  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  const compilerOptions = config.vueLoaderOption?.compilerOptions || config.mini?.compilerOptions || {}
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
    ...(config.vueLoaderOption ?? {}),
    compilerOptions
  }

  vueLoaderOption.compilerOptions.nodeTransforms ||= []
  vueLoaderOption.compilerOptions.nodeTransforms.unshift((node: RootNode | TemplateChildNode) => {
    if (node.type === 1 /* ELEMENT */) {
      node = node as ElementNode
      const nodeName = node.tag

      nodeName && ctx.applyPlugins({
        name: 'onParseCreateElement',
        opts: {
          nodeName,
          componentConfig: data.componentConfig
        }
      })

      if (capitalize(toCamelCase(nodeName)) in internalComponents) {
        // change only ElementTypes.COMPONENT to ElementTypes.ELEMENT
        // and leave ElementTypes.SLOT untouched
        if (node.tagType === 1 /* COMPONENT */) {
          node.tagType = 0 /* ELEMENT */
        }

        // v-html
        const props = node.props
        if(props.find(prop => prop.type === 7 && prop.name === 'html')) {
          ['input', 'textarea', 'video', 'audio'].forEach(item => data.componentConfig.includes.add(item))
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
      args[0].ENABLE_MUTATION_OBSERVER = true
      return args
    })
}
