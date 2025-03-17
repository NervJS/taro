import { isNull, isUndefined } from '@tarojs/shared'

import type { TaroAny } from '../interface'

export class Style {
  public _pending: boolean

  public _value: TaroAny

  public constructor () {
    this._value = {}
  }

  public get cssText () {
    return ''
  }

  public set cssText (_str: string) {
    // TODO
  }

  public setProperty (propertyName: string, value?: string | null) {
    if (propertyName[0] === '-') {
      // Note: 暂不支持 webkit 属性或 css 变量
      return
    }

    if (isNull(value) || isUndefined(value)) {
      this.removeProperty(propertyName)
    } else {
      // TODO setProperty
    }
  }

  public removeProperty (_propertyName: string): string {
    // TODO: removeProperty
    return ''
  }

  public getPropertyValue (_propertyName: string) {
    // TODO: getPropertyValue
    return ''
  }
}
