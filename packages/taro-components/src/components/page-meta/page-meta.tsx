// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-page-meta-core'
})
export class PageMeta {
  componentDidLoad () {
    console.error('H5 暂不支持 PageMeta 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
