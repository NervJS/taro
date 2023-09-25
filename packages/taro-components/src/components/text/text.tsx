import { Component, Prop, h, ComponentInterface, Host } from '@stencil/core'

import type { TextProps } from 'types'

@Component({
  tag: 'taro-text-core',
  styleUrl: './style/index.scss'
})
export class Text implements ComponentInterface {
  @Prop({ mutable: true }) selectable = false
  @Prop({ mutable: true }) userSelect = false
  @Prop({ mutable: true }) space?: keyof TextProps.TSpace
  @Prop() numberOfLines?: number

  render () {
    const style: Record<string, any> = {}
    if (typeof this.numberOfLines === 'number') {
      style['--line-clamp'] = this.numberOfLines
    }

    return (
      <Host style={style}>
        <slot></slot>
      </Host>
    )
  }
}
