import { document, TaroText } from '@tarojs/runtime'
import { isString } from '@tarojs/shared'
import { createRenderer } from 'solid-js/universal'

import { setProperty } from './props'

import type { TaroElement, TaroNode } from '@tarojs/runtime'

const renderer = createRenderer<TaroNode>({
  createElement(type: string) {
    return document.createElement(type)
  },
  createTextNode(text) {
    return document.createTextNode(text)
  },
  replaceText(textNode, value) {
    textNode.textContent = value
  },
  setProperty(node: TaroElement, name: string, value, prev) {
    setProperty(node, name, value, prev)
  },
  insertNode(parent, node, anchor) {
    parent.insertBefore(node, anchor)
  },
  isTextNode(node: TaroNode) {
    if (isString(node)) return true
    return node instanceof TaroText
  },
  removeNode(parent: TaroElement, node: TaroElement) {
    parent.removeChild(node)
  },
  getParentNode(node: TaroNode) {
    return node.parentNode || undefined
  },
  getFirstChild(node: TaroElement) {
    return node.firstChild || undefined
  },
  getNextSibling(node: TaroElement) {
    return node.nextSibling || undefined
  },
})

export const render = renderer.render
export const effect = renderer.effect
export const memo = renderer.memo
export const createComponent = renderer.createComponent
export const createElement = renderer.createElement
export const createTextNode = renderer.createTextNode
export const insertNode = renderer.insertNode
export const insert = renderer.insert
export const spread = renderer.spread
export const setProp = renderer.setProp
export const mergeProps = renderer.mergeProps
export const use = renderer.use

export function Fragment(props) {
  return props.children
}
