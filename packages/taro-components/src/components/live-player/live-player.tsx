// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-live-player-core'
})
export class LivePlayer {
  componentDidLoad () {
    console.error('H5 暂不支持 LivePlayer 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
