// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-keyboard-accessory-core'
})
export class KeyboardAccessory {
  componentDidLoad () {
    console.error('H5 暂不支持 KeyboardAccessory 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
