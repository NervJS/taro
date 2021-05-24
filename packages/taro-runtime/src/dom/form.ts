import { TaroElement } from './element'
import {
  VALUE,
  INPUT,
  CHANGE
} from '../constants'

import type { TaroEvent } from './event'

export class FormElement extends TaroElement {
  public get value () {
    // eslint-disable-next-line dot-notation
    const val = this.props[VALUE]
    return val == null ? '' : val
  }

  public set value (val: string | boolean | number | any[]) {
    this.setAttribute(VALUE, val)
  }

  public dispatchEvent (event: TaroEvent) {
    if ((event.type === INPUT || event.type === CHANGE) && event.mpEvent) {
      const val = event.mpEvent.detail.value
      this.props.value = val as string
    }

    return super.dispatchEvent(event)
  }
}
