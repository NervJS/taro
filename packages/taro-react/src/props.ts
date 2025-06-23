import { convertNumber2PX, eventHandlerTTDom, FormElement } from '@tarojs/runtime'
import { capitalize, executeLogicByRenderType, injectV2EnableTTDom, internalComponents, isFunction, isNumber, isObject, isString, isUnitlessProperty, isV2EnableTTDom, PLATFORM_TYPE, toCamelCase } from '@tarojs/shared'

import type { Style, TaroElement } from '@tarojs/runtime'

// 拓展TaroElement的属性

export type Props = Record<string, unknown>

const IS_NON_DIMENSIONAL = /aspect|acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i

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

export function updatePropsByPayload (dom: TaroElement, oldProps: Props, updatePayload: any[]) {
  const handlers: (() => void)[] = []
  let fixedHandler: (() => void) | null = null
  for (let i = 0; i < updatePayload.length; i += 2) {
    // key, value 成对出现
    const key = updatePayload[i]
    const newProp = updatePayload[i + 1]
    const oldProp = oldProps[key]
    if (process.env.TARO_PLATFORM === PLATFORM_TYPE.HARMONY) {
      if (key === '__fixed') {
        // hack: __fixed最先识别
        fixedHandler = () => setProperty(dom, key, newProp, oldProp)
        continue
      }
      // 鸿蒙样式前置插入，防止覆盖style
      if (key === '__hmStyle') {
        handlers.splice(0, 0, () => setHarmonyStyle(dom, newProp, oldProp))
      } else {
        handlers.push(() => setProperty(dom, key, newProp, oldProp))
      }
    } else {
      setProperty(dom, key, newProp, oldProp)
    }
  }
  if (process.env.TARO_PLATFORM === PLATFORM_TYPE.HARMONY) {
    fixedHandler && fixedHandler()
    for (let i = 0; i < handlers.length; i++) {
      handlers[i]()
    }
  }
}

export function getUpdatePayload (dom: TaroElement, oldProps: Props, newProps: Props) {
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
      // 如果都是 style，且 style 里面的值相等，则无需记录到 payload 中
      if (i === 'style' && isObject(oldProps[i]) && isObject(newProps[i]) && isEqual(oldProps[i], newProps[i])) continue

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

  if (eventName === 'click' && process.env.TARO_PLATFORM !== PLATFORM_TYPE.HARMONY && compName in internalComponents) {
    eventName = 'tap'
  }

  if (!isV2EnableTTDom()) {
    if (isFunction(value)) {
      if (oldValue) {
        dom.removeEventListener(eventName, oldValue as any, process.env.TARO_PLATFORM !== PLATFORM_TYPE.HARMONY ? false : undefined)
        dom.addEventListener(eventName, value, process.env.TARO_PLATFORM !== PLATFORM_TYPE.HARMONY ? { isCapture, sideEffect: false } : undefined)
      } else {
        dom.addEventListener(eventName, value, process.env.TARO_PLATFORM !== PLATFORM_TYPE.HARMONY ? isCapture : undefined)
      }
    } else {
      dom.removeEventListener(eventName, oldValue as any)
    }
  } else {
    // v2 tt-dom
    if (isFunction(oldValue)) {
      dom.removeEventListener(`bind${eventName}`, dom[`__${eventName}__`])
    }
    if (isFunction(value)) {
      dom[`__${eventName}__`] = eventHandlerTTDom.bind(this, dom, value)
      dom.addEventListener(`bind${eventName}`, dom[`__${eventName}__`], isCapture)
    }
  }
}

function setStyle (style: Style, key: string, value: unknown) {
  if (key[0] === '-' && process.env.TARO_PLATFORM !== PLATFORM_TYPE.HARMONY) {
    // css variables need not further judgment
    style.setProperty(key, (value as string).toString())
    return
  }

  style[key] =
    isNumber(value) && IS_NON_DIMENSIONAL.test(key) === false
      ? (process.env.TARO_PLATFORM === PLATFORM_TYPE.HARMONY ? value + 'px' : convertNumber2PX(value))
      : value === null
        ? ''
        : value
}

type StyleValue = Record<string, string | number>
interface DangerouslySetInnerHTML {
  __html?: string
}

// 鸿蒙样式特殊处理，需要在插入顺序中前置插入，防止覆盖了style
function setHarmonyStyle(dom: TaroElement, value: unknown, oldValue?: unknown) {
  // @ts-ignore
  const style = dom._st.hmStyle // __hmStyle是已经被处理过的鸿蒙样式，可以直接塞进hmStyle对象内
  if (isObject<StyleValue>(oldValue)) {
    for (const i in oldValue) {
      if (!(value && i in (value as StyleValue))) {
        // 鸿蒙伪类特殊处理
        if (process.env.TARO_PLATFORM === PLATFORM_TYPE.HARMONY) {
          if (i === '::after' || i === '::before') {
            setPseudo(dom, i, null)
          } else if (['::first-child', '::last-child', '::empty'].includes(i) || `${i}`.indexOf('::nth-child') === 0) {
            // @ts-ignore
            dom.set_pseudo_class(i, null)
          } else {
            if (i === 'position' && oldValue[i] === 'fixed') {
              // @ts-ignore
              dom.setLayer(0)
            } else if (i === 'animationName') {
              // @ts-ignore
              dom.setAnimation(false)
            }
            style[i] = ''
          }
        } else {
          style[i] = ''
        }
      }
    }
  }
  if (isObject<StyleValue>(value)) {
    for (const i in value) {
      if (!oldValue || !isEqual(value[i], (oldValue as StyleValue)[i])) {
        // 鸿蒙伪类特殊处理
        if (process.env.TARO_PLATFORM === PLATFORM_TYPE.HARMONY) {
          if (i === '::after' || i === '::before') {
            setPseudo(dom, i, value[i] as unknown as StyleValue)
          } else if (['::first-child', '::last-child', '::empty'].includes(i) || i.startsWith('::nth-child')) {
            // @ts-ignore
            dom.set_pseudo_class(i, value[i])
          } else {
            if (i === 'position') {
              if (value[i] === 'fixed' || (value[i] !== 'fixed' && oldValue?.[i])) {
                // @ts-ignore
                dom.setLayer(value[i] === 'fixed' ? 1 : 0)
              }
            } else if (i === 'animationName') {
              // @ts-ignore
              dom.setAnimation(true)
            }
            style[i] = value[i]
          }
        } else {
          style[i] = value[i]
        }
      }
    }
  }

  dom.setAttribute('__hmStyle', value)
}

function styleObjectToCss(style) {
  return Object.entries(style)
    .map(([key, value]) => {
      const kebabCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      const cssValue =
        typeof value === 'number' && !isUnitlessProperty(kebabCaseKey)
          ? `${value}px`
          : value
      return `${kebabCaseKey}: ${cssValue};`
    })
    .join(' ')
}


function setProperty (dom: TaroElement, name: string, value: unknown, oldValue?: unknown) {
  name = name === 'className' ? 'class' : name

  if (
    name === 'key' ||
    name === 'children' ||
    name === 'ref'
  ) {
    // skip
  } else if (name === 'style') {
    executeLogicByRenderType(() => {
      if (/harmony.*cpp/.test(process.env.TARO_ENV || '')) {
        return dom.setAttribute('_style4cpp', value)
      }
      const style = dom.style
      if (isString(value)) {
        style.cssText = value
      } else {
        if (isString(oldValue)) {
          style.cssText = ''
          oldValue = null
        }

        if (isObject<StyleValue>(oldValue)) {
          for (const i in oldValue) {
            if (!(value && i in (value as StyleValue))) {
              // Harmony特殊处理
              if (process.env.TARO_PLATFORM === PLATFORM_TYPE.HARMONY && i === 'position' && oldValue[i] === 'fixed') {
                // @ts-ignore
                dom.setLayer(0)
              }
              setStyle(style, i, '')
            }
          }
        }

        if (isObject<StyleValue>(value)) {
          for (const i in value) {
            if (!oldValue || !isEqual(value[i], (oldValue as StyleValue)[i])) {
              // Harmony特殊处理
              if (process.env.TARO_PLATFORM === PLATFORM_TYPE.HARMONY && i === 'position') {
                if (value[i] === 'fixed' || (value[i] !== 'fixed' && oldValue?.[i])) {
                  // @ts-ignore
                  dom.setLayer(value[i] === 'fixed' ? 1 : 0)
                }
              }
              setStyle(style, i, value[i])
            }
          }
        }
      }
    }, () => {
      // tt 小程序 tt-dom 接口
      if (isString(value)) {
        dom.setAttribute('style', value)
      } else if (isObject(value)) {
        dom.setAttribute('style', styleObjectToCss(value as StyleValue))
      }
    })
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
    injectV2EnableTTDom(() => {
      if (!name.startsWith('data-') && !name.startsWith('aria-')) { name = toCamelCase(name) }
    })
    if (value == null) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, value as string)
    }
  }
}

// 设置鸿蒙伪类属性(特殊设置)
function setPseudo(dom: TaroElement, name: '::after' | '::before', value: StyleValue | null) {
  if (name === '::after') {
    // @ts-ignore
    dom.set_pseudo_after(value)
  } else if (name === '::before') {
    // @ts-ignore
    dom.set_pseudo_before(value)
  }
}
