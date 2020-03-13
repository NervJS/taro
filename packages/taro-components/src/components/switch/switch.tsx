// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  @State() isChecked: boolean

  @Element() el: HTMLElement

  @Watch('checked')
  function (newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) this.isChecked = newVal
  }

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  componentWillLoad () {
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
      name
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
        onChange={this.switchChange}
      />
    )
  }
}
