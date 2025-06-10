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
