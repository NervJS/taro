// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-slot-core'
})
export class Slot {
  componentDidLoad () {
    console.error('H5 暂不支持 Slot 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
