import { isObject, toCamelCase, toDashed } from '@tarojs/shared'

import { TaroElement } from './element/element'
import convertWebStyle2HmStyle from './stylesheet/covertWeb2Hm'

class CSSStyleDeclaration {
  // eslint-disable-next-line no-useless-constructor
  constructor(public el: TaroElement) {}

  public get _st () {
    return this.el._st
  }

  public get cssText (): string {
    const texts: string[] = []

    for (const [key, value] of Object.entries(this.el._st)) {
      const prop = toDashed(key)
      texts.push(`${prop}: ${value};`)
    }

    return texts.join(' ')
  }

  public set cssText (value: string) {
    if (value === '' || value === undefined || value === null) {
      // TODO: 清空 stylesheet 里面的 hmstyle
      // this.el._st = {}
      this._st.hmStyle = {}
      return
    }

    const rules = value.split(';')

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i].trim()
      if (rule === '') {
        continue
      }

      // 可能存在 'background: url(http:x/y/z)' 的情况
      const [propName, ...valList] = rule.split(':')
      const val = valList.join(':')

      if (typeof val === undefined) {
        continue
      }
      this.setProperty(propName.trim(), val.trim())
    }
  }

  public setProperty (prop: string, value: any): void {
    prop = prop.includes('-') ? toCamelCase(prop) : prop
    const node = this.el
    if ((typeof value === 'string' && value.length) || typeof value === 'number' || isObject(value)) {
      convertWebStyle2HmStyle({ [prop]: value }, node)
    } else if (!value) {
      this.removeProperty(prop)
    }
  }

  public getPropertyValue (prop: string): string | number {
    prop = prop.includes('-') ? toCamelCase(prop) : prop
    const node = this.el
    const value = node._st[prop]
    return value === undefined ? '' : value
  }

  public removeProperty (prop: string): string | number {
    prop = prop.includes('-') ? toCamelCase(prop) : prop
    const node = this.el
    const value = node._st.hmStyle[prop]
    delete node._st.hmStyle[prop]
    return value
  }
}

type ICSSStyleDeclaration = CSSStyleDeclaration & Record<string, any>

function createCSSStyleDeclaration (node: TaroElement): CSSStyleDeclaration {
  return new Proxy(new CSSStyleDeclaration(node), {
    set (target, prop: string, value) {
      if (prop === 'cssText') {
        Reflect.set(target, prop, value)
      } else {
        target.setProperty(prop, value)
      }
      return true
    },
    get (target, prop: string) {
      return target.getPropertyValue(prop)
    }
  })
}

export {
  createCSSStyleDeclaration,
  CSSStyleDeclaration,
  ICSSStyleDeclaration
}
