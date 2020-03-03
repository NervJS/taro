// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, State, Event, EventEmitter, Watch } from '@stencil/core'

@Component({
  tag: 'taro-switch'
})
export class Switch implements ComponentInterface {
  @Prop() type = 'switch'
  @Prop() checked = false
  @Prop() color = '#04BE02'
  @State() isChecked: boolean
  @Prop() name: string

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

  switchChange = e => {
    e.stopPropagation()
    const value = e.target.checked
    this.onChange.emit({
      value
    })
    this.isChecked = value
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
