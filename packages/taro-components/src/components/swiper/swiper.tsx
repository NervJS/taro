import { Component, ComponentInterface, Element, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core'
import SwiperJS from 'swiper'
import { Autoplay, Navigation, Pagination, Zoom } from 'swiper/modules'

import type ISwiper from 'swiper'
import type { SwiperOptions } from 'swiper/types/swiper-options'
import { debounce, waitUntil } from '../../utils'

let INSTANCE_ID = 0

@Component({
  tag: 'taro-swiper-core',
  styleUrls: ['./style/index.scss'],
})
export class Swiper implements ComponentInterface {
  #id = INSTANCE_ID++
  #source = ''

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

  /**
   * 给 previewImage API 使用，缩放支持
   */
  @Prop() zoom = false

  @Event({
    eventName: 'change',
  })
  onChange: EventEmitter

  @Event({
    eventName: 'animationfinish',
  })
  onAnimationFinish: EventEmitter

  @Watch('current')
  watchCurrent(newVal) {
    if (!this.isWillLoadCalled || !this.swiper) return

    const n = parseInt(newVal, 10)
    if (isNaN(n)) return
    this.#source = ''

    if (this.circular) {
      this.swiper.slideToLoop(n) // 更新下标
    } else {
      this.swiper.slideTo(n) // 更新下标
    }
  }

  @Watch('autoplay')
  watchAutoplay(newVal) {
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
  watchDuration(newVal) {
    if (!this.isWillLoadCalled || !this.swiper) return
    this.swiper.params.speed = newVal
  }

  @Watch('interval')
  watchInterval(newVal) {
    if (!this.isWillLoadCalled || !this.swiper) return

    if (typeof this.swiper.params.autoplay === 'object') {
      this.swiper.params.autoplay.delay = newVal
    }
  }

  @Watch('swiperWrapper')
  watchSwiperWrapper(newVal?: HTMLElement) {
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

  handleSwiperSizeDebounce = debounce(() => {
    if (this.swiper) {
      this.swiper.slides.forEach((slide, index) => {
        if (slide.getAttribute('data-swiper-slide-index') === null) {
          slide.setAttribute('data-swiper-slide-index', index)
        }
      })
      this.swiper.update()
    }
  }, 50)

  @Watch('circular')
  watchCircular() {
    if (this.swiper) {
      this.swiper.destroy()
      this.handleInit()
    }
  }

  @Watch('displayMultipleItems')
  watchDisplayMultipleItems() {
    if (this.swiper) {
      this.swiper.destroy()
      this.handleInit()
    }
  }

  componentWillLoad() {
    this.isWillLoadCalled = true
  }

  componentDidLoad() {
    this.handleInit()
  }

  disconnectedCallback() {
    this.el.removeEventListener('DOMNodeInserted', this.handleSwiperSizeDebounce)
    this.el.removeEventListener('DOMNodeRemoved', this.handleSwiperSizeDebounce)
    this.el.removeEventListener('MutationObserver', this.handleSwiperSizeDebounce)
  }

  componentDidUpdate() {
    if (!this.swiper) return
    this.swiper.update()
  }

  handleSlideChange = debounce((index) => {
    this.onChange.emit({
      current: index,
      source: this.#source,
    })
  }, 50)

  async handleInit() {
    const { autoplay, circular, current, displayMultipleItems, duration, interval, vertical } = this

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    const options: SwiperOptions = {
      modules: [Navigation, Pagination, Autoplay, Zoom],
      pagination: {
        el: `.taro-swiper-${this.#id} > .swiper-container > .swiper-pagination`,
        clickable: true,
        type: 'bullets',
      },
      direction: vertical ? 'vertical' : 'horizontal',
      loop: circular,
      slidesPerView: displayMultipleItems,
      initialSlide: current,
      speed: duration,
      zoom: this.zoom,
      on: {
        slideChange() {
          that.handleSlideChange(this.realIndex)
        },
        touchEnd: () => {
          that.#source = 'touch'
        },
        autoplay() {
          that.#source = 'autoplay'
        },
        transitionEnd() {
          that.onAnimationFinish.emit({
            current: this.realIndex,
            source: that.#source,
          })
        },
      },
    }

    //  自动播放
    if (autoplay) {
      options.autoplay = {
        delay: interval,
        disableOnInteraction: false,
      }
    }

    await waitUntil(() => document.querySelector('.swiper-slide'))

    this.swiper = new SwiperJS(`.taro-swiper-${this.#id} > .swiper-container`, options)
    this.swiperWrapper = this.el.querySelector(`.taro-swiper-${this.#id} > .swiper-container > .swiper-wrapper`)
  }

  render() {
    const { vertical, indicatorDots, indicatorColor, indicatorActiveColor } = this

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
      <Host class={`taro-swiper-${this.#id}`} style={hostStyle}>
        <div class="swiper-container" style={style}>
          <div class="swiper-wrapper">
            <slot />
          </div>
          {indicatorDots && (
            <div
              class={'swiper-pagination'}
              style={{
                '--swiper-pagination-bullet-inactive-opacity': '1',
                '--swiper-pagination-bullet-inactive-color': indicatorColor,
                '--swiper-pagination-color': indicatorActiveColor,
              }}
            />
          )}
        </div>
      </Host>
    )
  }
}
