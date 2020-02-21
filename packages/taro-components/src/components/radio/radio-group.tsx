// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Host, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core'

@Component({
  tag: 'taro-radio-group'
})
export class RadioGroup implements ComponentInterface {
  private uniqueName = Date.now().toString(36)

  @Prop() name

  @Element() el: HTMLElement

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  @Listen('radiochange')
  function (e: CustomEvent<{ value: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-RADIO') return

    const target = e.target as HTMLTaroRadioElement
    if (target.checked) {
      const childList = this.el.querySelectorAll('taro-radio')

      childList.forEach(element => {
        if (element !== target) {
          element.checked = false
        }
      })

      this.onChange.emit({
        value: e.detail.value
      })
    }
  }

  componentDidLoad () {
    const childList = this.el.querySelectorAll('taro-radio')

    childList.forEach((element) => {
      element.setAttribute('name', this.name || this.uniqueName)
    })
  }

  render () {
    return (
      <Host className='weui-cells_radiogroup' />
    )
  }
}
