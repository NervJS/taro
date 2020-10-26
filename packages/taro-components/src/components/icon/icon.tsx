import { Component, h, ComponentInterface, Prop, Host } from '@stencil/core'
import classNames from 'classnames'

export type Type = 'success' | 'success_no_circle' | 'info'| 'warn'| 'waiting'| 'cancel'| 'download'| 'search'| 'clear'
type IconType = Exclude<Type, 'success_no_circle'> | 'success-no-circle'

@Component({
  tag: 'taro-icon-core'
})
export class Icon implements ComponentInterface {
  @Prop() type: Type
  @Prop() size: string | number = '23'
  @Prop() color: string

  render () {
    const {
      type,
      size,
      color
    } = this

    const iconType = type?.replace(/_/g, '-') as IconType

    const cls = classNames({
      [`weui-icon-${iconType}`]: true
    })

    const style = {
      'font-size': `${size}px`,
      color
    }

    return (
      <Host class={cls} style={style} />
    )
  }
}
