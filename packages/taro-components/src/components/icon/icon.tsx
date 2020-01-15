import { Component, h, ComponentInterface, Prop } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-icon'
})
export class Icon implements ComponentInterface {
  @Prop() type: string
  @Prop() size = '23'
  @Prop() color: string

  render () {
    let { type, size = '23', color } = this
    if (type) type = type.replace(/_/g, '-')
    const cls = classNames(
      {
        [`weui-icon-${type}`]: true
      }
    )
    const style = { 'font-size': size + 'px', color: color }

    return (
      <i class={cls} style={style} />
    )
  }
}
