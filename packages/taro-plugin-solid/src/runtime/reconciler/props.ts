import { FormElement } from '@tarojs/runtime'
import { capitalize, internalComponents, isFunction, isObject, toCamelCase } from '@tarojs/shared'

import type { TaroElement } from '@tarojs/runtime'

export type Props = Record<string, unknown>

function isEventName (s: string) {
  return s[0] === 'o' && s[1] === 'n'
}

export function updateProps (dom: TaroElement, oldProps: Props, newProps: Props) {
  const updatePayload = getUpdatePayload(dom, oldProps, newProps)
  if (updatePayload){
    updatePropsByPayload(dom, oldProps, updatePayload)
  }
}

export function updatePropsByPayload (dom: TaroElement, oldProps: Props, updatePayload: any[]){
  for (let i = 0; i < updatePayload.length; i += 2){ // key, value 成对出现
    const key = updatePayload[i]; const newProp = updatePayload[i+1]; const oldProp = oldProps[key]
    setProperty(dom, key, newProp, oldProp)
  }
}

export function getUpdatePayload (dom: TaroElement, oldProps: Props, newProps: Props){
  let i: string
  let updatePayload: any[] | null = null

  for (i in oldProps) {
    if (!(i in newProps)) {
      (updatePayload = updatePayload || []).push(i, null)
    }
  }
  const isFormElement = dom instanceof FormElement
  for (i in newProps) {
    if (oldProps[i] !== newProps[i] || (isFormElement && i === 'value')) {
      (updatePayload = updatePayload || []).push(i, newProps[i])
    }
  }

  return updatePayload
}

// function eventProxy (e: CommonEvent) {
//   const el = document.getElementById(e.currentTarget.id)
//   const handlers = el!.__handlers[e.type]
//   handlers[0](e)
// }

function setEvent (dom: TaroElement, name: string, value: unknown, oldValue?: unknown) {
  const isCapture = name.endsWith('Capture')
  let eventName = name.toLowerCase().slice(2)
  if (isCapture) {
    eventName = eventName.slice(0, -7)
  }

  const compName = capitalize(toCamelCase(dom.tagName.toLowerCase()))

  if (eventName === 'click' && process.env.TARO_PLATFORM !== 'harmony' && compName in internalComponents) {
    eventName = 'tap'
  }

  if (isFunction(value)) {
    if (oldValue) {
      dom.removeEventListener(eventName, oldValue as any, false)
      dom.addEventListener(eventName, value, { isCapture, sideEffect: false })
    } else {
      dom.addEventListener(eventName, value, isCapture)
    }
  } else {
    dom.removeEventListener(eventName, oldValue as any)
  }
}

interface DangerouslySetInnerHTML {
  __html?: string
}
type ClassList = { [key: string]: boolean }

function diffClassList (newVal: ClassList, oldVal: ClassList) {
  const result: ClassList = {}
  for (const key in oldVal) {
    if (newVal[key] !== oldVal[key]) {
      result[key] = newVal[key]
    }
  }
  for (const key in newVal) {
    if (result.hasOwnProperty(key)) {
      continue
    }
    result[key] = newVal[key]
  }
  return result
}

export function setProperty (dom: TaroElement, name: string, value: unknown, oldValue?: unknown) {
  name = name === 'className' ? 'class' : name

  if (['key', 'children', 'ref'].includes(name)) return

  if (name === 'classList') {
    const map = diffClassList(value as ClassList, oldValue as ClassList)
    for (const key in map) {
      if (key === '') {
        continue
      }
      if (map[key]) {
        (dom as any).classList.add(key)
      } else {
        (dom as any).classList.remove(key)
      }
    }
  } else if (isEventName(name)) {
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
      // 处理对象类型的style样式
      if (name === 'style' && isObject(value)) {
        value = Object.keys(value).reduce((acc, key) => {
          acc.push(`${key}: ${(value as Record<string, string>)[key]}`)
          return acc
        }, [] as string[]).join(';')
      }
      dom.setAttribute(name, value as string)
    }
  }
}
