import { TaroElement } from '@tarojs/runtime'
import {
  capitalize,
  internalComponents,
  isFunction,
  isObject,
  toCamelCase,
} from '@tarojs/shared'

interface DangerouslySetInnerHTML {
  __html?: string
}
type ClassList = { [key: string]: boolean };

function isEventName (s: string) {
  return s.startsWith('on')
}

function setEvent (
  dom: TaroElement,
  name: string,
  value: unknown,
  oldValue?: unknown
) {
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
      dom.removeEventListener(eventName, oldValue, false)
      dom.addEventListener(eventName, value, { isCapture, sideEffect: false })
    } else {
      dom.addEventListener(eventName, value, isCapture)
    }
  } else {
    dom.removeEventListener(eventName, oldValue)
  }
}

// 优化后的代码
export function setProperty (
  dom: TaroElement,
  name: string,
  value: any,
  oldValue?: any
) {
  if (name === 'key' || name === 'children' || name === 'ref') return
  if (name === 'classList') {
    updateClassList(dom, value as ClassList)
  } else if (isEventName(name)) {
    setEvent(dom, name, value, oldValue)
  } else if (name === 'dangerouslySetInnerHTML') {
    updateInnerHTML(dom, value as DangerouslySetInnerHTML, oldValue as DangerouslySetInnerHTML)
  } else if (!isFunction(value)) {
    updateAttribute(dom, name, value)
  }
}

function updateClassList (dom: TaroElement, newValue: ClassList) {
  const [addList, removeList]: [string[], string[]] = [[], []]
  for (const key in newValue) {
    if (newValue[key]) {
      addList.push(key)
    } else {
      removeList.push(key)
    }
  }
  (dom.classList as any).add(...addList);
  (dom.classList as any).remove(...removeList)
}

function updateInnerHTML (dom: TaroElement, newValue: DangerouslySetInnerHTML, oldValue: DangerouslySetInnerHTML) {
  const newHtml = newValue?.__html ?? ''
  const oldHtml = oldValue?.__html ?? ''
  if (newHtml || oldHtml) {
    if (newHtml !== oldHtml) {
      dom.innerHTML = newHtml
    }
  }
}

function updateAttribute (dom: TaroElement, name: string, value: any) {
  if (value == null) {
    dom.removeAttribute(name)
  } else {
    // 处理对象类型的style样式
    if (name === 'style' && isObject<Record<string, any>>(value)) {
      value = Object.keys(value).reduce((acc: string[], key) => {
        acc.push(`${key}: ${value[key]}`)
        return acc
      }, []).join(';')
    }
    dom.setAttribute(name, value)
  }
}
