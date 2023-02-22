/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

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
