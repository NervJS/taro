/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, Prop, h, ComponentInterface, Host, Listen, State, Event, EventEmitter } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-view-core',
  styleUrl: './style/index.scss'
})
export class View implements ComponentInterface {
  @Prop() animation: string
  @Prop() hoverClass: string
  @Prop() hoverStartTime = 50
  @Prop() hoverStayTime = 400
  @State() hover = false
  @State() touch = false

  @Event({
    eventName: 'longpress'
  }) onLongPress: EventEmitter

  private timeoutEvent: NodeJS.Timeout
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
