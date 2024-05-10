import { isObject, isUndefined, toCamelCase, toDashed } from '@tarojs/shared'

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
    // 复制，防止被篡改到attr上的原始内容
    this._st.hmStyle = Object.assign({}, this.el._attrs?.__hmStyle) || {}
    if (value === '' || value === undefined || value === null) {
      // 清空style，只保留class的样式
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

      if (typeof val === 'undefined') {
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
      if (value === '') {
        // value设置为null或者''了
        this.removeProperty(prop)
        return
      }
      // 判断class的样式表中是否存在该属性
      // 如果存在，则style删除，无需把hmStyle的值删除
      // 如果不存在，则hmStyle上该样式是style设置的，需要删除
      if (isUndefined(this.el._attrs?.__hmStyle?.[prop])) {
        if (this.el && this.el._st) {
          this.el._st.hmStyle[prop] = this.el._attrs?.__hmStyle?.[prop]
        }
        return
      }
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
  // FIXME 临时使用 Proxy 代理，后续需要优化
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
