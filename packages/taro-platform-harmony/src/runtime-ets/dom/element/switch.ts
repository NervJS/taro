import { TaroElement } from './element'

import type { SwitchProps } from '../../../components/types'

export class TaroSwitchElement extends TaroElement<SwitchProps> {
  _value = false

  constructor() {
    super('Switch')

    this._value = this._attrs.checked || false
  }

  public get value () {
    return this._value
  }

  public set value (val: boolean) {
    this._value = val
    // TODO: update
  }
}
