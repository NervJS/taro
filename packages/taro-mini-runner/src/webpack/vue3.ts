import { REG_VUE, chalk } from '@tarojs/helper'
import { toCamelCase, internalComponents, capitalize } from '@tarojs/shared'
import { componentConfig } from '../template/component'
import type { RootNode, TemplateChildNode, ElementNode, AttributeNode, DirectiveNode, SimpleExpressionNode } from '@vue/compiler-core'

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
              componentConfig.includes.add(nodeName)
            }

            const usingComponent = componentConfig.thirdPartyComponents.get(nodeName)
            if (usingComponent != null) {
              node.props.forEach(prop => {
                if (prop.type === 6 /* ATTRIBUTE */) {
                  usingComponent.add((prop as AttributeNode).name)
                } else if (prop.type === 7 /* DIRECTIVE */) {
                  prop = prop as DirectiveNode
                  if (prop.arg?.type === 4 /* SimpleExpression */) {
                    usingComponent.add((prop.arg as SimpleExpressionNode).content)
                  }
                }
              })
            }
          }
        }]
      }
    })
}
