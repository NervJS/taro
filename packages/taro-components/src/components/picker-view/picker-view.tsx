// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-picker-view-core'
})
export class PickerView {
  componentDidLoad () {
    console.error('H5 暂不支持 PickerView 组件！')
  }

  render () {
    return (
      <Host></Host>
    )
  }
}
