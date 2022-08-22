// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-share-element-core'
})
export class ShareElement {
  componentDidLoad () {
    console.error('H5 暂不支持 ShareElement 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
