// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Watch, Host, Element, State } from '@stencil/core'
import SwiperJS from 'swiper/swiper-bundle.esm.js'
import classNames from 'classnames'

import type ISwiper from 'swiper'

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

    if (this.swiper.autoplay.running === newVal) return

    if (newVal) {
      if (this.swiper.params && typeof this.swiper.params.autoplay === 'object') {
        if (this.swiper.params.autoplay.disableOnInteraction === true) {
          this.swiper.params.autoplay.disableOnInteraction = false
        }
        this.swiper.params.autoplay.delay = this.interval
      }
      this.swiper.autoplay.start()
    } else {
      this.swiper.autoplay.stop()
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
  }

  @Watch("circular")
  watchCircular () {
    if (this.swiper) {
      this.swiper.destroy()
      this.handleInit()
    }
  }

  componentWillLoad () {
    this.isWillLoadCalled = true
  }

  componentDidLoad () {
    this.handleInit()
  }

  componentWillUpdate () {
    if (!this.swiper) return
    if (this.autoplay && !this.swiper.autoplay.running) {
      this.swiper.autoplay.start()
    }
    this.swiper.update() // 更新子元素
  }

  componentDidRender () {
    if (this.swiper && this.circular) {
      ;(this.swiper as any).loopDestroy()
      ;(this.swiper as any).loopCreate()
    }
  }

  handleInit () {
    const {
      autoplay,
      current,
      interval,
      duration,
      circular,
      vertical,
      displayMultipleItems
    } = this

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    const options: any = {
      pagination: { el: `.taro-swiper-${this._id} > .swiper-container > .swiper-pagination` },
      direction: vertical ? 'vertical' : 'horizontal',
      loop: circular,
      slidesPerView: displayMultipleItems,
      initialSlide: current,
      speed: duration,
      observer: true,
      observeParents: true,
      on: {
        slideTo () {
          that.current = this.realIndex
        },
        // slideChange 事件在 swiper.slideTo 改写 current 时不触发，因此用 slideChangeTransitionEnd 事件代替
        slideChangeTransitionEnd () {
          that.onChange.emit({
            current: this.realIndex,
            source: ''
          })
        },
        transitionEnd () {
          that.onAnimationFinish.emit({
            current: this.realIndex,
            source: ''
          })
        },
        observerUpdate (_swiper: ISwiper, e) {
          const target = e.target
          const className = target && typeof target.className === 'string' ? target.className : ''
          if (className.includes('taro_page') && target.style.display === 'block') {
            if (that.autoplay && target.contains(_swiper.$el[0])) {
              _swiper.slideTo(that.current)
            }
          } else if (className.includes('swiper-wrapper')) {
            if (e.addedNodes.length > 0 || e.removedNodes.length > 0) {
              // @ts-ignore
              _swiper.loopDestroy()
              // @ts-ignore
              _swiper.loopCreate()
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
