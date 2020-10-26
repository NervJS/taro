// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Host, Watch, Element } from '@stencil/core'

@Component({
  tag: 'taro-radio-core'
})
export class Radio implements ComponentInterface {
  private inputEl: HTMLInputElement
  @Prop() name: string
  @Prop() value = ''
  @Prop({ mutable: true }) id: string
  @Prop({ mutable: true }) checked = false

  @Element() el: HTMLElement

  @Watch('checked')
  watchChecked (newVal) {
    newVal && this.onChange.emit({ value: this.value })
  }

  @Watch('id')
  watchId (newVal) {
    if (newVal) this.inputEl.setAttribute('id', newVal)
  }

  @Event({
    eventName: 'radiochange'
  })
  onChange: EventEmitter

  componentDidRender () {
    this.id && this.el.removeAttribute('id')
  }

  handleClick = () => {
    if (!this.checked) this.checked = true
  }

  render () {
    const { checked, name, value } = this

    return (
      <Host
        className='weui-cells_checkbox'
        onClick={this.handleClick}
      >
        <input
          ref={dom => {
            if (!dom) return
            this.inputEl = dom
            if (this.id) dom.setAttribute('id', this.id)
          }}
          type='radio'
          name={name}
          value={value}
          class='weui-check'
          checked={checked}
          onChange={e => e.stopPropagation()}
        />
        <i class='weui-icon-checked' />
        <slot />
      </Host>
    )
  }
}
