import { Component, h, ComponentInterface, Prop, State, Event, EventEmitter, Watch, Element } from '@stencil/core'

@Component({
  tag: 'taro-switch-core',
  styleUrl: './style/index.scss'
})
export class Switch implements ComponentInterface {
  @Prop() type = 'switch'
  @Prop() checked = false
  @Prop() color = '#04BE02'
  @Prop() name: string
  @Prop() disabled = false
  @Prop() nativeProps = {}

  @State() isChecked: boolean
  @State() isWillLoadCalled = false

  @Element() el: HTMLElement

  @Watch('checked')
  function (newVal: boolean, oldVal: boolean) {
    if (!this.isWillLoadCalled) return
    if (newVal !== oldVal) this.isChecked = newVal
  }

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  componentWillLoad () {
    this.isWillLoadCalled = true
    this.isChecked = this.checked
  }

  componentDidLoad () {
    Object.defineProperty(this.el, 'value', {
      get: () => this.isChecked,
      configurable: true
    })
  }

  switchChange = e => {
    e.stopPropagation()
    const value = e.target.checked
    this.isChecked = value
    this.onChange.emit({
      value
    })
  }

  render () {
    const {
      type,
      color,
      isChecked,
      name,
      disabled,
      nativeProps
    } = this

    const style = isChecked
      ? {
        borderColor: color || '04BE02',
        backgroundColor: color || '04BE02'
      }
      : {}

    return (
      <input
        type='checkbox'
        class={`weui-${type}`}
        style={style}
        checked={isChecked}
        name={name}
        disabled={disabled}
        onChange={this.switchChange}
        {...nativeProps}
      />
    )
  }
}
