import { Component, Prop, h, ComponentInterface, Host, Listen, Event, EventEmitter } from '@stencil/core'
import classNames from 'classnames'
const Taro = require('@tarojs/taro')

/**
 * Navigator组件参数
 * @typedef NavigatorProps
 * @property {String} appId 当target="miniProgram"时有效，要打开的小程序 appId
 * @property {String} ariaLabel 无障碍访问，（属性）元素的额外描述
 * @property {Number} delta 当 openType 为 'navigateBack' 时有效，表示回退的层数
 * @property {Object} extraData 当target="miniProgram"时有效，需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。详情
 * @property {String} [openType=navigate]  跳转方式
 * @property {String} path 当target="miniProgram"时有效，打开的页面路径，如果为空则打开首页
 * @property {String} [target=self]  在哪个目标上发生跳转，默认当前小程序，可选值self/miniProgram
 * @property {String} url 当前小程序内的跳转链接
 * @property {version} [version=release]  当target="miniProgram"时有效，要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版），仅在当前小程序为开发版或体验版时此参数有效；如果当前小程序是 *式版，则打开的小程序必定是正式版。
 * @property {String} onFail 当target="miniProgram"时有效，跳转小程序失败
 * @property {String} onComplete 当target="miniProgram"时有效，跳转小程序完成
 * @property {String} onSuccess 当target="miniProgram"时有效，跳转小程序成功
 */

/**
 * TODO: 参数还需要进一步细化对齐
 * Navigator组件
 * https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html
 **/

@Component({
  tag: 'taro-navigator-core',
  styleUrl: 'navigator.css'
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
    eventName: 'Complete'
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
