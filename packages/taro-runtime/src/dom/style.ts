import { isUndefined, toCamelCase, toDashed, Shortcuts, warn, isString } from '@tarojs/shared'
import { styleProperties } from './style_properties'
import { TaroElement } from './element'
import { PROPERTY_THRESHOLD } from '../constants'

function setStyle (this: Style, newVal: string, styleKey: string) {
  const old = this[styleKey]
  if (newVal) {
    this._usedStyleProp.add(styleKey)
  }

  warn(
    isString(newVal) && newVal.length > PROPERTY_THRESHOLD,
    `Style 属性 ${styleKey} 的值数据量过大，可能会影响渲染性能，考虑使用 CSS 类或其它方案替代。`
  )

  if (old !== newVal) {
    this._value[styleKey] = newVal
    this._element.enqueueUpdate({
      path: `${this._element._path}.${Shortcuts.Style}`,
      value: this.cssText
    })
  }
}

function initStyle (ctor: typeof Style) {
  const properties = {}

  for (let i = 0; i < styleProperties.length; i++) {
    const styleKey = styleProperties[i]
    properties[styleKey] = {
      get (this: Style) {
        return this._value[styleKey] || ''
      },
      set (this: Style, newVal: string) {
        setStyle.call(this, newVal, styleKey)
      }
    }
  }

  Object.defineProperties(ctor.prototype, properties)
}

export class Style {
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
    let text = ''
    this._usedStyleProp.forEach(key => {
      const val = this[key]
      if (!val) return
      text += `${toDashed(key)}: ${val};`
    })
    return text
  }

  public set cssText (str: string) {
    if (str == null) {
      str = ''
    }

    this._usedStyleProp.forEach(prop => {
      this.removeProperty(prop)
    })

    if (str === '') {
      return
    }

    const rules = str.split(';')

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i].trim()
      if (rule === '') {
        continue
      }

      const [propName, val] = rule.split(':')
      if (isUndefined(val)) {
        continue
      }
      this.setProperty(propName.trim(), val.trim())
    }
  }

  public setProperty (propertyName: string, value?: string | null) {
    if (propertyName[0] === '-') {
      this.setCssVariables(propertyName)
    } else {
      propertyName = toCamelCase(propertyName)
    }
    if (isUndefined(value)) {
      return
    }

    if (value === null || value === '') {
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
    this[propertyName] = ''
    this._usedStyleProp.delete(propertyName)
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

initStyle(Style)
