import { hooks, isArray, isNull, isString, isUndefined, Shortcuts, toCamelCase, toDashed, warn } from '@tarojs/shared'

import { PROPERTY_THRESHOLD } from '../constants'
import { MutationObserver, MutationRecordType } from '../dom-external/mutation-observer'
import { TaroElement } from './element'
import { styleProperties } from './style_properties'

function recordCss (obj: Style) {
  MutationObserver.record({
    type: MutationRecordType.ATTRIBUTES,
    target: obj._element,
    attributeName: 'style',
    oldValue: obj.cssText
  })
}

function enqueueUpdate (obj: Style) {
  const element = obj._element
  if (element._root) {
    element.enqueueUpdate({
      path: `${element._path}.${Shortcuts.Style}`,
      value: obj.cssText
    })
  }
}

function setStyle (this: Style, newVal: string, styleKey: string) {
  process.env.NODE_ENV !== 'production' && warn(
    isString(newVal) && newVal.length > PROPERTY_THRESHOLD,
    `Style 属性 ${styleKey} 的值数据量过大，可能会影响渲染性能，考虑使用 CSS 类或其它方案替代。`
  )

  const old = this[styleKey]

  if (old === newVal) return

  !this._pending && recordCss(this)

  if (isNull(newVal) || isUndefined(newVal) || newVal === '') {
    this._usedStyleProp.delete(styleKey)
    delete this._value[styleKey]
  } else {
    this._usedStyleProp.add(styleKey)
    this._value[styleKey] = newVal
  }

  !this._pending && enqueueUpdate(this)
}

function initStyle (ctor: typeof Style, styleProperties: string[]) {
  const properties = {}

  for (let i = 0; i < styleProperties.length; i++) {
    const styleKey = styleProperties[i]

    if (ctor[styleKey]) return

    properties[styleKey] = {
      get (this: Style) {
        const val = this._value[styleKey]
        return isNull(val) || isUndefined(val) ? '' : val
      },
      set (this: Style, newVal: string) {
        setStyle.call(this, newVal, styleKey)
      }
    }
  }

  Object.defineProperties(ctor.prototype, properties)
}

function isCssVariable (propertyName) {
  return /^--/.test(propertyName)
}

export class Style {
  public _pending: boolean

  public _usedStyleProp: Set<string>

  public _value: Partial<CSSStyleDeclaration>

  public _element: TaroElement

  public constructor (element: TaroElement) {
    this._element = element
    this._usedStyleProp = new Set()
    this._value = {}
  }

  private setCssVariables (styleKey: string) {
    this.hasOwnProperty(styleKey) || Object.defineProperty(this, styleKey, {
      enumerable: true,
      configurable: true,
      get: () => {
        return this._value[styleKey] || ''
      },
      set: (newVal: string) => {
        setStyle.call(this, newVal, styleKey)
      }
    })
  }

  public get cssText () {
    if (!this._usedStyleProp.size) return ''

    const texts: string[] = []
    this._usedStyleProp.forEach(key => {
      const val = this[key]
      if (isNull(val) || isUndefined(val)) return
      let styleName = isCssVariable(key) ? key : toDashed(key)
      if (styleName.indexOf('webkit') === 0 || styleName.indexOf('Webkit') === 0) {
        styleName = `-${styleName}`
      }
      texts.push(`${styleName}: ${val};`)
    })
    return texts.join(' ')
  }

  public set cssText (str: string) {
    this._pending = true
    recordCss(this)

    this._usedStyleProp.forEach(prop => {
      this.removeProperty(prop)
    })

    if (str === '' || isUndefined(str) || isNull(str)) {
      this._pending = false
      enqueueUpdate(this)
      return
    }

    const rules = str.split(';')

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i].trim()
      if (rule === '') {
        continue
      }

      // 可能存在 'background: url(http:x/y/z)' 的情况
      const [propName, ...valList] = rule.split(':')
      const val = valList.join(':')

      if (isUndefined(val)) {
        continue
      }
      this.setProperty(propName.trim(), val.trim())
    }

    this._pending = false
    enqueueUpdate(this)
  }

  public setProperty (propertyName: string, value?: string | null) {
    if (propertyName[0] === '-') {
      // 支持 webkit 属性或 css 变量
      this.setCssVariables(propertyName)
    } else {
      propertyName = toCamelCase(propertyName)
    }

    if (isNull(value) || isUndefined(value)) {
      this.removeProperty(propertyName)
    } else {
      this[propertyName] = value
    }
  }

  public removeProperty (propertyName: string): string {
    propertyName = toCamelCase(propertyName)
    if (!this._usedStyleProp.has(propertyName)) {
      return ''
    }

    const value = this[propertyName]
    this[propertyName] = undefined
    return value
  }

  public getPropertyValue (propertyName: string) {
    propertyName = toCamelCase(propertyName)
    const value = this[propertyName]
    if (!value) {
      return ''
    }

    return value
  }
}

initStyle(Style, styleProperties)

hooks.tap('injectNewStyleProperties', (newStyleProperties: string[]) => {
  if (isArray(newStyleProperties)) {
    initStyle(Style, newStyleProperties)
  } else {
    if (typeof newStyleProperties !== 'string') return

    initStyle(Style, [newStyleProperties])
  }
})
