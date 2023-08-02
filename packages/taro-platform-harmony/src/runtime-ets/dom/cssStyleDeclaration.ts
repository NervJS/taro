import { toCamelCase, toDashed } from '@tarojs/shared'

import { TaroElement } from './element'

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
      this.el._st = {}
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
    const node = this.el
    prop = prop.includes('-') ? toCamelCase(prop) : prop
    if ((typeof value === 'string' && value.length) || typeof value === 'number') {
      node._st[prop] = value
    } else if (!value) {
      // '' | undefined | null
      this.removeProperty(prop)
    }
  }

  public getPropertyValue (prop: string): string | number {
    const node = this.el
    prop = prop.includes('-') ? toCamelCase(prop) : prop
    const value = node._st[prop]
    return value === undefined ? '' : value
  }

  public removeProperty (prop: string): string | number {
    const node = this.el
    prop = prop.includes('-') ? toCamelCase(prop) : prop
    const value = node._st[prop]
    if (value === undefined) {
      return ''
    } else {
      delete node._st[prop]
      // node._st = { ...node._st }
      return value
    }
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
