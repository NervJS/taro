// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-moveable-view-core'
})
export class MoveableView {
  componentDidLoad () {
    console.error('H5 暂不支持 MoveableView 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
