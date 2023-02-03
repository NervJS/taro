import { Component, Prop, h, ComponentInterface, Host } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-text-core',
  styleUrl: './style/index.scss'
})
export class Text implements ComponentInterface {
  @Prop() selectable = false

  render () {
    const cls = classNames({
      'taro-text__selectable': this.selectable
    })
    return (
      <Host class={cls}>
        <slot></slot>
      </Host>
    )
  }
}
