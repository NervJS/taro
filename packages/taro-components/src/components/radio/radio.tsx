import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Host, Watch, Element, State } from '@stencil/core'

@Component({
  tag: 'taro-radio-core'
})
export class Radio implements ComponentInterface {
  private inputEl: HTMLInputElement
  @Prop() name: string
  @Prop() value = ''
  @Prop({ mutable: true }) id: string
  @Prop({ mutable: true, reflect: true }) checked = false
  @Prop() disabled: boolean = false
  @Prop() nativeProps = {}

  @State() isWillLoadCalled = false

  @Element() el: HTMLElement

  @Watch('checked')
  watchChecked (newVal) {
    if (!this.isWillLoadCalled) return
    newVal && this.onChange.emit({ value: this.value })
  }

  @Watch('id')
  watchId (newVal) {
    if (!this.isWillLoadCalled) return
    if (newVal) this.inputEl.setAttribute('id', newVal)
  }

  @Event({
    eventName: 'radiochange'
  })
  onChange: EventEmitter

  componentDidRender () {
    this.id && this.el.removeAttribute('id')
  }

  componentWillLoad () {
    this.isWillLoadCalled = true
  }

  handleClick = (e: Event) => {
    e.stopPropagation()
    if (this.disabled) return
    if (!this.checked) this.checked = true
  }

  render () {
    const { checked, name, value, disabled, nativeProps } = this

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
          disabled={disabled}
          onChange={e => e.stopPropagation()}
          {...nativeProps}
        />
        <i class='weui-icon-checked' />
        <slot />
      </Host>
    )
  }
}
