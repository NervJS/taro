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
      // Note: ['s-cn'] Content Reference Node
      if (item.nodeType === document.COMMENT_NODE && item['s-cn']) item['s-cn'] = false
      // Note: ['s-sr'] Is a slot reference node (渲染完成后禁用 slotRelocation 特性, 避免 Stencil 组件相互调用时内置排序与第三方 UI 框架冲突导致组件顺序混乱)
      if (item.nodeType !== document.COMMENT_NODE && item['s-sr']) item['s-sr'] = false
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
