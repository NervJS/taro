import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Watch, Element, Method, Host, Listen } from '@stencil/core'
import classNames from 'classnames'

import { debounce } from '../../utils'

import type { ScrollViewContext } from '@tarojs/taro'

function easeOutScroll (from: number, to: number, duration = 500, callback?) {
  if (from === to || typeof from !== 'number') {
    return
  }

  const change = to - from
  const sTime = Date.now()
  const isLarger = to >= from

  function linear (t: number, b: number, c: number, d: number): number {
    return c * t / d + b
  }

  function step () {
    from = linear(Date.now() - sTime, from, change, duration)
    if ((isLarger && from >= to) || (!isLarger && to >= from)) {
      callback(to)
      return
    }
    callback(from)
    requestAnimationFrame(step)
  }

  step()
}

@Component({
  tag: 'taro-scroll-view-core',
  styleUrl: './style/index.scss'
})
export class ScrollView implements ComponentInterface {
  private _scrollLeft = 0
  private _scrollTop = 0

  @Element() el: HTMLElement

  @Prop() scrollX = false
  @Prop() scrollY = false
  @Prop() upperThreshold: number | string = 50
  @Prop() lowerThreshold: number | string = 50
  @Prop({ attribute: 'scroll-top', reflect: true }) mpScrollTop: number | string
  @Prop({ attribute: 'scroll-left', reflect: true }) mpScrollLeft: number | string
  @Prop({ attribute: 'scroll-into-view', reflect: true }) mpScrollIntoView: string
  @Prop({ attribute: 'scroll-with-animation' }) animated = false

  @Event({
    eventName: 'scroll',
    bubbles: false
  })
  onScroll: EventEmitter

  @Event({
    eventName: 'scrolltoupper',
    bubbles: false
  })
  onScrollToUpper: EventEmitter

  @Event({
    eventName: 'scrolltolower',
    bubbles: false
  })
  onScrollToLower: EventEmitter

  @Watch('mpScrollLeft')
  watchScrollLeft (newVal) {
    const left = Number(newVal)
    const { animated } = this

    this.mpScrollToMethod({
      left, animated
    })
  }

  @Watch('mpScrollTop')
  watchScrollTop (newVal) {
    const top = Number(newVal)
    const { animated } = this

    this.mpScrollToMethod({
      top, animated
    })
  }

  @Watch('mpScrollIntoView')
  watchScrollIntoView (newVal) {
    this.mpScrollIntoViewMethod(newVal)
  }

  @Listen('scroll', { capture: true })
  handleScroll (e: Event) {
    if (e instanceof CustomEvent) return
    e.stopPropagation()

    const {
      scrollLeft,
      scrollTop,
      scrollHeight,
      scrollWidth
    } = this.el
    this._scrollLeft = scrollLeft
    this._scrollTop = scrollTop

    this.upperAndLower()

    this.onScroll.emit({
      scrollLeft,
      scrollTop,
      scrollHeight,
      scrollWidth
    })
  }

  @Method()
  async mpScrollToMethod(object: ScrollViewContext.scrollTo.Option) {
    let { top, left, duration, animated = false } = object

    if (this.scrollY && typeof top === 'number' && !isNaN(top) && top !== this._scrollTop) {
      if (animated) {
        easeOutScroll(this._scrollTop, top, duration, pos => (this.el.scrollTop = pos))
      } else {
        this.el.scrollTop = top
      }
      this._scrollTop = top
    }

    if (this.scrollX && typeof left === 'number' && !isNaN(left) && left !== this._scrollLeft) {
      if (animated) {
        easeOutScroll(this._scrollLeft, left, duration, pos => (this.el.scrollLeft = pos))
      } else {
        this.el.scrollLeft = left
      }
      this._scrollLeft = left
    }
  }

  @Method()
  async mpScrollIntoViewMethod(selector: string) {
    if (typeof selector === 'string' && selector) {
      document.querySelector(`#${selector}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  componentDidLoad () {
    const top = Number(this.mpScrollTop)
    const left = Number(this.mpScrollLeft)
    const { animated } = this

    this.mpScrollToMethod({
      top, left, animated
    })
  }

  upperAndLower = debounce(() => {
    const {
      offsetWidth,
      offsetHeight,
      scrollLeft,
      scrollTop,
      scrollHeight,
      scrollWidth
    } = this.el

    const lowerThreshold = Number(this.lowerThreshold)
    const upperThreshold = Number(this.upperThreshold)

    if (
      !isNaN(lowerThreshold) &&
      ((this.scrollY && offsetHeight + scrollTop + lowerThreshold >= scrollHeight) ||
      (this.scrollX && offsetWidth + scrollLeft + lowerThreshold >= scrollWidth))
    ) {
      this.onScrollToLower.emit({
        direction: this.scrollX ? 'right' : (this.scrollY ? 'bottom' : '')
      })
    }

    if (
      !isNaN(upperThreshold) &&
      ((this.scrollY && scrollTop <= upperThreshold) ||
      (this.scrollX && scrollLeft <= upperThreshold))
    ) {
      this.onScrollToUpper.emit({
        direction: this.scrollX ? 'left' : (this.scrollY ? 'top' : '')
      })
    }
  }, 200)

  render () {
    const { scrollX, scrollY } = this

    const cls = classNames({
      'taro-scroll-view__scroll-x': scrollX,
      'taro-scroll-view__scroll-y': scrollY
    })
    return (
      <Host class={cls}>
        <slot />
      </Host>
    )
  }
}
