// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-movable-area-core'
})
export class MovableArea {
  componentDidLoad () {
    console.error('H5 暂不支持 MovableArea 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
