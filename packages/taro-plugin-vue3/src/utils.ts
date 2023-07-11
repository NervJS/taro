import { chalk } from '@tarojs/helper'
import { DEFAULT_Components } from '@tarojs/runner-utils'
import { IPluginContext } from '@tarojs/service'
import { capitalize, internalComponents, toCamelCase } from '@tarojs/shared/dist/template'

import type { AttributeNode, DirectiveNode, ElementNode, RootNode, SimpleExpressionNode, TemplateChildNode } from '@vue/compiler-core'
import type { IConfig } from './index'

const CUSTOM_WRAPPER = 'custom-wrapper'

export function getVueLoaderPath (): string {
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

export function getMiniVueLoaderOptions (ctx: IPluginContext, componentConfig, config: IConfig) {
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
          componentConfig: componentConfig
        }
      })

      if (capitalize(toCamelCase(nodeName)) in internalComponents) {
        // change only ElementTypes.COMPONENT to ElementTypes.ELEMENT
        // and leave ElementTypes.SLOT untouched
        if (node.tagType === 1 /* COMPONENT */) {
          (node.tagType as any) = 0 /* ELEMENT */
        }

        // v-html
        const props = node.props
        if (props.find(prop => prop.type === 7 && prop.name === 'html')) {
          ['input', 'textarea', 'video', 'audio'].forEach(item => componentConfig.includes.add(item))
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
  })

  return vueLoaderOption
}

export function getH5VueLoaderOptions(config: IConfig) {
  const compilerOptions = config.vueLoaderOption?.compilerOptions || {}
  // loader
  return {
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
      'taro-cover-image': 'src',
    },
    ...(config.vueLoaderOption ?? {}),
    compilerOptions: {
      ...compilerOptions,
      // https://github.com/vuejs/vue-next/blob/master/packages/compiler-core/src/options.ts
      nodeTransforms: [
        (node: RootNode | TemplateChildNode) => {
          if (node.type === 1 /* ELEMENT */) {
            node = node as ElementNode
            const nodeName = node.tag
            if (DEFAULT_Components.has(nodeName)) {
              node.tag = `taro-${nodeName}`
              node.tagType = 1 /* 0: ELEMENT, 1: COMPONENT */
            }
          }
        },
      ],
    },
  }
}
