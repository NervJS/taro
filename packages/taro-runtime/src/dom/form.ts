import { TaroElement } from './element'
import { TaroEvent } from './event'

export class FormElement extends TaroElement {
  public get value () {
    // eslint-disable-next-line dot-notation
    const val = this.props['value']
    return val == null ? '' : val
  }

  public set value (val: string | boolean | number | any[]) {
    this.setAttribute('value', val)
  }

  public dispatchEvent (event: TaroEvent) {
    if ((event.type === 'input' || event.type === 'change') && event.mpEvent) {
      const val = event.mpEvent.detail.value
      this.props.value = val as string
    }
    return super.dispatchEvent(event)
  }
}
