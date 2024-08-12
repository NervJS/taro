import 'swiper/swiper-bundle.css'
import './style/index.css'

import classNames from 'classnames'
import React from 'react'
import Swipers from 'swiper/bundle'

import { createForwardRefComponent, debounce } from '../../utils'

import type ISwiper from 'swiper'

let INSTANCE_ID = 0
const ONE_ADDITIONAL_SLIDES_THRESHOLD = 5
const TWO_ADDITIONAL_SLIDES_THRESHOLD = 7

interface SwiperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  itemId: string
  forwardedRef?: React.MutableRefObject<HTMLDivElement>
}

interface SwiperProps extends React.HTMLAttributes<HTMLDivElement> {
  autoplay?: boolean
  interval?: number
  duration?: number
  current?: number
  displayMultipleItems?: number
  circular?: boolean
  vertical?: boolean
  spaceBetween?: any
  previousMargin?: string
  nextMargin?: string
  indicatorColor?: string
  indicatorActiveColor?: string
  indicatorDots?: boolean
  currentItemId?: string
  forwardedRef?: React.MutableRefObject<HTMLDivElement>
  full?: boolean
  onAnimationFinish?: (e: TouchEvent) => void
  effectsProps?: Record<string, any>
}

const createEvent = (type: string) => {
  let e
  try {
    e = new TouchEvent(type)
  } catch (err) {
    e = document.createEvent('Event')
    e.initEvent(type, true, true)
  }
  return e
}

class SwiperItemInner extends React.Component<SwiperItemProps, Record<string, unknown>> {
  render () {
    const { className, style, itemId, children, forwardedRef, ...restProps } = this.props
    const cls = classNames('swiper-slide', className)
    return (
      <div
        ref={(e) => {
          if (e && forwardedRef) {
            forwardedRef.current = e
          }
        }}
        className={cls}
        style={style}
        item-id={itemId}
        {...restProps}
      >
        {children}
      </div>
    )
  }
}

interface SwiperState {
  swiperWrapper: HTMLElement | null
}

class SwiperInner extends React.Component<SwiperProps, SwiperState> {
  _id = 1 + INSTANCE_ID++
  #source = 'autoplay'
  #swiperResetting: boolean = false
  #lastSwiperActiveIndex: number = 0
  #domChangeByOutSide: boolean = false
  $el: HTMLDivElement | null
  swiper: ISwiper| null
  observer: MutationObserver

  constructor(props) {
    super(props)
    this.state = {
      swiperWrapper: null
    }
  }

  componentDidMount () {
    this.handleInit()
  }

  hackSwiperWrapDomAction () {
    if (!this.state.swiperWrapper || !this.swiper) return
    const appendChild = this.state.swiperWrapper.appendChild.bind(this.state.swiperWrapper)
    const removeChild = this.state.swiperWrapper.removeChild.bind(this.state.swiperWrapper)
    const replaceChild = this.state.swiperWrapper.replaceChild.bind(this.state.swiperWrapper)
    const insertBefore = this.state.swiperWrapper.insertBefore.bind(this.state.swiperWrapper)

    const beforeAction = () => {
      if (!this.state.swiperWrapper || !this.swiper) return
      this.#swiperResetting = true
      if (!this.#domChangeByOutSide && this.props.circular) {
        this.#domChangeByOutSide = true
        this.swiper.loopDestroy()
        this.swiper.params.loop = false
      }
    }

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.swiperWrapper.appendChild = (...args) => {
      beforeAction()
      return appendChild(...args)
    }

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.swiperWrapper.removeChild = (...args) => {
      beforeAction()
      return removeChild(...args)
    }

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.swiperWrapper.replaceChild = (...args) => {
      beforeAction()
      return replaceChild(...args)
    }

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.swiperWrapper.insertBefore = (...args) => {
      beforeAction()
      return insertBefore(...args)
    }
  }

  handleInit = (reset = false) => {
    const {
      autoplay = false,
      circular = true,
      current = 0,
      displayMultipleItems = 1,
      duration = 500,
      interval = 5000,
      currentItemId,
      effectsProps = {},
      vertical
    } = this.props

    let initialSlide = parseInt(String(current), 10)
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
    const centeredSlides = parseFloat(String(displayMultipleItems)) === 1
    const slidesPerView = parseFloat(String(displayMultipleItems)) === 1 ? 'auto' : displayMultipleItems
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const opt: Record<string, any> = {
      // 指示器
      pagination: { el: `.taro-swiper-${this._id} > .swiper-container > .swiper-pagination` },
      direction: vertical ? 'vertical' : 'horizontal',
      loop: circular,
      slidesPerView: slidesPerView,
      initialSlide,
      speed: parseInt(String(duration), 10),
      observer: true,
      observeParents: true,
      loopAdditionalSlides,
      centeredSlides,
      ...effectsProps,
      on: {
        init (_swiper) {
          that.getNeedFixLoop() && _swiper.loopFix()
          that.props.autoplay && _swiper.autoplay.start()
        },
        slideChangeTransitionEnd (_swiper) {
          if (that.#swiperResetting) return
          that.getNeedFixLoop() && _swiper.loopFix()
          that.props.autoplay && _swiper.autoplay.start()
          const e = createEvent('touchend')
          try {
            const currentId = that.getCurrentId(_swiper)
            Object.defineProperty(e, 'detail', {
              enumerable: true,
              value: {
                source: that.#source,
                current: this.realIndex,
                currentId: currentId
              }
            })
          } catch (err) {} // eslint-disable-line no-empty
          that.handleOnAnimationFinish(e)
          that.#source = 'autoplay'
        },
        touchEnd: (_swiper) => {
          that.#source = 'touch'
          that.props.autoplay && _swiper.autoplay.start()
        },
        touchStart: (_swiper) => {
          that.#source = 'touch'
          that.props.autoplay && _swiper.autoplay.pause()
        },
        slideChange (_swiper) {
          if (that.#swiperResetting || that.#lastSwiperActiveIndex === _swiper.realIndex) return
          that.#lastSwiperActiveIndex = _swiper.realIndex
          const e = createEvent('touchend')
          try {
            const currentId = that.getCurrentId(_swiper)
            Object.defineProperty(e, 'detail', {
              enumerable: true,
              value: {
                current: this.realIndex,
                source: that.#source,
                currentId,
              }
            })
          } catch (err) {} // eslint-disable-line no-empty
          that.handleOnChange(e)
        },
        autoplay (_swiper) {
          // Note: 修复 autoplay 时，切换到其他页面再切回来，autoplay 会停止的问题
          _swiper.animating = false
          that.#source = 'autoplay'
        }
      }
    }

    // 自动播放
    if (autoplay) {
      opt.autoplay = {
        delay: parseInt(String(interval), 10),
        disableOnInteraction: false
      }
    }

    this.swiper = new Swipers(this.$el!, opt)
    if (this.getNeedFixLoop()) {
      // @ts-ignore
      const minTranslate = this.swiper.minTranslate.bind(this.swiper)
      // @ts-ignore
      const maxTranslate = this.swiper.maxTranslate.bind(this.swiper)
      if (centeredSlides && this.getSlidersList().length < 4) {
        // @ts-ignore
        this.swiper.minTranslate = () => minTranslate() + this.parseMargin()[1]
        // @ts-ignore
        this.swiper.maxTranslate = () => maxTranslate() - this.parseMargin()[0]
      } else {
        // @ts-ignore
        this.swiper.minTranslate = () => minTranslate() - this.parseMargin()[0]
        // @ts-ignore
        this.swiper.maxTranslate = () => maxTranslate() + this.parseMargin()[1]
      }
    }

    this.setState({
      swiperWrapper: this.swiper.wrapperEl
    })
  }

  componentDidUpdate (prevProps, pervState) {
    if (!this.swiper || !this.state.swiperWrapper) return
    if (pervState.swiperWrapper !== this.state.swiperWrapper && this.state.swiperWrapper) {
      this.observer && this.observer.disconnect()
      this.observer = new MutationObserver(this.handleSwiperSizeDebounce)
      this.observer.observe(this.state.swiperWrapper as Node, {
        childList: true
      })
      this.hackSwiperWrapDomAction()
    }

    if (prevProps.circular !== this.props.circular || prevProps.displayMultipleItems !== this.props.displayMultipleItems) {
      this.reset()
    }

    if (prevProps.interval !== this.props.interval) {
      if (typeof this.swiper.params.autoplay === 'object') {
        this.swiper.params.autoplay.delay = this.props.interval
      }
    }

    if (prevProps.duration !== this.props.duration) {
      this.swiper.params.speed = this.props.duration
    }

    if (prevProps.current !== this.props.current && !this.props.currentItemId) {
      const n = parseInt(String(this.props.current), 10)
      if (isNaN(n) || n === this.swiper.realIndex) return
      this.#source = ''
      if (this.props.circular) {
        this.swiper.slideToLoop(n) // 更新下标
        this.props.autoplay && this.swiper.autoplay.pause()
        // @ts-ignore
        this.swiper.loopFix()
        this.props.autoplay && this.swiper.autoplay.start()
      } else {
        this.swiper.slideTo(n) // 更新下标
      }
    }

    if (prevProps.autoplay !== this.props.autoplay) {
      const swiperAutoplay = this.swiper.autoplay
      if (swiperAutoplay) {
        if (swiperAutoplay.running === this.props.autoplay) return

        if (this.props.autoplay) {
          if (this.swiper.params && typeof this.swiper.params.autoplay === 'object') {
            if (this.swiper.params.autoplay.disableOnInteraction === true) {
              this.swiper.params.autoplay.disableOnInteraction = false
            }
            this.swiper.params.autoplay.delay = this.props.interval
          }
          swiperAutoplay.start()
        } else {
          swiperAutoplay.stop()
        }
      }
    }

    if (prevProps.currentItemId !== this.props.currentItemId) {
      let itemIdIndex = 0
      this.getSlidersList().forEach((swiperItem, index) => {
        const itemId = swiperItem.getAttribute('item-id')
        // @ts-ignore
        if (itemId === this.props.currentItemId) {
          if (this.props.circular) {
            itemIdIndex = Number(swiperItem.getAttribute('data-swiper-slide-index'))
          } else {
            itemIdIndex = index
          }
        }
      })
      if (isNaN(itemIdIndex) || itemIdIndex === this.swiper.realIndex) return
      this.#source = ''
      if (this.props.circular) {
        this.swiper.slideToLoop(itemIdIndex) // 更新下标
        this.props.autoplay && this.swiper.autoplay.pause()
        // @ts-ignore
        this.swiper.loopFix()
        this.props.autoplay && this.swiper.autoplay.start()
      } else {
        this.swiper.slideTo(itemIdIndex) // 更新下标
      }
    }
  }

  componentWillUnmount () {
    this.$el = null
    this.swiper?.destroy?.()
    this.observer?.disconnect?.()
    this.setState({
      swiperWrapper: null
    })
  }

  handleOnChange (e: React.FormEvent<HTMLDivElement>) {
    const func = this.props.onChange
    typeof func === 'function' && func(e)
  }

  handleOnAnimationFinish (e: TouchEvent) {
    const func = this.props.onAnimationFinish
    typeof func === 'function' && func(e)
  }

  handleSwiperSizeDebounce = debounce(() => {
    if (!this.swiper) return
    if (this.props.circular) {
      if (this.#domChangeByOutSide) {
        this.reset()
        this.#domChangeByOutSide = false
      }
    } else {
      this.swiper.update()
      this.#swiperResetting = false
    }
  }, 50)


  reset = () => {
    if (!this.swiper) return
    this.#swiperResetting = true
    this.#lastSwiperActiveIndex = this.swiper.realIndex
    this.swiper.destroy()
    this.handleInit(true)
    this.#swiperResetting = false
  }

  getSlidersList = () => this.$el?.querySelectorAll?.('.swiper-slide') || []

  getNeedFixLoop = () => {
    const margins = this.parseMargin()
    const hasMargin = margins.filter(Boolean).length > 0
    return this.props.circular && hasMargin
  }

  getLoopAdditionalSlides():number {
    const slidersLength = (this.getSlidersList()).length
    if (!this.$el || !this.getNeedFixLoop() || slidersLength < ONE_ADDITIONAL_SLIDES_THRESHOLD) return 0
    if (slidersLength <= TWO_ADDITIONAL_SLIDES_THRESHOLD) return 1
    return 2
  }

  parseMargin = () => {
    const { previousMargin = '0px', nextMargin = '0px' } = this.props
    const [, pM] = /^(\d+)px/.exec(previousMargin) || []
    const [, nN] = /^(\d+)px/.exec(nextMargin as string) || []
    return [parseInt(pM) || 0, parseInt(nN) || 0]
  }

  getCurrentId (swiper: ISwiper) {
    const slides = swiper.slides
    const activeIndex = swiper.activeIndex
    const currentSlide = slides[activeIndex]
    return currentSlide.getAttribute('item-id')
  }

  render () {
    const {
      className,
      style,
      vertical,
      indicatorColor,
      indicatorActiveColor,
      forwardedRef
    } = this.props
    const defaultIndicatorColor = indicatorColor || 'rgba(0, 0, 0, .3)'
    const defaultIndicatorActiveColor = indicatorActiveColor || '#000'
    const cls = classNames(`taro-swiper-${this._id}`, className)
    const sty = Object.assign({
      overflow: 'hidden'
    }, style)
    if (this.props.full) {
      sty.height = '100%'
    }
    const [pM, nM] = this.parseMargin()
    const swiperContainerStyleList:string [] = [
      'overflow: visible;',
      vertical ? `margin-top: ${pM}px; margin-bottom: ${nM}px;` : `margin-right: ${nM}px; margin-left: ${pM}px;`,
      this.props.full ? 'height: 100%;' : ''
    ]


    const paginationCls = classNames(
      'swiper-pagination',
      {
        'swiper-pagination-hidden': !this.props.indicatorDots,
        'swiper-pagination-bullets': this.props.indicatorDots
      }
    )
    return (
      <div className={`swiper-container-wrapper ${cls}`} style={sty} ref={(e) => {
        if (forwardedRef && e) {
          forwardedRef.current = e
        }
      }}>
        <div className='swiper-container' style={{ overflow: 'visible' }} ref={(el) => { this.$el = el }}>
          <div
            dangerouslySetInnerHTML={{
              __html: `<style type='text/css'>
              .taro-swiper-${this._id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet { background: ${defaultIndicatorColor} }
              .taro-swiper-${this._id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet-active { background: ${defaultIndicatorActiveColor} }
              .taro-swiper-${this._id} > .swiper-container { ${swiperContainerStyleList.join('')} }
              </style>`
            }}
          />
          <div className='swiper-wrapper' >{this.props.children}</div>
          <div className={paginationCls} />
        </div>
      </div>
    )
  }
}

export const Swiper = createForwardRefComponent(SwiperInner)
export const SwiperItem = createForwardRefComponent(SwiperItemInner)
