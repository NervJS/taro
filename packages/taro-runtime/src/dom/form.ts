import { TaroElement } from './element'

export class FormElement extends TaroElement {
  public get value () {
    // eslint-disable-next-line dot-notation
    const val = this.props['value']
    return val == null ? '' : val
  }

  public set value (val: string) {
    this.setAttribute('value', val)
  }
}
