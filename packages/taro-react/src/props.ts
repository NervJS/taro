import { TaroElement, Style } from '@tarojs/runtime'
import { isFunction, isString, isObject, isNumber } from '@tarojs/shared'
import { CommonEvent } from '@tarojs/components'

export type Props = Record<string, unknown>

function isEventName (s: string) {
  return s[0] === 'o' && s[1] === 'n'
}

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i

export function updateProps (dom: TaroElement, oldProps: Props, newProps: Props) {
  let i: string

  for (i in oldProps) {
    if (!(i in newProps)) {
      setProperty(dom, i, null, oldProps[i])
    }
  }

  for (i in newProps) {
    if (oldProps[i] !== newProps[i]) {
      setProperty(dom, i, newProps[i], oldProps[i])
    }
  }
}

const listeners = new Map<string, Record<string, Function>>()

function eventProxy (e: CommonEvent) {
  listeners.get(e.target.id)![e.type](e)
}

function setStyle (style: Style, key: string, value: string | number) {
  style[key] =
    isNumber(value) && IS_NON_DIMENSIONAL.test(key) === false
      ? value + 'px'
      : value == null
        ? ''
        : value
}

type StyleValue = Record<string, string | number>

function setProperty (dom: TaroElement, name: string, value: unknown, oldValue?: unknown) {
  name = name === 'className' ? 'class' : name

  if (
    name === 'key' ||
    name === 'children' ||
    name === 'ref'
  ) {
    // skip
  } else if (name === 'style') {
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
            setStyle(style, i, '')
          }
        }
      }

      if (isObject<StyleValue>(value)) {
        for (const i in value) {
          if (!oldValue || value[i] !== (oldValue as StyleValue)[i]) {
            setStyle(style, i, value[i])
          }
        }
      }
    }
  } else if (isEventName(name)) {
    const isCapture = name !== (name = name.replace(/Capture$/, ''))
    const eventName = name.toLowerCase().slice(2)
    if (isFunction(value)) {
      if (!oldValue) {
        dom.addEventListener(eventName, eventProxy, isCapture)
        listeners.set(dom.uid, { [eventName]: value })
      } else {
        dom.removeEventListener(eventName, eventProxy)
        const event = listeners.get(dom.uid)!
        delete event[eventName]
      }
    } else {
      console.error('')
    }
  } else if (
    !isFunction(value) &&
    name !== 'dangerouslySetInnerHTML' // TODO: 实现 innerHTML
  ) {
    if (value == null) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, value as string)
    }
  }
}
