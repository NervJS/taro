import { TaroNode } from '@tarojs/runtime'
import { children as solidChildren, createRenderEffect, onCleanup, splitProps } from 'solid-js'

import { createElement, createTextNode, effect, insert, insertNode, setProp } from './render'

import type { Accessor } from 'solid-js'
import type { ResolvedChildren } from 'solid-js/types/reactive/signal'

export type Component = (props?: any) => TaroNode

type Children =
  | undefined
  | string
  | number
  | TaroNode
  | TaroNode[]
  | Component
  | Component[]
  | Accessor<ResolvedChildren>
  | (() => Component[])

export function h(tagName: string, props?: any, children?: Children) {
  if (typeof tagName !== 'string') {
    throw Error(`h function cant create ele for ${tagName}`)
  }
  const ele = createElement(tagName)
  const [local, otherProps] = splitProps(props, ['ref', 'children'])

  setProps(ele, otherProps)

  if (local.ref) {
    createRenderEffect(() => {
      if (typeof local.ref === 'function') {
        local.ref(ele)
      } else {
        local.ref = ele
      }
    })
  }

  // get 的处理
  if (local.hasOwnProperty('children')) {
    const descriptor = Object.getOwnPropertyDescriptor(local, 'children')
    if (descriptor?.get) {
      children = solidChildren(() => local.children)
    } else {
      children = local.children
    }
  }
  insertNodes(ele, children)

  return ele
}

function setProps(ele: TaroNode, otherProps: Record<string, any> = {}) {
  const desc = { ...otherProps }
  const plain_keys = Object.keys(desc).filter((key) => {
    if (desc[key].get) {
      return false
    }
    return true
  })
  const [plainProps, getterValues] = splitProps(otherProps, plain_keys)

  // 普通属性直接赋值
  if (Object.keys(plainProps)?.length) {
    for (const key in plainProps) {
      setProp(ele, key, plainProps[key])
    }
  }

  // 特殊属性 放到createRenderEffect中
  if (Object.keys(getterValues)?.length) {
    let preProps = {} as typeof getterValues
    effect(() => {
      for (const key in getterValues) {
        const val = getterValues[key]

        if (val === preProps[key]) {
          continue
        }
        setProp(ele, key, val, preProps[key])
        preProps[key] = val
      }
    })
    onCleanup(() => {
      preProps = {}
    })
  }
}

function insertNodes(parent: TaroNode, children: Children) {
  if (children === undefined) {
    return
  }

  let list = [] as TaroNode[] | (() => TaroNode)[]
  if (!Array.isArray(children)) {
    list = [children] as TaroNode[] | (() => TaroNode)[]
  } else {
    list = children
  }
  for (let i = 0; i < list.length; i++) {
    const child = list[i]
    const type = typeof child
    if (type === 'function') {
      insert(parent, child, null)
      continue
    }
    if (Array.isArray(child)) {
      insertNodes(parent, child)
      continue
    }

    if (child instanceof TaroNode) {
      insertNode(parent, child)
      continue
    }

    if (type === 'string') {
      const node = createTextNode(child as unknown as string)
      insertNode(parent, node)
      continue
    }

    if (type === 'number' || type === 'boolean' || child instanceof Date || child instanceof RegExp) {
      const node = createTextNode(child.toString())
      insertNode(parent, node)
      continue
    }
  }
}
