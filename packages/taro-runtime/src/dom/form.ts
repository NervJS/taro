import { isString, isBoolean, isNumber, isArray } from '@tarojs/shared'
import { TaroElement } from './element'
import { TaroEvent } from './event'

export class FormElement extends TaroElement {
  public get value () {
    // eslint-disable-next-line dot-notation
    const val = this.props['value']
    return val == null ? '' : val
  }

  public set value (val: string | boolean | number | any[]) {
    if (isNumber(val) || isArray(val)) {
      val = JSON.stringify(val)
    }
    this.setAttribute('value', val)
  }

  public dispatchEvent (event: TaroEvent) {
    if (
      (event.type === 'input' || event.type === 'change') &&
      event.mpEvent &&
      (isString(event.mpEvent.detail.value) || isBoolean(event.mpEvent.detail.value) || isNumber(event.mpEvent.detail.value) || isArray(event.mpEvent.detail.value))
    ) {
      this.value = event.mpEvent.detail.value
    }
    return super.dispatchEvent(event)
  }
}
