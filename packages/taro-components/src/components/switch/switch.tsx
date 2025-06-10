import { Component, h, ComponentInterface, Prop, State, Event, EventEmitter, Watch, Element } from '@stencil/core'

@Component({
  tag: 'taro-switch-core',
  styleUrl: './style/index.scss'
})
export class Switch implements ComponentInterface {
  private inputRef: HTMLInputElement

  @Prop() type = 'switch'
  @Prop({ mutable: true }) checked = false
  @Prop() color = '#04BE02'
  @Prop() name: string
  @Prop() disabled = false
  @Prop() nativeProps = {}

  @State() isWillLoadCalled = false

  @Element() el: HTMLInputElement

  @Watch('checked')
  function (newValue: boolean) {
    if (!this.isWillLoadCalled) return
    if (this.inputRef.checked !== newValue) {
      this.inputRef.checked = newValue
    }
  }

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  componentWillLoad () {
    this.isWillLoadCalled = true
  }

  componentDidLoad () {
    Object.defineProperty(this.el, 'value', {
      get: () => this.checked,
      configurable: true
    })
  }

  switchChange = e => {
    e.stopPropagation()
    const value = e.target.checked
    this.checked = value
    this.onChange.emit({
      value
    })
  }

  render () {
    const {
      type,
      color,
      checked,
      name,
      disabled,
      nativeProps
    } = this

    const style = checked
      ? {
        borderColor: color || '04BE02',
        backgroundColor: color || '04BE02'
      }
      : {}

    return (
      <input
        ref={input => {
          this.inputRef = input!
        }}
        type='checkbox'
        class={`weui-${type}`}
        style={style}
        checked={checked}
        name={name}
        disabled={disabled}
        onChange={this.switchChange}
        {...nativeProps}
      />
    )
  }
}
