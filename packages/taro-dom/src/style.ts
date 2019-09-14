import { styleProperties } from './style_properties'
import { isUndefined } from './utils/is'

function toDashed (s: string) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
function dashedToCamelCase (s: string) {
  let camel = ''
  let nextCap = false
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i]
      nextCap = false
    } else {
      nextCap = true
    }
  }
  return camel
}

export class Style {
  private _usedStyleProp: Set<string>

  private onUpdate: () => void

  public _value: Partial<CSSStyleDeclaration>

  public constructor (onUpdate: () => void) {
    this.onUpdate = onUpdate
    this._usedStyleProp = new Set()
    this._value = {}
    this.initStyle()
  }

  private initStyle () {
    const properties = {}
    const update = this.onUpdate
    const usedStyleProp = this._usedStyleProp

    for (let i = 0; i < styleProperties.length; i++) {
      const styleKey = styleProperties[i]
      properties[styleKey] = {
        get () {
          return this._value[styleKey] || ''
        },
        set (newVal: string) {
          const old = this[styleKey]
          if (newVal) {
            usedStyleProp.add(styleKey)
          }
          if (old !== newVal) {
            this._value[styleKey] = newVal
            update()
          }
        }
      }
    }

    Object.defineProperties(this, properties)
  }

  public get cssText () {
    let text = ''
    this._usedStyleProp.forEach(key => {
      const val = this[key]
      text += `${toDashed(key)}: ${val};`
    })
    return text
  }

  public set cssText (str: string) {
    if (!str) {
      return
    }

    this._usedStyleProp.forEach(prop => {
      this.removeProperty(prop)
    })

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
      this.setProperty(dashedToCamelCase(propName.trim()), val.trim())
    }
  }

  public setProperty (propertyName: string, value?: string | null) {
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
    if (!this._usedStyleProp.has(propertyName)) {
      return ''
    }

    const value = this[propertyName]
    this[propertyName] = ''
    this._usedStyleProp.delete(propertyName)
    return value
  }

  public getPropertyValue (propertyName: string) {
    const value = this[propertyName]
    if (!value) {
      return ''
    }

    return value
  }
}
