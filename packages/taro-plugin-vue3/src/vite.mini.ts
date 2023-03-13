import { capitalize, internalComponents, toCamelCase } from '@tarojs/shared/dist/template'

import { getLoaderMeta } from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { AttributeNode, DirectiveNode, ElementNode, RootNode, SimpleExpressionNode, TemplateChildNode } from '@vue/compiler-core'
import type { PluginOption } from 'vite'
import type { IConfig } from './index'

const CUSTOM_WRAPPER = 'custom-wrapper'

export function miniVitePlugin (): PluginOption {
  return [
    injectLoaderMeta(),
    miniConfig()
  ]
}

function injectLoaderMeta (): PluginOption {
  return {
    name: 'taro-vue3:loader-meta',
    buildStart () {
      const info = this.getModuleInfo('taro:compiler')
      const compiler = info?.meta.compiler
      if (compiler) {
        compiler.loaderMeta = getLoaderMeta()
      }
    }
  }
}

function miniConfig (): PluginOption {
  return {
    name: 'taro-vue3:mini-config',
    config: () => ({
      define: {
        'ENABLE_ADJACENT_HTML': true,
        'ENABLE_CLONE_NODE': true,
        'ENABLE_TEMPLATE_CONTENT': true,
        'ENABLE_MUTATION_OBSERVER': true,
      }
    })
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
          node.tagType = 0 /* ELEMENT */
        }

        // v-html
        const props = node.props
        if(props.find(prop => prop.type === 7 && prop.name === 'html')) {
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
