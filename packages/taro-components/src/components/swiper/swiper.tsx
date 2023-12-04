import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Watch, Host, Element, State } from '@stencil/core'
import classNames from 'classnames'
import type ISwiper from 'swiper'
import SwiperJS from 'swiper/swiper-bundle.esm.js'

import { debounce } from '../../utils'

let INSTANCE_ID = 0

@Component({
  tag: 'taro-swiper-core',
  styleUrls: [
    './style/index.scss'
  ]
})
export class Swiper implements ComponentInterface {
  private _id = INSTANCE_ID++

  @Element() el: HTMLElement
  @State() swiperWrapper: HTMLElement | null
  @State() private swiper: ISwiper
  @State() isWillLoadCalled = false
  @State() source = ''
  /**
   * 是否显示面板指示点
   */
  @Prop() indicatorDots = false

  /**
   * 指示点颜色
   */
  @Prop() indicatorColor = 'rgba(0, 0, 0, .3)'

  /**
   * 当前选中的指示点颜色
   */
  @Prop() indicatorActiveColor = '#000000'

  /**
   * 是否自动切换
   */
  @Prop() autoplay = false

  /**
   * 当前所在滑块的 index
   */
  @Prop() current = 0

  /**
   * 自动切换时间间隔
   */
  @Prop() interval = 5000

  /**
   * 滑动动画时长
   */
  @Prop() duration = 500

  /**
   * 是否采用衔接滑动
   */
  @Prop() circular = false

  /**
   * 滑动方向是否为纵向
   */
  @Prop() vertical = false

  /**
   * 前边距，可用于露出前一项的一小部分，接受 px 值
   */
  @Prop() previousMargin = '0px'

  /**
   * 后边距，可用于露出后一项的一小部分，接受 px 值
   */
  @Prop() nextMargin = '0px'

  /**
   * 同时显示的滑块数量
   */
  @Prop() displayMultipleItems = 1

  /**
   * 给 previewImage API 使用，全屏显示 swiper
   */
  @Prop() full = false

  /**
   * 给 previewImage API 使用，缩放支持
   */
  @Prop() zoom = false

  @Event({
    eventName: 'change'
  }) onChange: EventEmitter

  @Event({
    eventName: 'animationfinish'
  }) onAnimationFinish: EventEmitter

  @Watch('current')
  watchCurrent (newVal) {
    if (!this.isWillLoadCalled) return

    const n = parseInt(newVal, 10)
    if (isNaN(n)) return

    if (this.circular) {
      if (!this.swiper.isBeginning && !this.swiper.isEnd) {
        this.swiper.slideToLoop(n) // 更新下标
      }
    } else {
      this.swiper.slideTo(n) // 更新下标
    }
  }

  @Watch('autoplay')
  watchAutoplay (newVal) {
    if (!this.isWillLoadCalled || !this.swiper) return

    const swiperAutoplay = this.swiper.autoplay
    if (swiperAutoplay) {
      if (swiperAutoplay.running === newVal) return

      if (newVal) {
        if (this.swiper.params && typeof this.swiper.params.autoplay === 'object') {
          if (this.swiper.params.autoplay.disableOnInteraction === true) {
            this.swiper.params.autoplay.disableOnInteraction = false
          }
          this.swiper.params.autoplay.delay = this.interval
        }
        swiperAutoplay.start()
      } else {
        swiperAutoplay.stop()
      }
    }
  }

  @Watch('duration')
  watchDuration (newVal) {
    if (!this.isWillLoadCalled) return
    this.swiper.params.speed = newVal
  }

  @Watch('interval')
  watchInterval (newVal) {
    if (!this.isWillLoadCalled) return

    if (typeof this.swiper.params.autoplay === 'object') {
      this.swiper.params.autoplay.delay = newVal
    }
  }

  @Watch('swiperWrapper')
  watchSwiperWrapper (newVal?: HTMLElement) {
    if (!this.isWillLoadCalled) return
    if (!newVal) return
    this.el.appendChild = <T extends Node>(newChild: T): T => {
      return newVal.appendChild(newChild)
    }
    this.el.insertBefore = <T extends Node>(newChild: T, refChild: Node | null): T => {
      return newVal.insertBefore(newChild, refChild)
    }
    this.el.replaceChild = <T extends Node>(newChild: Node, oldChild: T): T => {
      return newVal.replaceChild(newChild, oldChild)
    }
    this.el.removeChild = <T extends Node>(oldChild: T): T => {
      return newVal.removeChild(oldChild)
    }
    this.el.addEventListener('DOMNodeInserted', this.handleSwiperSizeDebounce)
    this.el.addEventListener('DOMNodeRemoved', this.handleSwiperSizeDebounce)
    this.el.addEventListener('MutationObserver', this.handleSwiperSizeDebounce)
  }

  @Watch("circular")
  watchCircular () {
    if (this.swiper) {
      this.swiper.destroy()
      this.handleInit()
    }
  }

  @Watch("displayMultipleItems")
  watchDisplayMultipleItems () {
    if (this.swiper) {
      this.swiper.destroy()
      this.handleInit()
    }
  }

  @State() observer: MutationObserver
  @State() observerFirst: MutationObserver
  @State() observerLast: MutationObserver

  componentWillLoad () {
    this.isWillLoadCalled = true
  }

  componentDidLoad () {
    this.handleInit()
    if (!this.swiper || !this.circular) return

    const wrapper = this.swiper.$wrapperEl?.[0]
    this.observer = new MutationObserver(this.handleSwiperLoopListen)

    this.observer.observe(wrapper, {
      childList: true
    })
  }

  componentWillUpdate () {
    if (!this.swiper) return
    if (this.autoplay && !this.swiper.autoplay?.running) {
      this.swiper.autoplay?.start()
    }
    this.swiper.update() // 更新子元素
  }

  componentDidRender () {
    this.handleSwiperLoop()
  }

  disconnectedCallback () {
    this.el.removeEventListener('DOMNodeInserted', this.handleSwiperSizeDebounce)
    this.el.removeEventListener('DOMNodeRemoved', this.handleSwiperSizeDebounce)
    this.el.removeEventListener('MutationObserver', this.handleSwiperSizeDebounce)
    this.observer?.disconnect?.()
    this.observerFirst?.disconnect?.()
    this.observerLast?.disconnect?.()
  }

  handleSwiperLoopListen = () => {
    this.observerFirst?.disconnect && this.observerFirst.disconnect()
    this.observerLast?.disconnect && this.observerLast.disconnect()
    this.observerFirst = new MutationObserver(this.handleSwiperLoopDebounce)
    this.observerLast = new MutationObserver(this.handleSwiperLoopDebounce)
    const wrapper = this.swiper.$wrapperEl?.[0]
    const list = wrapper.querySelectorAll('taro-swiper-item-core:not(.swiper-slide-duplicate)')
    if (list.length >= 1) {
      this.observerFirst.observe(list[0], {
        characterData: true
      })
    } else if (list.length >= 2) {
      this.observerLast.observe(list[list.length - 1], {
        characterData: true
      })
    }
  }

  handleSwiperLoop = () => {
    if (!this.swiper || !this.circular) return
    const swiper = this.swiper as any // Note: loop 相关的方法 swiper 未声明
    const duplicates = this.swiperWrapper?.querySelectorAll('.swiper-slide-duplicate') || []
    if (duplicates.length < 2) {
      // Note: 循环模式下，但是前后垫片未注入
      swiper.loopDestroy?.()
      swiper.loopCreate?.()
    } else {
      swiper.loopFix?.()
    }
  }

  handleSwiperLoopDebounce = debounce(this.handleSwiperLoop, 50)

  handleSwiperSizeDebounce = debounce(() => {
    if (this.swiper && !this.circular) {
      this.swiper.updateSlides()
    }
  }, 50)

  handleInit () {
    const {
      autoplay,
      circular,
      current,
      displayMultipleItems,
      duration,
      interval,
      vertical
    } = this

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    const options: any = {
      pagination: { el: `.taro-swiper-${this._id} > .swiper-container > .swiper-pagination` },
      direction: vertical ? 'vertical' : 'horizontal',
      loop: circular,
      slidesPerView: displayMultipleItems,
      initialSlide: circular ? current + 1 : current,
      speed: duration,
      observer: true,
      observeParents: true,
      zoom: this.zoom,
      on: {
        slideTo () {
          that.current = this.realIndex
        },
        // Note: slideChange 事件在 swiper.slideTo 改写 current 时不触发，因此用 slideChangeTransitionEnd 事件代替
        slideChangeTransitionEnd () {
          /** Note: 此处不能使用 slideChangeTransitionStart 事件
           * - 因为在它触发时 swiper 各个参数并未准备好，将会导致错误的事件抛出；
           * - 同时抛出 change 事件会导致 current 监听被打乱 swiper 的生命周期；
           * - 模式与 slideTo 结合时，会导致动画会被中断、slider 展示不完整或衔接模式错误等问题。
           */
          if (circular) {
            if (this.isBeginning || this.isEnd) {
              this.slideToLoop(this.realIndex, 0) // 更新下标
              return
            }
          }
          that.onChange.emit({
            current: this.realIndex,
            source: that.source
          })
        },
        touchEnd: () => {
          that.source = 'touch'
        },
        autoplay() {
          that.source = 'autoplay'
        },
        transitionEnd () {
          setTimeout(() => {
            that.source = ''
          })
          that.onAnimationFinish.emit({
            current: this.realIndex,
            source: ''
          })
        },
        observerUpdate (_swiper: ISwiper, e) {
          const target = e.target
          const className = target && typeof target.className === 'string' ? target.className : ''
          if (className.includes('taro_page') && target.style.display !== 'none') {
            if (that.autoplay && target.contains(_swiper.$el[0])) {
              if (that.circular) {
                _swiper.slideToLoop(this.realIndex, 0) // 更新下标
              } else {
                _swiper.slideTo(this.realIndex)
              }
            }
          }
        }
      }
    }

    // 自动播放
    if (autoplay) {
      options.autoplay = {
        delay: interval,
        disableOnInteraction: false
      }
    }

    this.swiper = new SwiperJS(`.taro-swiper-${this._id} > .swiper-container`, options)
    this.swiperWrapper = this.el.querySelector(`.taro-swiper-${this._id} > .swiper-container > .swiper-wrapper`)
  }

  render () {
    const {
      vertical,
      indicatorDots,
      indicatorColor,
      indicatorActiveColor
    } = this

    const hostStyle: Record<string, string> = { overflow: 'hidden' }
    const style: Record<string, string> = { overflow: 'visible' }
    if (this.full) {
      hostStyle.height = '100%'
      style.height = '100%'
    }

    const [, previousMargin] = /^(\d+)px/.exec(this.previousMargin) || []
    const [, nextMargin] = /^(\d+)px/.exec(this.nextMargin) || []
    const pM = parseInt(previousMargin) || 0
    const nM = parseInt(nextMargin) || 0
    if (vertical) {
      style.marginTop = `${pM}px`
      style.marginBottom = `${nM}px`
    } else {
      style.marginRight = `${nM}px`
      style.marginLeft = `${pM}px`
    }

    return (
      <Host class={`taro-swiper-${this._id}`} style={hostStyle}>
        <div class='swiper-container' style={style}>
          <style type='text/css'>
            {`
              .taro-swiper-${this._id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet { background: ${indicatorColor} }
              .taro-swiper-${this._id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet-active { background: ${indicatorActiveColor} }
            `}
          </style>
          <div class='swiper-wrapper'>
            <slot />
          </div>
          <div class={classNames('swiper-pagination',
            {
              'swiper-pagination-hidden': !indicatorDots,
              'swiper-pagination-bullets': indicatorDots
            }
          )} />
        </div>
      </Host>
    )
  }
}
