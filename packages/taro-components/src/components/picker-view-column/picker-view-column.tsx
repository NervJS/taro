// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-picker-view-column-core'
})
export class PickerViewColumn {
  componentDidLoad () {
    console.error('H5 暂不支持 PickerViewColumn 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
