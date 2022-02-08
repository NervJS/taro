// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-official-account-core'
})
export class OfficialAccount {
  componentDidLoad () {
    console.error('H5 暂不支持 OfficialAccount 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
