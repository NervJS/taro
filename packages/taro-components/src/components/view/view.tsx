import { Component, Prop, h, ComponentInterface, Host, Listen, State, Event, EventEmitter, Element } from '@stencil/core'
import classNames from 'classnames'

@Component({
  tag: 'taro-view-core',
  styleUrl: './style/index.scss'
})
export class View implements ComponentInterface {
  @Element() el: HTMLElement

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

  componentDidRender () {
    const el = this.el
    el.childNodes.forEach(item => {
      if (item.nodeType === document.COMMENT_NODE && item["s-cn"]) item["s-cn"] = false
    })
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
