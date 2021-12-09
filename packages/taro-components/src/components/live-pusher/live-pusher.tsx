// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-live-pusher-core'
})
export class LivePusher {
  componentDidLoad () {
    console.error('H5 暂不支持 LivePusher 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
