// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-ad-core'
})
export class Ad {
  componentDidLoad () {
    console.error('H5 暂不支持 Ad 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
