// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-page-container-core'
})
export class PageContainer {
  componentDidLoad () {
    console.error('H5 暂不支持 PageContainer 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
