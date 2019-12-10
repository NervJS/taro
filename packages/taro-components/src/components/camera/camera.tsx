// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'taro-camera'
})
export class Camera {
  componentDidLoad () {
    console.error('H5 暂不支持 Camera 组件！')
  }

  render () {
    return (
      <Host />
    )
  }
}
