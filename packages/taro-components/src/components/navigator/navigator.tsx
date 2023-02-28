import { Component, Prop, h, ComponentInterface, Host, Listen, Event, EventEmitter } from '@stencil/core'
import Taro from '@tarojs/taro'
import classNames from 'classnames'

/**
 * TODO: 参数还需要进一步细化对齐
 * Navigator组件
 * https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html
 **/

@Component({
  tag: 'taro-navigator-core',
  styleUrl: './style/index.scss'
})
export class Navigator implements ComponentInterface {
  @Prop() hoverClass: string
  @Prop() url: string
  @Prop() openType = 'navigate'
  @Prop() isHover = false
  @Prop() delta = 0

  @Event({
    eventName: 'cuccess'
  }) onSuccess: EventEmitter

  @Event({
    eventName: 'fail'
  }) onFail: EventEmitter

  @Event({
    eventName: 'complete'
  }) onComplete: EventEmitter

  @Listen('click')
  onClick () {
    const { openType, onSuccess, onFail, onComplete } = this
    let promise: Promise<any> = Promise.resolve()
    switch (openType) {
      case 'navigate':
        promise = Taro.navigateTo({
          url: this.url
        })
        break
      case 'redirect':
        promise = Taro.redirectTo({
          url: this.url
        })
        break
      case 'switchTab':
        promise = Taro.switchTab({
          url: this.url
        })
        break
      case 'reLaunch':
        promise = Taro.reLaunch({
          url: this.url
        })
        break
      case 'navigateBack':
        promise = Taro.navigateBack({
          delta: this.delta
        })
        break
      case 'exit':
        promise = Promise.reject(new Error('navigator:fail 暂不支持"openType: exit"'))
        break
    }
    if (promise) {
      promise.then(res => {
        onSuccess.emit(res)
      }).catch(res => {
        onFail.emit(res)
      }).finally(() => {
        onComplete.emit()
      })
    }
  }

  render () {
    const { isHover, hoverClass } = this

    return (
      <Host
        class={classNames({
          [hoverClass]: isHover
        })}
      />
    )
  }
}
