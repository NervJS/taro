// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-cover-image'
})
export class CoverImage {
  componentDidLoad () {
    console.error('H5 暂不支持 CoverImage 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
