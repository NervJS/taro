import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Host, Element, State, Watch } from '@stencil/core'
import SwiperJS from 'swiper/bundle'

import type ISwiper from 'swiper'

// 补充 Swiper 运行时存在但未公开声明的生命周期与循环方法
type SwiperInstance = ISwiper & { initialized: boolean, loopFix: () => void }

let INSTANCE_ID = 0
const ONE_ADDITIONAL_SLIDES_THRESHOLD = 5
const TWO_ADDITIONAL_SLIDES_THRESHOLD = 7
@Component({
  tag: 'taro-swiper-core',
  styleUrls: [
    './style/index.scss'
  ]
})
export class Swiper implements ComponentInterface {
  #id = INSTANCE_ID++
  #source = 'autoplay'
  #swiperResetting = false
  // dom 变化是否由外部引起，因为 swiper 的循环模式也会引起 dom 的变化。如果不是由外部引起的 dom 变化，就不需要重新初始化 swiper
  #domChangeByOutSide = false
  #lastSwiperActiveIndex = 0
  #didLoad = false
  #container: HTMLElement | null = null
  #sizeTimer: ReturnType<typeof setTimeout>

  // 只有当前已挂载的实例才能响应属性变化和异步回调
  private isSwiperReady (swiper = this.swiper): swiper is SwiperInstance {
    return !!(this.el?.isConnected && swiper && swiper === this.swiper &&
      !swiper.destroyed && swiper.initialized && swiper.el === this.#container &&
      swiper.wrapperEl?.parentElement === this.#container)
  }

  @Element() el: HTMLElement
  @State() swiperWrapper: HTMLElement | null
  @State() private swiper: SwiperInstance | null = null
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
   * 当前所在滑块的 item-id
   */
  @Prop() currentItemId = ''

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

  /**
   * swiper11 相关的动效参数，具体见文档 https://swiperjs.com/swiper-api#parameters
  */
  @Prop() effectsProps: Record<string, any> = {}

  @Event({
    eventName: 'change'
  }) onChange: EventEmitter

  @Event({
    eventName: 'animationfinish'
  }) onAnimationFinish: EventEmitter

  @Watch('current')
  watchCurrent (newVal) {
    if (this.currentItemId || !this.isWillLoadCalled) return
    const n = parseInt(newVal, 10)
    if (isNaN(n)) return
    const swiper = this.swiper
    if (!this.isSwiperReady(swiper)) {
      this.#lastSwiperActiveIndex = n
      return
    }
    if (n === swiper.realIndex) return
    this.#source = ''
    if (this.circular) {
      swiper.slideToLoop(n) // 更新下标
      this.autoplay && swiper.autoplay.pause()
      // @ts-ignore
      swiper.loopFix()
      this.autoplay && swiper.autoplay.start()
    } else {
      swiper.slideTo(n) // 更新下标
    }
  }

  @Watch('currentItemId')
  watchCurrentItemId (newVal) {
    const swiper = this.swiper
    if (!this.swiperWrapper || !this.isWillLoadCalled || !this.isSwiperReady(swiper)) return

    let itemIdIndex = 0
    this.getSlidersList().forEach((swiperItem, index) => {
      const itemId = swiperItem.getAttribute('item-id')
      if (itemId === newVal) {
        if (this.circular) {
          itemIdIndex = Number(swiperItem.getAttribute('data-swiper-slide-index'))
        } else {
          itemIdIndex = index
        }
      }
    })
    if(itemIdIndex === swiper.realIndex) return // 无需更新
    this.#source = ''
    if (this.circular) {
      swiper.slideToLoop(itemIdIndex) // 更新下标
      // @ts-ignore
      swiper.loopFix()
      this.autoplay && swiper.autoplay.start()
    } else {
      swiper.slideTo(itemIdIndex) // 更新下标
    }
  }

  @Watch('autoplay')
  watchAutoplay (newVal) {
    const swiper = this.swiper
    if (!this.isWillLoadCalled || !this.isSwiperReady(swiper)) return

    const swiperAutoplay = swiper.autoplay
    if (swiperAutoplay) {
      if (swiperAutoplay.running === newVal) return

      if (newVal) {
        if (swiper.params && typeof swiper.params.autoplay === 'object') {
          if (swiper.params.autoplay.disableOnInteraction === true) {
            swiper.params.autoplay.disableOnInteraction = false
          }
          swiper.params.autoplay.delay = this.interval
        }
        swiperAutoplay.start()
      } else {
        swiperAutoplay.stop()
      }
    }
  }

  @Watch('duration')
  watchDuration (newVal) {
    const swiper = this.swiper
    if (!this.isSwiperReady(swiper) || !this.isWillLoadCalled) return
    swiper.params.speed = newVal
  }

  @Watch('interval')
  watchInterval (newVal) {
    const swiper = this.swiper
    if (!this.isSwiperReady(swiper) || !this.isWillLoadCalled) return

    if (typeof swiper.params.autoplay === 'object') {
      swiper.params.autoplay.delay = newVal
    }
  }

  @Watch('swiperWrapper')
  watchSwiperWrapper (newVal?: HTMLElement) {
    const swiper = this.swiper
    if (!this.isWillLoadCalled || !swiper) return
    if (!newVal) return
    const beforeDomOperation = () => {
      if (!this.isSwiperReady(swiper)) {
        // 失效实例不能继续占位，等本次子节点操作完成后恢复轮播
        if (this.swiper === swiper) {
          this.destroySwiper()
          this.handleSwiperSizeDebounce()
        }
        return
      }
      this.#domChangeByOutSide = true
      swiper.autoplay?.stop()
      // 如果是由于外部子节点的变化引起的 dom 变化，需要重新初始化 swiper。
      // 在初dom操作之前，需要调用 loopDestroy，把子节点的顺序恢复
      swiper.loopDestroy()
      swiper.params.loop = false
    }
    this.el.appendChild = <T extends Node>(newChild: T): T => {
      this.#swiperResetting = true
      if(!this.#domChangeByOutSide && this.circular) {
        beforeDomOperation()
      }
      return newVal.appendChild(newChild)
    }
    this.el.insertBefore = <T extends Node>(newChild: T, refChild: Node | null): T => {
      this.#swiperResetting = true
      if(!this.#domChangeByOutSide && this.circular) {
        beforeDomOperation()
      }
      return newVal.insertBefore(newChild, refChild)
    }
    this.el.replaceChild = <T extends Node>(newChild: Node, oldChild: T): T => {
      this.#swiperResetting = true
      if(!this.#domChangeByOutSide && this.circular) {
        beforeDomOperation()
      }
      return newVal.replaceChild(newChild, oldChild)
    }
    this.el.removeChild = <T extends Node>(oldChild: T): T => {
      this.#swiperResetting = true
      if(!this.#domChangeByOutSide && this.circular) {
        beforeDomOperation()
      }
      return newVal.removeChild(oldChild)
    }
  }

  handleSwiperSizeDebounce = () => {
    clearTimeout(this.#sizeTimer)
    const swiper = this.swiper
    this.#sizeTimer = setTimeout(() => {
      if (this.swiper !== swiper || !this.isWillLoadCalled || !this.el.isConnected) return
      if (!this.isSwiperReady(swiper)) {
        this.destroySwiper()
        this.handleInit(true)
        return
      }
      if (this.circular) {
        if (this.#domChangeByOutSide) {
          this.reset()
          this.#domChangeByOutSide = false
          this.#swiperResetting = false
        }
      } else {
        swiper.update()
        this.#swiperResetting = false
      }
    }, 50)
  }

  @Watch("circular")
  watchCircular () {
    const swiper = this.swiper
    if (!this.isSwiperReady(swiper) || !this.isWillLoadCalled) return
    this.reset()
  }

  @Watch("displayMultipleItems")
  watchDisplayMultipleItems () {
    const swiper = this.swiper
    if (!this.isSwiperReady(swiper) || !this.isWillLoadCalled) return
    this.reset()
  }

  @State() observer: MutationObserver | null = null

  componentWillLoad () {
    this.isWillLoadCalled = true
  }

  connectedCallback () {
    if (this.#didLoad) this.handleInit(true)
  }

  componentDidLoad () {
    this.#didLoad = true
    this.handleInit()
  }

  componentDidRender () {
    if (this.#didLoad && !this.isSwiperReady(this.swiper)) {
      this.destroySwiper()
      this.handleInit(true)
    }
  }

  disconnectedCallback () {
    this.destroySwiper()
  }

  private destroySwiper () {
    clearTimeout(this.#sizeTimer)
    this.observer?.disconnect()
    this.observer = null
    const swiper = this.swiper
    if (swiper && !swiper.destroyed) {
      this.#lastSwiperActiveIndex = swiper.realIndex
      // 先切断回调对旧实例的引用，再停止自动播放和销毁实例
      this.swiper = null
      swiper.autoplay?.stop()
      if (swiper.initialized && swiper.wrapperEl) swiper.destroy()
    }
    this.swiper = null
    this.swiperWrapper = null
    this.#domChangeByOutSide = false
    this.#swiperResetting = false
  }

  handleInit (reset = false) {
    if (!this.el?.isConnected || !this.#container?.querySelector('.swiper-wrapper') || this.swiper) return
    const {
      autoplay,
      circular,
      current,
      currentItemId,
      displayMultipleItems,
      duration,
      interval,
      effectsProps,
      vertical
    } = this
    let initialSlide = current
    if (reset) {
      initialSlide = this.#lastSwiperActiveIndex
    }
    if (currentItemId) {
      let itemIdIndex = 0
      this.getSlidersList().forEach((swiperItem, index) => {
        // @ts-ignore
        if (swiperItem.itemId && swiperItem.itemId === currentItemId) {
          itemIdIndex = index
        }
      })
      initialSlide = itemIdIndex
    }
    const loopAdditionalSlides = this.getLoopAdditionalSlides()
    const centeredSlides = displayMultipleItems === 1 && this.getNeedFixLoop()
    const slidesPerView = displayMultipleItems
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const options: any = {
      pagination: { el: this.#container.querySelector('.swiper-pagination') },
      direction: vertical ? 'vertical' : 'horizontal',
      loop: circular,
      slidesPerView: slidesPerView,
      initialSlide: initialSlide,
      loopAdditionalSlides: loopAdditionalSlides,
      speed: duration,
      observeParents: true,
      observer: true,
      centeredSlides: centeredSlides,
      zoom: this.zoom,
      nested: true,
      touchReleaseOnEdges: true,
      threshold: 0,
      ...effectsProps,
      init: false,
      on: {
        transitionEnd(e) {
          if(!that.isSwiperReady(e) || that.#swiperResetting || that.#lastSwiperActiveIndex === this.realIndex) return
          that.#lastSwiperActiveIndex = this.realIndex
          that.getNeedFixLoop() && e.loopFix()
          that.autoplay && e.autoplay.start()
          const currentItemId = that.getCurrentItemId(e)
          that.onAnimationFinish.emit({
            current: this.realIndex,
            source: that.#source,
            currentItemId,
          })
          that.#source = 'autoplay'
        },
        touchMove (e) {
          if (!that.isSwiperReady(e)) return
          that.#source = 'touch'
        },
        slideChange(e) {
          if(!that.isSwiperReady(e) || that.#swiperResetting || that.#lastSwiperActiveIndex === this.realIndex) return
          const currentItemId = that.getCurrentItemId(e)
          that.onChange.emit({
            current: this.realIndex,
            source: that.#source,
            currentItemId,
          })
        },
        init: (e) => {
          if (!that.isSwiperReady(e)) return
          that.getNeedFixLoop() && e.loopFix();
          that.autoplay && e.autoplay.start()
        },
        touchEnd: (e) => {
          if (!that.isSwiperReady(e)) return
          that.#source = 'touch'
          that.autoplay && e.autoplay.start()
        },
        touchStart: (e) => {
          if (!that.isSwiperReady(e)) return
          that.#source = 'touch'
          that.autoplay && e.autoplay.pause()
        },
        autoplay(e) {
          if (!that.isSwiperReady(e)) return
          // Note: 修复 autoplay 时，切换到其他页面再切回来，autoplay 会停止的问题
          // autoplay 会调用 slideTo 方法，里面会判断是否 animating，如果 animating 为 true，就会被 return
          // 参考源码：https://github.com/nolimits4web/swiper/blob/v11.1.0/src/core/slide/slideTo.mjs#27 27行
          // https://github.com/nolimits4web/swiper/blob/v11.1.0/src/modules/autoplay/autoplay.mjs
          e.animating = false;
          that.#source = 'autoplay'
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
    // 使用组件内的真实节点，避免全局选择器在脱离文档或重建时匹配失败
    const swiper = new SwiperJS(this.#container, options) as SwiperInstance
    this.swiper = swiper
    swiper.init()
    if (!this.isSwiperReady(swiper)) {
      this.destroySwiper()
      return
    }

    // Note: 这里是拦截了 swiper 的 minTranslate 和 maxTranslate 方法，手动修复了 loop 模式下的 margin 问题
    // 因为这两个属性会影响滑动到哪个位置进行 fixloop
    // 可参考源码：https://github.com/nolimits4web/swiper/blob/v11.1.0/src/core/events/onTouchMove.mjs
    // https://github.com/nolimits4web/swiper/blob/v11.1.0/src/core/loop/loopFix.mjs
    if(this.getNeedFixLoop()) {
      // @ts-ignore
      const minTranslate = swiper.minTranslate.bind(this.swiper);
      //@ts-ignore
      const maxTranslate = swiper.maxTranslate.bind(this.swiper);
      if(centeredSlides && this.getSlidersList().length < 4) {
        //@ts-ignore
        swiper.minTranslate = ()=> minTranslate() + this.parseMargin()[1];
        //@ts-ignore
        swiper.maxTranslate = ()=> maxTranslate() - this.parseMargin()[0];
      } else {
        //@ts-ignore
        swiper.minTranslate = ()=> minTranslate() - this.parseMargin()[0];
        //@ts-ignore
        swiper.maxTranslate = ()=> maxTranslate() + this.parseMargin()[1];
      }
    }

    this.swiperWrapper = swiper.wrapperEl
    this.observer?.disconnect()
    this.observer = new MutationObserver(this.handleSwiperSizeDebounce)
    this.observer.observe(swiper.wrapperEl, { childList: true })
  }

  reset = () => {
    if (!this.isSwiperReady()) return
    this.destroySwiper()
    this.#swiperResetting = true
    try {
      this.handleInit(true)
    } finally {
      this.#swiperResetting = false
    }
  }

  // 下面为方法函数

  getSlidersList = () => this.el.querySelectorAll('taro-swiper-item-core:not(.swiper-slide-duplicate)') || []

  // 获取是否需要手动修复 loop 的条件
  getNeedFixLoop = () => {
    const margins = this.parseMargin()
    const hasMargin = margins.filter(Boolean).length > 0
    return this.circular && hasMargin
  }

  // Note: loop 的时候添加 additionalSlides 可以避免循环的时候由于 loopFix 不及时，出现空白的问题。但是并不是 additionalSlides 越多越好，因为 additionalSlides 越多，如果 swiper-item 的数量不够，会导致出现 bug。
  // 目前的策略是 swiper-item 的数量小于等于 5 时，不添加 additionalSlides，大于 5 小于等于 7 时，添加 1 个 additionalSlides，大于 7 时，添加 2 个 additionalSlides。
  getLoopAdditionalSlides():number{
    const slidersLength = (this.getSlidersList()).length
    if(!this.el || !this.getNeedFixLoop() || slidersLength < ONE_ADDITIONAL_SLIDES_THRESHOLD) return 0
    if(slidersLength <= TWO_ADDITIONAL_SLIDES_THRESHOLD) return 1
    return 2
  }

  parseMargin = () => {
    const [, previousMargin] = /^(\d+)px/.exec(this.previousMargin) || []
    const [, nextMargin] = /^(\d+)px/.exec(this.nextMargin) || []
    return [parseInt(previousMargin) || 0, parseInt(nextMargin) || 0]
  }

  getCurrentItemId (swiper: ISwiper) {
    const slides = swiper.slides
    const activeIndex = swiper.activeIndex
    const currentSlide = slides[activeIndex]
    return currentSlide?.getAttribute('item-id') || ''
  }

  render () {
    const {
      vertical,
      indicatorDots,
      indicatorColor,
      indicatorActiveColor
    } = this

    const [pM, nM] = this.parseMargin()
    const swiperContainerStyleList: string [] = [
      'overflow: visible;',
      vertical ? `margin-top: ${pM}px; margin-bottom: ${nM}px;` : `margin-right: ${nM}px; margin-left: ${pM}px;`,
      this.full ? 'height: 100%;' : '',
    ]
    const swiperPaginationStyleList: string [] = [
      indicatorDots ? 'opacity: 1;' : 'display: none;',
      'font-size: 0;'
    ]
    const hostStyle: Record<string, string> = { overflow: 'hidden' }

    if (this.full) {
      hostStyle.height = '100%'
    }


    return (
      <Host class={`taro-swiper-${this.#id}`} style={hostStyle}>
        <div class='swiper-container' ref={el => { this.#container = el || null }}>
          <style type='text/css'>
            {`
              .taro-swiper-${this.#id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet { background: ${indicatorColor} }
              .taro-swiper-${this.#id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet-active { background: ${indicatorActiveColor} }
              .taro-swiper-${this.#id} > .swiper-container { ${swiperContainerStyleList.join('')} }
              .taro-swiper-${this.#id} > .swiper-container > .swiper-pagination { ${swiperPaginationStyleList.join('')} }
            `}
          </style>
          <div class='swiper-wrapper'>
            <slot />
          </div>
          <div class='swiper-pagination' />
        </div>
      </Host>
    )
  }
}
