import { FormElement, TaroNativeModule } from '@tarojs/runtime'
import { isFunction, isObject } from '@tarojs/shared'

import type { TaroElement } from '@tarojs/runtime'

export type Props = Record<string, unknown>

function isEventName (s: string) {
  return s[0] === 'o' && s[1] === 'n'
}

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

interface DangerouslySetInnerHTML {
  __html?: string
}

export function updatePropsByPayload (dom: TaroElement, oldProps: Props, updatePayload: any[]) {
  if (!(dom as any).isETS) {
    return TaroNativeModule.updatePropsByPayload(dom, oldProps, updatePayload)
  }

  for (let i = 0; i < updatePayload.length; i += 2) {
    let name = updatePayload[i]

    if (['key', 'children', 'ref'].includes(name)) {
      // skip
      return
    }

    const value = updatePayload[i + 1]
    const oldValue = oldProps[name]

    name = name === 'className' ? 'class' : name
    if (isEventName(name)) {
      setEvent(dom, name, value, oldValue)
    } else if (name === 'dangerouslySetInnerHTML') {
      const newHtml = (value as DangerouslySetInnerHTML)?.__html ?? ''
      const oldHtml = (oldValue as DangerouslySetInnerHTML)?.__html ?? ''
      if (newHtml || oldHtml) {
        if (oldHtml !== newHtml) {
          dom.innerHTML = newHtml
        }
      }
    } else if (!isFunction(value)) {
      if (value == null) {
        dom.removeAttribute(name)
      } else {
        dom.setAttribute(name, value as string)
      }
    }
  }
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

function setEvent (dom: TaroElement, name: string, value: unknown, oldValue?: unknown) {
  const isCapture = name.endsWith('Capture')
  let eventName = name.toLowerCase().slice(2)
  if (isCapture) {
    eventName = eventName.slice(0, -7)
  }

  if (isFunction(value)) {
    if (oldValue) {
      dom.removeEventListener(eventName, oldValue, false)
      dom.addEventListener(eventName, value, { isCapture, sideEffect: false })
    } else {
      dom.addEventListener(eventName, value, isCapture)
    }
  } else {
    dom.removeEventListener(eventName, oldValue)
  }
}
