/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { Component, Prop, h, ComponentInterface, Host, Listen, State, Event, EventEmitter } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-cover-view-core',
  styleUrl: './style/cover-view.scss'
})
export class CoverView implements ComponentInterface  {
  @Prop() animation: string
  @Prop() hoverClass: string
  @Prop() hoverStartTime = 50
  @Prop() hoverStayTime = 400
  @State() hover = false
  @State() touch = false

  @Event({
    eventName: 'longpress'
  }) onLongPress: EventEmitter

  private timeoutEvent: ReturnType<typeof setTimeout>
  private startTime = 0

  @Listen('touchstart')
  onTouchStart () {
    if (this.hoverClass) {
      this.touch = true
      setTimeout(() => {
        if (this.touch) {
          this.hover = true
        }
      }, this.hoverStartTime)
    }

    this.timeoutEvent = setTimeout(() => {
      this.onLongPress.emit()
    }, 350)
    this.startTime = Date.now()
  }

  @Listen('touchmove')
  onTouchMove () {
    clearTimeout(this.timeoutEvent)
  }

  @Listen('touchend')
  onTouchEnd () {
    const spanTime = Date.now() - this.startTime
    if (spanTime < 350) {
      clearTimeout(this.timeoutEvent)
    }
    if (this.hoverClass) {
      this.touch = false
      setTimeout(() => {
        if (!this.touch) {
          this.hover = false
        }
      }, this.hoverStayTime)
    }
  }

  render() {
    const cls = classNames({
      [`${this.hoverClass}`]: this.hover
    })
    let attr = {}
    if (!!this.animation) {
      attr['animation'] = this.animation
      attr['data-animation'] = this.animation
    }
    return (
      <Host class={cls} {...attr}>
        <slot></slot>
      </Host>
    )
  }
}
