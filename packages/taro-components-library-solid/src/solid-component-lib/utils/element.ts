import { isObject } from '@tarojs/shared'
import { setAttribute as _$setAttribute } from 'solid-js/web'

export function syncEvent(el: HTMLElement & { __events?: { [key: string]: ((e: Event) => any) | undefined } }, propName: string, propValue: any) {
  const eventName = propName.substring(2)[0].toLowerCase() + propName.substring(3)

  const eventStore = el.__events || (el.__events = {})
  const oldEventHandler = eventStore[eventName]

  if (oldEventHandler) {
    el.removeEventListener(eventName, oldEventHandler)
  }

  el.addEventListener(
    eventName,
    (eventStore[eventName] = function handler(e: Event) {
      if (propValue) {
        propValue.call(this, e)
      }
    })
  )
}

export function syncAttribute(el: HTMLElement, attribute: string, value: any) {
  if (attribute === 'style') {
    if (isObject(value)) {
      value = Object.keys(value).reduce((acc, key) => {
        acc.push(`${key}: ${value[key]}`)
        return acc
      }, []).join(';')
    }
    el.style.cssText = value
  } else if (attribute === 'classList') {
    const [addList, removeList] = [[], []]
    if (isObject<Record<string, any>>(value)) {
      for (const k in value) {
        if (value[k]) {
          addList.push(k)
        } else {
          removeList.push(k)
        }
      }
      el.classList.add(...addList)
      el.classList.remove(...removeList)
    }
  } else {
    _$setAttribute(el, attribute, value)
  }
}
