// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-ad-custom-core'
})
export class AdCustom {
  componentDidLoad () {
    console.error('H5 暂不支持 AdCustom 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
