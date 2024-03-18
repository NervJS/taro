import { type Style, type TaroElement, convertNumber2PX, FormElement } from '@tarojs/runtime'
import { capitalize, internalComponents, isFunction, isNumber, isObject, isString, toCamelCase } from '@tarojs/shared'

// 拓展TaroElement的属性

export type Props = Record<string, unknown>

const isHarmony = process.env.TARO_PLATFORM === 'harmony'
const IS_NON_DIMENSIONAL = /max|aspect|acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i

function isEventName (s: string) {
  return s[0] === 'o' && s[1] === 'n'
}

function isEqual (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export function updateProps (dom: TaroElement, oldProps: Props, newProps: Props) {
  const updatePayload = getUpdatePayload(dom, oldProps, newProps)
  if (updatePayload){
    updatePropsByPayload(dom, oldProps, updatePayload)
  }
}

export function updatePropsByPayload (dom: TaroElement, oldProps: Props, updatePayload: any[]){
  const handlers: (() => void)[] = []
  for (let i = 0; i < updatePayload.length; i += 2){ 
    // key, value 成对出现
    const key = updatePayload[i]
    const newProp = updatePayload[i+1]
    const oldProp = oldProps[key]
    if (isHarmony) {
      // 鸿蒙样式前置插入，防止覆盖style
      if (key === '__hmStyle') {
        handlers.unshift(() => setHarmonyStyle(dom, newProp, oldProp))
      } else {
        handlers.push(() => setProperty(dom, key, newProp, oldProp))
      }
    } else {
      setProperty(dom, key, newProp, oldProp)
    }
  }
  if (isHarmony) {
    for (let i = 0; i < handlers.length; i++){
      handlers[i]()
    }
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

  if (eventName === 'click' && !isHarmony && compName in internalComponents) {
    eventName = 'tap'
  }

  if (isFunction(value)) {
    if (oldValue) {
      dom.removeEventListener(eventName, oldValue as any, !isHarmony ? false : undefined)
      dom.addEventListener(eventName, value, !isHarmony ? { isCapture, sideEffect: false } : undefined)
    } else {
      dom.addEventListener(eventName, value, !isHarmony ? isCapture : undefined)
    }
  } else {
    dom.removeEventListener(eventName, oldValue as any)
  }
}

function setStyle (style: Style, key: string, value: unknown) {
  if (key[0] === '-' && !isHarmony) {
    // css variables need not further judgment
    style.setProperty(key, (value as string).toString())
    return
  }

  if (isHarmony && key.startsWith('_')) {
    // harmony样式已处理
    style[key] = value == null ? '' : value
  } else {
    style[key] =
      isNumber(value) && IS_NON_DIMENSIONAL.test(key) === false
        ? convertNumber2PX(value)
        : value == null
          ? ''
          : value
  }
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
        if (isHarmony && (i === '::after' || i === '::before')) {
          setPseudo(dom, i, null)
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
        if (isHarmony && (i === '::after' || i === '::before')) {
          setPseudo(dom, i, value[i] as unknown as StyleValue)
        } else {
          style[i] = value[i]
        }
      }
    }
  }
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
            // harmony设置style，路径设置路径如下：dom.style => cssStyleDeclaration.setProperty => convertWebStyle2HmStyle => dom._st.hmStyle
            setStyle(style, i, '')
          }
        }
      }

      if (isObject<StyleValue>(value)) {
        for (const i in value) {
          if (!oldValue || !isEqual(value[i], (oldValue as StyleValue)[i])) {
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

// 设置鸿蒙伪类属性(特殊设置)
function setPseudo(dom: TaroElement, name: '::after' | '::before', value: StyleValue | null){
  if (name === '::after') {
    // @ts-ignore
    dom.set_pseudo_after(value)
  } else if (name === '::before') {
    // @ts-ignore
    dom.set_pseudo_before(value)
  }
}
