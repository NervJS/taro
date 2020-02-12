// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Prop, State, ComponentInterface } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-button',
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
  @State() hover = false
  @State() touch = false

  render () {
    const {
      disabled,
      hoverClass,
      type,
      hoverStartTime,
      hoverStayTime,
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

    const _onTouchStart = () => {
      this.touch = true
      if (hoverClass && !disabled) {
        setTimeout(() => {
          if (this.touch) {
            this.hover = true
          }
        }, hoverStartTime)
      }
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
    }

    return (
      <button
        class={cls}
        type={type}
        // @ts-ignore: weui need plain for css selector
        plain={plain}
        disabled={disabled}
        onTouchStart={_onTouchStart}
        onTouchEnd={_onTouchEnd}
      >
        {loading && <i class='weui-loading' />}
        <slot />
      </button>
    )
  }
}
