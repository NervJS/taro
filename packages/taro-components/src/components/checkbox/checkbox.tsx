// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Host, Watch, Element } from '@stencil/core'

@Component({
  tag: 'taro-checkbox-core',
  styleUrl: './style/index.scss'
})
export class Checkbox implements ComponentInterface {
  private inputEl: HTMLInputElement
  @Prop() name: string
  @Prop() value = ''
  @Prop() color: string
  @Prop({ mutable: true }) id: string
  @Prop() checked = false

  @Element() el: HTMLElement

  @Watch('id')
  watchId (newVal) {
    if (newVal) this.inputEl.setAttribute('id', newVal)
  }

  @Event({
    eventName: 'checkboxchange'
  })
  onChange: EventEmitter

  componentDidRender () {
    this.id && this.el.removeAttribute('id')
  }

  handleChange = e => {
    e.stopPropagation()
    this.onChange.emit({
      value: this.value
    })
  }

  render () {
    const { checked, name, color, value } = this

    return (
      <Host
        className='weui-cells_checkbox'
      >
        <input
          ref={dom => {
            if (!dom) return
            this.inputEl = dom
            if (this.id) dom.setAttribute('id', this.id)
          }}
          type='checkbox'
          value={value}
          name={name}
          class='taro-checkbox_checked'
          style={{ color }}
          checked={checked}
          onChange={this.handleChange}
        />
        <slot />
      </Host>
    )
  }
}
