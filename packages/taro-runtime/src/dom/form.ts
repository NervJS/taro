import { TaroElement } from './element'
import { TaroEvent } from './event'

export class FormElement extends TaroElement {
  public get value () {
    // eslint-disable-next-line dot-notation
    const val = this.props['value']
    return val == null ? '' : val
  }

  public set value (val: string) {
    this.setAttribute('value', val)
  }

  public dispatchEvent (event: TaroEvent) {
    if (event.type === 'input' && typeof event.mpEvent?.detail.value === 'string') {
      this.value = event.mpEvent.detail.value
    }
    return super.dispatchEvent(event)
  }
}
