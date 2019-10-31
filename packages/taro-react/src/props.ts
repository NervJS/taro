import { TaroElement, Style } from '@tarojs/runtime'
import { isFunction, isString, isObject } from '@tarojs/shared'

export type Props = Record<string, any>

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

function setStyle (style: Style, key: string, value: string | number) {
  style[key] =
    typeof value === 'number' && IS_NON_DIMENSIONAL.test(key) === false
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
        dom.addEventListener(eventName, value, isCapture)
      } else {
        dom.removeEventListener(eventName, value)
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
