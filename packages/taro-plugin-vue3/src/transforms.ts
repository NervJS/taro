import { internalComponents, toCamelCase, capitalize } from '@tarojs/shared/dist/template'
import { DEFAULT_Components } from '@tarojs/runner-utils'

import type { RootNode, TemplateChildNode, TransformContext, ElementNode, AttributeNode, DirectiveNode, SimpleExpressionNode, NodeTransform } from '@vue/compiler-core'

function findEnv (source: string) {
  const envREG = /(?<=(taro-env|taroEnv)=("|'))([a-z0-9]+)(?=("|'))/g
  const found = source.match(envREG)
  return found !== null ? found[0] : found
}

function isTaroEnv (propName: string) {
  return propName === 'taro-env' || propName === 'taroEnv'
}

/**
 * Transform elements with `taro-env` or `taroEnv` attribute.
 * The value of `taro-env` or `taroEnv` must be the same as `process.env.TARO_ENV`.
 * For example:
 * `<view taro-env="weapp">weapp specific node</view>`
 * is basically equal to
 * `<view v-if="process.env.TARO_ENV === 'weapp'">weapp specific node</view>`
 */
export function transformTaroEnv (node: RootNode | TemplateChildNode, ctx: TransformContext) {
  if (node.type >= 9 && node.type <= 11) {
    const source = node.type === 11
      ? node.codegenNode?.loc.source || ''
      : node.loc.source

    const targetEnv = findEnv(source)

    if (Boolean(targetEnv) && targetEnv !== process.env.TARO_ENV) {
      ctx.removeNode(node as TemplateChildNode)
    }
  } else if (node.type === 1) {
    node.props.forEach((prop, index) => {
      if (prop.type === 6 && isTaroEnv(prop.name)) {
        process.env.TARO_ENV !== prop.value?.content
          ? ctx.removeNode(node)
          : node.props.splice(index, 1)
      }
    })
  }
}

const CUSTOM_WRAPPER = 'custom-wrapper'

/**
 * Transform and collect native tags and components.
 */
export function transformMiniNativeTags (data: Record<string, any>): NodeTransform {
  return (node) => {
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
  }
}

/**
 * Transform h5 tags by adding a `taro-` prefix.
 */
export function trnasformH5Tags (node: RootNode | TemplateChildNode) {
  if (node.type === 1 /* ELEMENT */) {
    node = node as ElementNode
    const nodeName = node.tag
    if (DEFAULT_Components.has(nodeName)) {
      node.tag = `taro-${nodeName}`
      node.tagType = 1 /* 0: ELEMENT, 1: COMPONENT */
    }
  }
}
