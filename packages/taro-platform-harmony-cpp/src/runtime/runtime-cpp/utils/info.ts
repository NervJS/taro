import { isFunction } from '@tarojs/shared'

import { Current } from '../current'

import type { TaroElement } from '../dom/element/element'
import type { TFunc } from '../interface'

export function triggerAttributesCallback (node, attributeName) {
  if (!node) return

  const value = node._attrs[attributeName]
  const cb = node._nodeInfo.attributeCallback[attributeName]

  isFunction(cb) && cb(value)
}

export function initComponentNodeInfo (node: TaroElement) {
  node._nodeInfo.eventMap = {}
  node._nodeInfo.promiseMap = {}
  node._nodeInfo.attributeCallback = {}
}

export function runInDebug (fn: TFunc) {
  if (Current.isDebug) {
    try {
      fn()
    } catch (e) {
      printWithStack('runInDebug', e)
    }
  }
}

export function printWithStack (method: string, err: Error = new Error(), ...args: any[]) {
  console.error(`TARO_LOG(${method}): `, ...args.map(arg => typeof arg === 'object' ? JSON.stringify(arg || '') : arg), err.message, err.stack)
}

export function printInfo (method: string, ...args: any[]) {
  console.log(`TARO_LOG(${method}): `, ...args.map(arg => typeof arg === 'object' ? JSON.stringify(arg || '') : arg)) // eslint-disable-line no-console
}
