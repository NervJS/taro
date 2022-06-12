import { isUndefined, toCamelCase, toDashed, Shortcuts, warn, isString } from '@tarojs/shared'
import { styleProperties } from './style_properties'
import { TaroElement } from './element'
import { PROPERTY_THRESHOLD } from '../constants'
import { MutationObserver } from '../dom-external/mutation-observer'
import { MutationRecordType } from '../dom-external/mutation-observer/record'

function setStyle (this: Style, newVal: string, styleKey: string) {
  const old = this[styleKey]
  const oldCssTxt = this.cssText
  if (newVal) {
    this._usedStyleProp.add(styleKey)
  }

  process.env.NODE_ENV !== 'production' && warn(
    isString(newVal) && newVal.length > PROPERTY_THRESHOLD,
    `Style 属性 ${styleKey} 的值数据量过大，可能会影响渲染性能，考虑使用 CSS 类或其它方案替代。`
  )

  if (old !== newVal) {
    this._value[styleKey] = newVal
    this._element.enqueueUpdate({
      path: `${this._element._path}.${Shortcuts.Style}`,
      value: this.cssText
    })
    // @Todo:
    //   el.style.cssText = 'x: y;m: n'（Bug: 触发两次）
    //   el.style.cssText = 'x: y'（正常）
    //   el.style.x = y（正常）
    MutationObserver.record({
      type: MutationRecordType.ATTRIBUTES,
      target: this._element,
      attributeName: 'style',
      oldValue: oldCssTxt
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

function isCssVariable (propertyName) {
  return /^--/.test(propertyName)
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
    const texts: string[] = []
    this._usedStyleProp.forEach(key => {
      const val = this[key]
      if (!val) return
      let styleName = isCssVariable(key) ? key : toDashed(key)
      if (styleName.indexOf('webkit') === 0 || styleName.indexOf('Webkit') === 0) {
        styleName = `-${styleName}`
      }
      texts.push(`${styleName}: ${val};`)
    })
    return texts.join(' ')
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

      // 可能存在 'background: url(http:x/y/z)' 的情况
      const [propName, ...valList] = rule.split(':')
      const val = valList.join(':')

      if (isUndefined(val)) {
        continue
      }
      this.setProperty(propName.trim(), val.trim())
    }
  }

  public setProperty (propertyName: string, value?: string | null) {
    if (propertyName[0] === '-') {
      // 支持 webkit 属性或 css 变量
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
