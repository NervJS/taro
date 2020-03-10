import { Component, Prop, h, ComponentInterface, Host } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-text-core',
  styleUrl: './style/index.scss'
})
export class Text implements ComponentInterface {
  @Prop() selectable: boolean = false

  render () {
    const cls = classNames(
      'taro-text',
      {
        'taro-text__selectable': this.selectable
      }
    )
    return (
      <Host class={cls} />
    )
  }
}
