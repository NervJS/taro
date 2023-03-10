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
  @Prop({ reflect: true }) formType: 'submit' | 'reset' | null = null

  @Element() el: HTMLElement

  @State() hover = false
  @State() touch = false

  @Event({
    eventName: 'tarobuttonsubmit'
  }) onSubmit: EventEmitter

  @Event({
    eventName: 'tarobuttonreset'
  }) onReset: EventEmitter

  @Listen('click')
  onClick (e: Event) {
    if (this.disabled) {
      e.stopPropagation()
    }
  }

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
