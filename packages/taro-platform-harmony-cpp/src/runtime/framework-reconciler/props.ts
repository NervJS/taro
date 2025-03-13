import { FormElement } from '@tarojs/runtime'
import { isObject } from '@tarojs/shared'

import type { TaroElement } from '@tarojs/runtime'

export type Props = Record<string, unknown>

function isEqual (obj1, obj2) {
  // 首先检查引用是否相同
  if (obj1 === obj2) {
    return true
  }

  // 如果两者中有一个不是对象，或者为 null，直接返回 false
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false
  }

  // 获取两个对象键的数组
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  // 如果键的数量不相同，对象显然不相等
  if (keys1.length !== keys2.length) {
    return false
  }

  // 遍历对象的每个键，比较两个对象同一键的值
  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i]
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  // 如果所有键的值都相等，返回 true
  return true
}

export function updateProps (dom: TaroElement, oldProps: Props, newProps: Props) {
  const updatePayload = getUpdatePayload(dom, oldProps, newProps)
  if (updatePayload) {
    updatePropsByPayload(dom, oldProps, updatePayload)
  }
}

export function updatePropsByPayload (dom: TaroElement, oldProps: Props, updatePayload: any[]) {
  return nativeUIManager.updatePropsByPayload(dom, oldProps, updatePayload)
}

export function getUpdatePayload (dom: TaroElement, oldProps: Props, newProps: Props) {
  let i: string
  let updatePayload: any[] | null = null

  for (i in oldProps) {
    if (!(i in newProps)) {
      updatePayload ||= []
      updatePayload.push(i, null)
    }
  }
  for (i in newProps) {
    if (oldProps[i] !== newProps[i] || (dom instanceof FormElement && i === 'value')) {
      // 如果都是 style，且 style 里面的值相等，则无需记录到 payload 中
      if (i === 'style' && isObject(oldProps[i]) && isObject(newProps[i]) && isEqual(oldProps[i], newProps[i])) continue

      updatePayload ||= []
      updatePayload.push(i, newProps[i])
    }
  }

  return updatePayload
}
