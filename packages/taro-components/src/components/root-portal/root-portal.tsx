// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-root-portal-core'
})
export class RootPortal {
  componentDidLoad () {
    console.error('H5 暂不支持 RootPortal 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
