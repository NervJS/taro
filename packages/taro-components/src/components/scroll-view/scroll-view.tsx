// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Watch, Element, Host } from '@stencil/core'
import classNames from 'classnames'

function easeOutScroll (from: number, to: number, callback) {
  if (from === to || typeof from !== 'number') {
    return
  }

  const change = to - from
  const dur = 500
  const sTime = Date.now()
  const isLarger = to >= from

  function linear (t: number, b: number, c: number, d: number): number {
    return c * t / d + b
  }

  function step () {
    from = linear(Date.now() - sTime, from, change, dur)
    if ((isLarger && from >= to) || (!isLarger && to >= from)) {
      callback(to)
      return
    }
    callback(from)
    requestAnimationFrame(step)
  }

  step()
}

function debounce (fn, delay: number) {
  let timer: NodeJS.Timeout

  return function (...arrs) {
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn(...arrs)
    }, delay)
  }
}

@Component({
  tag: 'taro-scroll-view-core',
  styleUrl: './style/index.scss'
})
export class ScrollView implements ComponentInterface {
  private _scrollLeft: number
  private _scrollTop: number

  @Element() el: HTMLElement

  @Prop() scrollX = false
  @Prop() scrollY = false
  @Prop() upperThreshold: number | string = 50
  @Prop() lowerThreshold: number | string = 50
  @Prop({ attribute: 'scroll-top' }) mpScrollTop: number | string
  @Prop({ attribute: 'scroll-left' }) mpScrollLeft: number | string
  @Prop({ attribute: 'scroll-into-view' }) mpScrollIntoView: string
  @Prop() scrollWithAnimation = false

  @Event({
    eventName: 'scroll'
  })
  onScroll: EventEmitter

  @Event({
    eventName: 'scrolltoupper'
  })
  onScrollToUpper: EventEmitter

  @Event({
    eventName: 'scrolltolower'
  })
  onScrollToLower: EventEmitter

  @Watch('mpScrollLeft')
  watchScrollLeft (newVal) {
    const scrollLeft = Number(newVal)
    if (
      this.scrollX &&
      !isNaN(scrollLeft) &&
      scrollLeft !== this._scrollLeft
    ) {
      if (this.scrollWithAnimation) {
        easeOutScroll(this._scrollLeft, scrollLeft, pos => (this.el.scrollLeft = pos))
      } else {
        this.el.scrollLeft = scrollLeft
      }
      this._scrollLeft = scrollLeft
    }
  }

  @Watch('mpScrollTop')
  watchScrollTop (newVal) {
    const scrollTop = Number(newVal)
    if (
      this.scrollY &&
      !isNaN(scrollTop) &&
      scrollTop !== this._scrollTop
    ) {
      if (this.scrollWithAnimation) {
        easeOutScroll(this._scrollTop, scrollTop, pos => (this.el.scrollTop = pos))
      } else {
        this.el.scrollTop = scrollTop
      }
      this._scrollTop = scrollTop
    }
  }

  @Watch('mpScrollIntoView')
  watchScrollIntoView (newVal) {
    if (typeof newVal === 'string' && newVal) {
      document.querySelector(`#${newVal}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  componentDidLoad () {
    const {
      scrollY,
      scrollX,
      scrollWithAnimation
    } = this

    const scrollTop = Number(this.mpScrollTop)
    const scrollLeft = Number(this.mpScrollLeft)

    if (scrollY && !isNaN(scrollTop)) {
      if (scrollWithAnimation) {
        easeOutScroll(0, scrollTop, pos => (this.el.scrollTop = pos))
      } else {
        this.el.scrollTop = scrollTop
      }
      this._scrollTop = scrollTop
    }

    if (scrollX && !isNaN(scrollLeft)) {
      if (scrollWithAnimation) {
        easeOutScroll(0, scrollLeft, pos => (this.el.scrollLeft = pos))
      } else {
        this.el.scrollLeft = scrollLeft
      }
      this._scrollLeft = scrollLeft
    }
  }

  handleScroll = (e) => {
    if (e instanceof CustomEvent) return

    const {
      scrollLeft,
      scrollTop,
      scrollHeight,
      scrollWidth
    } = this.el
    this._scrollLeft = scrollLeft
    this._scrollTop = scrollTop

    this.uperAndLower()

    this.onScroll.emit({
      scrollLeft,
      scrollTop,
      scrollHeight,
      scrollWidth
    })
  }

  uperAndLower = debounce(() => {
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
    const {
      scrollX,
      scrollY
    } = this

    const cls = classNames({
      'taro-scroll-view__scroll-x': scrollX,
      'taro-scroll-view__scroll-y': scrollY
    })
    return (
      <Host
        class={cls}
        onScroll={this.handleScroll}
      >
        <slot />
      </Host>
    )
  }
}
