import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Host, Watch, Element, State } from '@stencil/core'

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
  @Prop() disabled = false
  @Prop() nativeProps = {}

  @State() isWillLoadCalled = false

  @Element() el: HTMLElement

  @Watch('id')
  watchId (newVal) {
    if (!this.isWillLoadCalled) return
    if (newVal) this.inputEl.setAttribute('id', newVal)
  }

  @Event({
    eventName: 'checkboxchange'
  })
  onChange: EventEmitter

  componentWillLoad () {
    this.isWillLoadCalled = true
  }

  componentDidRender () {
    this.id && this.el.removeAttribute('id')
  }

  handleChange = (e: Event) => {
    e.stopPropagation()
    this.onChange.emit({
      value: this.value
    })
  }

  render () {
    const { checked, name, color, value, disabled, nativeProps } = this

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
          disabled={disabled}
          onChange={this.handleChange}
          {...nativeProps}
        />
        <slot />
      </Host>
    )
  }
}
