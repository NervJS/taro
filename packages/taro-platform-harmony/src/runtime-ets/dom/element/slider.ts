import { TaroElement } from './element'

import type { SliderProps } from '@tarojs/components/types'

export class TaroSliderElement extends TaroElement<SliderProps> {
  _value = 0

  constructor() {
    super('Slider')

    this._value = Number(this._attrs.value || 0)
  }

  public get value () {
    return this._value
  }

  public set value (val: number) {
    this._value = val
    this.updateComponent()
  }
}