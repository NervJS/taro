import { REG_VUE, chalk } from '@tarojs/helper'
import * as webpack from 'webpack'
import { toCamelCase, internalComponents, capitalize } from '@tarojs/shared'
import { componentConfig } from '../template/component'
import type { RootNode, TemplateChildNode, ElementNode, AttributeNode, DirectiveNode, SimpleExpressionNode } from '@vue/compiler-core'

const CUSTOM_WRAPPER = 'custom-wrapper'

export function customVue3Chain (chain) {
  let vueLoaderPath: string
  try {
    vueLoaderPath = require.resolve('vue-loader', {
      paths: [process.cwd()]
    })
  } catch (error) {
    console.log(chalk.yellow('找不到 vue-loader，请先安装。'))
    process.exit(1)
  }

  const { VueLoaderPlugin } = require(vueLoaderPath)

  chain.resolve.alias
    .set('vue', '@vue/runtime-dom')

  chain
    .plugin('vueLoaderPlugin')
    .use(VueLoaderPlugin)

  chain
    .plugin('defined')
    .use(webpack.DefinePlugin, [{
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }])

  chain.module
    .rule('vue')
    .test(REG_VUE)
    .use('vueLoader')
    .loader(vueLoaderPath)
    .options({
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
              componentConfig.includes.add(nodeName)
            }

            if (nodeName === CUSTOM_WRAPPER) {
              node.tagType = 0 /* ELEMENT */
              componentConfig.thirdPartyComponents.set(CUSTOM_WRAPPER, new Set())
            }

            const usingComponent = componentConfig.thirdPartyComponents.get(nodeName)
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
    })
}
