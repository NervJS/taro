// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Host, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core'

@Component({
  tag: 'taro-checkbox-group-core'
})
export class CheckboxGroup implements ComponentInterface {
  private uniqueName = Date.now().toString(36)
  #value: string[]

  @Prop() name

  @Element() el: HTMLElement

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  @Listen('checkboxchange')
  function (e: CustomEvent<{ value: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-CHECKBOX-CORE') return

    const childList = this.el.querySelectorAll('taro-checkbox-core')

    this.#value = this.getValues(childList)

    this.onChange.emit({
      value: this.#value
    })
  }

  componentDidLoad () {
    const childList = this.el.querySelectorAll('taro-checkbox-core')

    childList.forEach((element) => {
      element.setAttribute('name', this.name || this.uniqueName)
    })

    Object.defineProperty(this.el, 'value', {
      get: () => {
        if (!this.#value) {
          const childList = this.el.querySelectorAll('taro-checkbox-core')
          this.#value = this.getValues(childList)
        }
        return this.#value
      },
      configurable: true
    })
  }

  getValues (childList: NodeListOf<HTMLTaroCheckboxCoreElement>) {
    return Array.from(childList)
      .filter(element => {
        const checkbox: HTMLInputElement | null = element.querySelector('input')
        return checkbox?.checked
      })
      .map(element => element.value)
  }

  render () {
    return (
      <Host />
    )
  }
}
