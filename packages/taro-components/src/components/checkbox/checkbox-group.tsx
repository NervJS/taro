// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Host, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core'

@Component({
  tag: 'taro-checkbox-group'
})
export class CheckboxGroup implements ComponentInterface {
  private uniqueName = Date.now().toString(36)

  @Prop() name

  @Element() el: HTMLElement

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  @Listen('checkboxchange')
  function (e: CustomEvent<{ value: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-CHECKBOX') return

    const childList = this.el.querySelectorAll('taro-checkbox')

    const res = Array.from(childList)
      .filter(element => {
        const checkbox: HTMLInputElement | null = element.querySelector(`input[name=${this.name || this.uniqueName}]`)
        return checkbox?.checked
      })
      .map(element => element.value)

    this.onChange.emit({
      value: res
    })
  }

  componentDidLoad () {
    const childList = this.el.querySelectorAll('taro-checkbox')

    childList.forEach((element) => {
      element.setAttribute('name', this.name || this.uniqueName)
    })
  }

  render () {
    return (
      <Host />
    )
  }
}
