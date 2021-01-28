// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-movable-view-core'
})
export class MovableView {
  componentDidLoad () {
    console.error('H5 暂不支持 MovableView 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
