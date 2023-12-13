import { TaroElement } from './element'

import type { SliderProps } from '../../../components/types'

export class TaroSliderElement extends TaroElement<SliderProps> {
  _value: string | number = ''

  constructor() {
    super('Slider')

    this._value = this._attrs.value || ''
  }

  public get value () {
    return this._value
  }

  public set value (val: string | number) {
    this._value = val
    // TODO: update
  }
}