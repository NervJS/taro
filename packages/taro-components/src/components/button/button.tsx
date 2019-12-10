// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host, Prop, State, ComponentInterface, Event, EventEmitter } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-button',
  styleUrl: './style/index.scss'
})
export class Button implements ComponentInterface {
  @Prop() class: string
  @Prop() disabled: boolean
  @Prop() hoverClass = 'button-hover'
  @Prop() type = 'default'
  @Prop() hoverStartTime = 20
  @Prop() hoverStayTime = 70
  @Prop() size: string
  @Prop() plain: boolean
  @Prop() loading = false
  @State() hover = false
  @State() touch = false

  @Event({
    eventName: 'click',
    bubbles: true
  }) onClick: EventEmitter

  @Event({
    eventName: 'touchstart'
  }) onTouchStart: EventEmitter

  @Event({
    eventName: 'touchend'
  }) onTouchEnd: EventEmitter

  render () {
    const {
      disabled,
      onClick,
      hoverClass,
      hoverStartTime,
      hoverStayTime,
      size,
      plain,
      loading,
      type
    } = this

    const cls = this.class ?? classNames(
      'weui-btn',
      'taro-button',
      {
        [`${hoverClass}`]: this.hover && !disabled,
        [`weui-btn_plain-${type}`]: plain,
        [`weui-btn_${type}`]: !plain && type,
        'weui-btn_mini': size === 'mini',
        'weui-btn_loading': loading,
        'weui-btn_disabled': disabled
      }
    )

    const _onTouchStart = () => {
      this.touch = true
      if (hoverClass && !disabled) {
        setTimeout(() => {
          if (this.touch) {
            this.hover = true
          }
        }, hoverStartTime)
      }
      this.onTouchStart.emit()
    }

    const _onTouchEnd = () => {
      this.touch = false
      if (hoverClass && !disabled) {
        setTimeout(() => {
          if (!this.touch) {
            this.hover = false
          }
        }, hoverStayTime)
      }
      this.onTouchEnd.emit()
    }

    return (
      <Host
        class={cls}
        type={type}
        onClick={onClick}
        disabled={disabled}
        onTouchStart={_onTouchStart}
        onTouchEnd={_onTouchEnd}
      >
        {loading && <i class='weui-loading' />}
        <slot />
      </Host>
    )
  }
}
