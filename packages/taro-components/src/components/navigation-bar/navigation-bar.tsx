// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-navigation-bar-core'
})
export class NavigationBar {
  componentDidLoad () {
    console.error('H5 暂不支持 NavigationBar 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
