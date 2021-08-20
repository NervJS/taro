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
import { Component, h, Prop, State, ComponentInterface, Event, EventEmitter, Listen, Element, Host } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-button-core',
  styleUrl: './style/index.scss'
})
export class Button implements ComponentInterface {
  @Prop() disabled: boolean
  @Prop() hoverClass = 'button-hover'
  @Prop() type = ''
  @Prop() hoverStartTime = 20
  @Prop() hoverStayTime = 70
  @Prop() size: string
  @Prop() plain: boolean
  @Prop() loading = false
  @Prop() formType: 'submit' | 'reset' | null = null

  @Element() el: HTMLElement

  @State() hover = false
  @State() touch = false

  @Event({
    eventName: 'tarobuttonsubmit'
  }) onSubmit: EventEmitter

  @Event({
    eventName: 'tarobuttonreset'
  }) onReset: EventEmitter

  @Listen('touchstart')
  onTouchStart () {
    if (this.disabled) {
      return
    }

    this.touch = true
    if (this.hoverClass && !this.disabled) {
      setTimeout(() => {
        if (this.touch) {
          this.hover = true
        }
      }, this.hoverStartTime)
    }
  }

  @Listen('touchend')
  onTouchEnd () {
    if (this.disabled) {
      return
    }

    this.touch = false
    if (this.hoverClass && !this.disabled) {
      setTimeout(() => {
        if (!this.touch) {
          this.hover = false
        }
      }, this.hoverStayTime)
    }

    if (this.formType === 'submit') {
      this.onSubmit.emit()
    } else if (this.formType === 'reset') {
      this.onReset.emit()
    }
  }

  render () {
    const {
      disabled,
      hoverClass,
      type,
      size,
      plain,
      loading,
      hover
    } = this

    const cls = classNames({
      [`${hoverClass}`]: hover && !disabled
    })

    return (
      <Host
        class={cls}
        type={type}
        plain={plain}
        loading={loading}
        size={size}
        disabled={disabled}
      >
        {loading && <i class='weui-loading' />}
        <slot />
      </Host>
    )
  }
}
