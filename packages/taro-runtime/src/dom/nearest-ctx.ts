import { NodeType } from './node_types'

import type { MpInstance } from '../interface'
import type { TaroElement } from './element'
import type { TaroNode } from './node'
import type { TaroRootElement } from './root'

// Tokens identify roots without keeping a moved node's previous root alive.
const nearestCtxRootTokens = new WeakMap<TaroRootElement, object>()
const nearestCtxCache = new WeakMap<TaroNode, {
  value: MpInstance | null
  rootToken: object
  nearestCtxEpoch: number
}>()

export function isNearestCtxEnv (): boolean {
  return process.env.TARO_ENV === 'weapp' || process.env.TARO_ENV === 'jd'
}

export function getNearestCtx (node: TaroNode): MpInstance | null | undefined {
  if (!isNearestCtxEnv()) {
    return undefined
  }
  const root = node._root
  if (root == null) {
    return null
  }
  let rootToken = nearestCtxRootTokens.get(root)
  if (rootToken === undefined) {
    rootToken = {}
    nearestCtxRootTokens.set(root, rootToken)
  }
  const cached = nearestCtxCache.get(node)
  if (cached && cached.rootToken === rootToken && cached.nearestCtxEpoch === root.nearestCtxEpoch) {
    return cached.value
  }
  const value = resolveNearestCtxValue(node, root)
  nearestCtxCache.set(node, { value, rootToken, nearestCtxEpoch: root.nearestCtxEpoch })
  return value
}

function resolveNearestCtxValue (node: TaroNode, root: TaroRootElement): MpInstance | null {
  if (node.nodeType === NodeType.ELEMENT_NODE) {
    const ctx = (node as TaroElement).ctx
    if (ctx != null) return ctx as MpInstance
  }
  let current: TaroNode | null = node.parentNode
  while (current) {
    if (current.nodeType === NodeType.ELEMENT_NODE) {
      const ctx = (current as TaroElement).ctx
      if (ctx != null) return ctx as MpInstance
    }
    current = current.parentNode
  }
  return root.ctx ?? null
}

export function bumpNearestCtxEpochForRoot (root: TaroRootElement | null | undefined): void {
  if (!isNearestCtxEnv() || root == null) {
    return
  }
  if (typeof root.bumpNearestCtxEpoch === 'function') {
    root.bumpNearestCtxEpoch()
  }
}
