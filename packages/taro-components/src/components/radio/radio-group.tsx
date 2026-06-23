import { Component, h, ComponentInterface, Host, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core'

@Component({
  tag: 'taro-radio-group-core'
})
export class RadioGroup implements ComponentInterface {
  private uniqueName = Date.now().toString(36)
  #value: string

  @Prop() name

  @Element() el: HTMLElement

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  @Listen('radiochange')
  function (e: CustomEvent<{ value: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-RADIO-CORE') return

    const target = e.target as HTMLTaroRadioCoreElement
    if (target.checked) {
      const childList = this.el.querySelectorAll('taro-radio-core')

      childList.forEach(element => {
        if (element !== target) {
          element.checked = false
        }
      })

      this.#value = e.detail.value

      this.onChange.emit({
        value: this.#value
      })
    }
  }

  componentDidLoad () {
    const childList = this.el.querySelectorAll('taro-radio-core')

    childList.forEach((element) => {
      element.setAttribute('name', this.name || this.uniqueName)
    })

    Object.defineProperty(this.el, 'value', {
      get: () => {
        if (!this.#value) {
          const childList = this.el.querySelectorAll('taro-radio-core')
          this.#value = this.getValues(childList)
        }
        return this.#value
      },
      configurable: true
    })
  }

  getValues (childList: NodeListOf<HTMLTaroRadioCoreElement>) {
    let val = ''
    Array.from(childList)
      .forEach(element => {
        const checkbox: HTMLInputElement | null = element.querySelector('input')
        if (checkbox?.checked) {
          val = checkbox.value || ''
        }
      })
    return val
  }

  render () {
    return (
      <Host class='weui-cells_radiogroup' />
    )
  }
}
