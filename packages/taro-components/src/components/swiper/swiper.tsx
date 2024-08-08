import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Host, Element, State, Watch } from '@stencil/core'
import classNames from 'classnames'
import SwiperJS from 'swiper/bundle'

import { debounce } from '../../utils'
import type ISwiper from 'swiper'
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
  #source = ''
  #swiperResetting = false
  #domChangeByOutSide = false
  #lastSwiperActiveIndex = 0

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

  @Event({
    eventName: 'change'
  }) onChange: EventEmitter

  @Event({
    eventName: 'animationfinish'
  }) onAnimationFinish: EventEmitter

  @Watch('current')
  watchCurrent (newVal) {
    if (this.currentItemId || !this.isWillLoadCalled || !this.swiper) return
    const n = parseInt(newVal, 10)
    if (isNaN(n) || n === this.swiper.realIndex) return
    if (this.circular) {
      this.swiper.slideToLoop(n) // 更新下标
      this.autoplay && this.swiper.autoplay.pause()
      // @ts-ignore
      this.swiper.loopFix()
      this.autoplay && this.swiper.autoplay.start()
    } else {
      this.swiper.slideTo(n) // 更新下标
    }
  }

  @Watch('currentItemId')
  watchCurrentItemId (newVal) {
    if (!this.swiperWrapper || !this.isWillLoadCalled) return

    let itemIdIndex = 0
    this.swiperWrapper!.querySelectorAll('taro-swiper-item-core:not(.swiper-slide-duplicate)').forEach((swiperItem, index) => {
      // @ts-ignore
      if (swiperItem.itemId && swiperItem.itemId === newVal) {
        if (this.circular) {
          itemIdIndex = Number(swiperItem.getAttribute('data-swiper-slide-index'))
        } else {
          itemIdIndex = index
        }
      }
    })
    if (this.circular) {
      this.swiper.slideToLoop(itemIdIndex) // 更新下标
      // @ts-ignore
      this.swiper.loopFix()
      this.autoplay && this.swiper.autoplay.start()
    } else {
      this.swiper.slideTo(itemIdIndex) // 更新下标
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
    if (!this.swiper || !this.isWillLoadCalled) return
    this.swiper.params.speed = newVal
  }

  @Watch('interval')
  watchInterval (newVal) {
    if (!this.swiper || !this.isWillLoadCalled) return

    if (typeof this.swiper.params.autoplay === 'object') {
      this.swiper.params.autoplay.delay = newVal
    }
  }

  @Watch('swiperWrapper')
  watchSwiperWrapper (newVal?: HTMLElement) {
    if (!this.isWillLoadCalled || !this.swiper) return
    if (!newVal) return
    this.el.appendChild = <T extends Node>(newChild: T): T => {
      this.#swiperResetting = true
      if(!this.#domChangeByOutSide && this.circular) {
        this.#domChangeByOutSide = true
        this.swiper.loopDestroy()
        this.swiper.params.loop = false
      }
      return newVal.appendChild(newChild)
    }
    this.el.insertBefore = <T extends Node>(newChild: T, refChild: Node | null): T => {
      this.#swiperResetting = true
      if(!this.#domChangeByOutSide && this.circular) {
        this.#domChangeByOutSide = true
        this.swiper.loopDestroy()
        this.swiper.params.loop = false
      }
      return newVal.insertBefore(newChild, refChild)
    }
    this.el.replaceChild = <T extends Node>(newChild: Node, oldChild: T): T => {
      this.#domChangeByOutSide = true
      if(!this.#domChangeByOutSide && this.circular) {
        this.#domChangeByOutSide = true
        this.swiper.loopDestroy()
        this.swiper.params.loop = false
      }
      this.#swiperResetting = true
      return newVal.replaceChild(newChild, oldChild)
    }
    this.el.removeChild = <T extends Node>(oldChild: T): T => {
      this.#swiperResetting = true
      if(!this.#domChangeByOutSide && this.circular) {
        this.#domChangeByOutSide = true
        this.swiper.loopDestroy()
        this.swiper.params.loop = false
      }
      return newVal.removeChild(oldChild)
    }
  }

  handleSwiperSizeDebounce = debounce(() => {
    if (!this.swiper || !this.isWillLoadCalled) return
    if(this.circular) {
      if(this.#domChangeByOutSide) {
        this.reset()
        this.#domChangeByOutSide = false
        this.#swiperResetting = false
      }
    } else {
      this.swiper.update()
      this.#swiperResetting = false
    }
  }, 50)

  @Watch("circular")
  watchCircular (newVal) {
    if (!this.swiper || !this.isWillLoadCalled) return
    this.#swiperResetting = true
    if (newVal) {
      this.swiper.params.loop = newVal;
      this.swiper.loopCreate();
      this.swiper.update();
      setTimeout(()=>{
        //@ts-ignore
        this.swiper.loopFix()
        this.autoplay && this.swiper.autoplay.start()
        this.#swiperResetting = false
      })
    }
    else {
      this.swiper.loopDestroy();
      this.swiper.params.loop = newVal;
      this.swiper.update();
      this.#swiperResetting = false
    }
  }

  @Watch("displayMultipleItems")
  watchDisplayMultipleItems () {
    if (!this.swiper || !this.isWillLoadCalled) return
    this.reset()
  }

  @State() observer: MutationObserver

  componentWillLoad () {
    this.isWillLoadCalled = true
  }

  componentDidLoad () {
    this.handleInit()
    if (!this.swiper) return
    this.observer = new MutationObserver(this.handleSwiperSizeDebounce)
    this.observer.observe(this.swiperWrapper as Node, {
      childList: true
    })
  }

  disconnectedCallback () {
    this.observer?.disconnect()
  }

  handleInit (reset = false) {
    const {
      autoplay,
      circular,
      current,
      currentItemId,
      displayMultipleItems,
      duration,
      interval,
      vertical
    } = this
    let initialSlide = current
    if (reset) {
      initialSlide = this.#lastSwiperActiveIndex
    } else {
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
    }
    const loopAdditionalSlides = this.getLoopAdditionalSlides()
    const needFixLoop = this.getNeedFixLoop()
    const centeredSlides = displayMultipleItems === 1
    const slidesPerView = displayMultipleItems === 1 ? 'auto' : displayMultipleItems
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const options: any = {
      pagination: { el: `.taro-swiper-${this.#id} > .swiper-container > .swiper-pagination`, clickable: true },
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
      on: {
        slideChangeTransitionEnd(e) {
          if(that.#swiperResetting) return
          needFixLoop && e.loopFix()
          that.autoplay && e.autoplay.start()
          that.onChange.emit({
            current: this.realIndex,
            source: that.#source,
          })
        },
        init: (e) => {
          needFixLoop && e.loopFix();
        },
        touchEnd: (e) => {
          that.#source = 'touch'
          that.autoplay && e.autoplay.start()
        },
        touchStart: (e) => {
          that.autoplay && e.autoplay.pause()
        },
        autoplay(e) {
          // Note: 修复 autoplay 时，切换到其他页面再切回来，autoplay 会停止的问题
          e.animating = false;
          that.#source = 'autoplay'
        },
        transitionEnd () {
          setTimeout(() => {
            that.#source = ''
          })
          that.onAnimationFinish.emit({
            current: this.realIndex,
            source: that.#source,
          })
        }
      }
    }

    // 自动播放
    if (autoplay) {
      options.autoplay = {
        delay: interval,
        stopOnLastSlide: false,
        disableOnInteraction: false
      }
    }
    this.swiper = new SwiperJS(`.taro-swiper-${this.#id} > .swiper-container`, options)

    //Note: 注释
    if(needFixLoop) {
      // @ts-ignore
      const minTranslate = this.swiper.minTranslate.bind(this.swiper);
      //@ts-ignore
      const maxTranslate = this.swiper.maxTranslate.bind(this.swiper);
      if(centeredSlides && this.getSlidersList().length < 4) {
        //@ts-ignore
        this.swiper.minTranslate = ()=> minTranslate() + this.parseMargin()[1];
        //@ts-ignore
        this.swiper.maxTranslate = ()=> maxTranslate() - this.parseMargin()[0];
      } else {
        //@ts-ignore
        this.swiper.minTranslate = ()=> minTranslate() - this.parseMargin()[0];
        //@ts-ignore
        this.swiper.maxTranslate = ()=> maxTranslate() + this.parseMargin()[1];
      }

    }

    this.swiperWrapper = this.el.querySelector(`.taro-swiper-${this.#id} > .swiper-container > .swiper-wrapper`)
  }

  getSlidersList = () => this.el.querySelectorAll('taro-swiper-item-core:not(.swiper-slide-duplicate)') || []

  getNeedFixLoop = () => {
    const margins = this.parseMargin()
    const hasMargin = margins.filter(Boolean).length > 0
    return this.circular && hasMargin
  }

  //Note: 注释
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

  reset = () => {
    this.#swiperResetting = true
    this.#lastSwiperActiveIndex = this.swiper.realIndex
    this.swiper.destroy()
    this.handleInit(true)
    this.#swiperResetting = false
  }
  render () {
    const {
      vertical,
      indicatorDots,
      indicatorColor,
      indicatorActiveColor
    } = this

    const hostStyle: Record<string, string> = { overflow: 'hidden' }
    if (this.full) {
      hostStyle.height = '100%'
    }
    const [pM, nM] = this.parseMargin()
    const swiperContainerStyleList:string [] = [
      'overflow: visible;',
      vertical ? `margin-top: ${pM}px; margin-bottom: ${nM}px;` : `margin-right: ${nM}px; margin-left: ${pM}px;`,
      this.full ? 'height: 100%;' : ''
    ]

    return (
      <Host class={`taro-swiper-${this.#id}`} style={hostStyle}>
        <div class='swiper-container'>
          <style type='text/css'>
            {`
              .taro-swiper-${this.#id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet { background: ${indicatorColor} }
              .taro-swiper-${this.#id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet-active { background: ${indicatorActiveColor} }
              .taro-swiper-${this.#id} > .swiper-container { ${swiperContainerStyleList.join('')} }
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