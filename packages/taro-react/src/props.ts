import { FormElement, Style, TaroElement } from '@tarojs/runtime'
import { capitalize, internalComponents, isFunction, isNumber, isObject, isString, toCamelCase } from '@tarojs/shared'

export type Props = Record<string, unknown>

function isEventName (s: string) {
  return s[0] === 'o' && s[1] === 'n'
}

const IS_NON_DIMENSIONAL = /aspect|acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i

export function updateProps (dom: TaroElement, oldProps: Props, newProps: Props) {
  const updatePayload = getUpdatePayload(dom, oldProps, newProps)
  if(updatePayload){
    updatePropsByPayload(dom, oldProps, updatePayload)
  }
}

export function updatePropsByPayload (dom: TaroElement, oldProps: Props, updatePayload: any[]){
  for(let i = 0; i < updatePayload.length; i += 2){ // key, value 成对出现
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

  if (eventName === 'click' && compName in internalComponents) {
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

function setStyle (style: Style, key: string, value: string | number) {
  if (key[0] === '-') {
    style.setProperty(key, value.toString())
    // css variables need not further judgment
    return
  }

  style[key] =
    isNumber(value) && IS_NON_DIMENSIONAL.test(key) === false
      ? value + 'px'
      : value == null
        ? ''
        : value
}

type StyleValue = Record<string, string | number>
interface DangerouslySetInnerHTML {
  __html?: string
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
