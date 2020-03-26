// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Prop, State, ComponentInterface, Event, EventEmitter, Listen } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-button-core',
  styleUrl: './style/index.scss'
})
export class Button implements ComponentInterface {
  @Prop() disabled: boolean
  @Prop() hoverClass = 'button-hover'
  @Prop() type = 'default'
  @Prop() hoverStartTime = 20
  @Prop() hoverStayTime = 70
  @Prop() size: string
  @Prop() plain: boolean
  @Prop() loading = false
  @Prop() formType: 'submit' | 'reset' | null = null

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

  @Listen('click')
  onClick (e: MouseEvent) {
    // 取消 form 内 button 跳转
    e.preventDefault()
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

    const cls = classNames(
      'weui-btn',
      'taro-button',
      {
        [`${hoverClass}`]: hover && !disabled,
        [`weui-btn_plain-${type}`]: plain,
        [`weui-btn_${type}`]: !plain && type,
        'weui-btn_mini': size === 'mini',
        'weui-btn_loading': loading,
        'weui-btn_disabled': disabled
      }
    )

    return (
      <button
        class={cls}
        type={type}
        // @ts-ignore: weui need plain for css selector
        plain={plain}
        disabled={disabled}
      >
        {loading && <i class='weui-loading' />}
        <slot />
      </button>
    )
  }
}
