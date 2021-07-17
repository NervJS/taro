import 'weui'
import React from 'react'
import classNames from 'classnames'
import Swipers from 'swiper/swiper-bundle.esm.js'

import type ISwiper from 'swiper'

import 'swiper/swiper-bundle.min.css'
import './style/index.css'

let INSTANCE_ID = 0

interface SwiperItemProps {
  className: string
  style: Record<string, string>
  itemId: string
}

interface SwiperProps {
  className?: string
  style?: Record<string, string>
  autoplay?: boolean
  interval?: number
  duration?: number
  current?: number
  displayMultipleItems?: number
  vertical?: boolean
  spaceBetween?: any
  previousMargin?: string
  nextMargin?: string
  indicatorColor?: string
  indicatorActiveColor?: string
  indicatorDots?: boolean
  onChange?: (e: Event) => void
  onAnimationFinish?: (e: TouchEvent) => void
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

class SwiperItem extends React.Component<SwiperItemProps, Record<string, unknown>> {
  render () {
    const { className, style, itemId, children, ...restProps } = this.props
    const cls = classNames('swiper-slide', className)
    return (
      <div
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

class Swiper extends React.Component<SwiperProps, Record<string, unknown>> {
  _id = 1 + INSTANCE_ID++
  _$current = 0
  _$width = 0
  _$height = 0
  $el: HTMLDivElement | null
  mySwiper: ISwiper

  componentDidMount () {
    const {
      autoplay = false,
      interval = 5000,
      duration = 500,
      current = 0,
      displayMultipleItems = 1,
      vertical,
      spaceBetween
    } = this.props

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const opt: Record<string, any> = {
      // 指示器
      pagination: { el: `.taro-swiper-${this._id} > .swiper-container > .swiper-pagination` },
      direction: vertical ? 'vertical' : 'horizontal',
      loop: true,
      slidesPerView: parseFloat(String(displayMultipleItems)),
      initialSlide: parseInt(String(current), 10),
      speed: parseInt(String(duration), 10),
      observer: true,
      observeParents: true,
      on: {
        slideChange () {
          const e = createEvent('touchend')
          try {
            Object.defineProperty(e, 'detail', {
              enumerable: true,
              value: {
                current: this.realIndex
              }
            })
          } catch (err) {}
          that._$current = this.realIndex
          that.handleOnChange(e)
        },
        transitionEnd () {
          const e = createEvent('touchend')
          try {
            Object.defineProperty(e, 'detail', {
              enumerable: true,
              value: {
                current: this.mySwiper.realIndex
              }
            })
            if (this.mySwiper.isBeginning) {
              this.mySwiper.slideToLoop((this.props.children as any).length - 1, 0)
            } else if (this.mySwiper.isEnd) {
              this.mySwiper.slideToLoop(0, 0)
            }
          } catch (err) {}
          that.handleOnAnimationFinish(e)
        },
        observerUpdate (e) {
          const target = e.target
          const className = target && typeof target.className === 'string' ? target.className : ''
          if (className.includes('taro_page') && target.style.display === 'block') {
            if (that.props.autoplay && target.contains(this.$el[0])) {
              this.slideTo(that.props.current)
            }
          } else if (className.includes('swiper-wrapper')) {
            if (e.addedNodes.length > 0 || e.removedNodes.length > 0) {
              this.loopDestroy()
              this.loopCreate()
            }
          }
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

    // 两端距离
    if (spaceBetween) {
      opt.spaceBetween = spaceBetween
    }

    this.mySwiper = new Swipers(this.$el!, opt)
    setTimeout(() => {
      this.mySwiper.update()
    }, 500)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.mySwiper) {
      const nextCurrent = typeof nextProps.current === 'number' ? nextProps.current : this._$current || 0

      ;(this.mySwiper as any).loopDestroy()
      ;(this.mySwiper as any).loopCreate()
      // 是否衔接滚动模式
      if (nextProps.circular) {
        if (!this.mySwiper.isBeginning && !this.mySwiper.isEnd) {
          this.mySwiper.slideToLoop(parseInt(nextCurrent, 10)) // 更新下标
        }
      } else {
        this.mySwiper.slideTo(parseInt(nextCurrent, 10) + 1) // 更新下标
      }

      const autoplay = this.mySwiper.autoplay
      // 判断是否需要停止或开始自动轮播
      if (autoplay.running !== nextProps.autoplay) {
        if (nextProps.autoplay) {
          if (typeof this.mySwiper.params.autoplay === 'object') {
            this.mySwiper.params.autoplay.disableOnInteraction = false
            this.mySwiper.params.autoplay.delay = parseInt(String(this.props.interval) || '3000', 10)
          }
          autoplay.start()
        } else {
          autoplay.stop()
        }
      }

      this.mySwiper.update() // 更新子元素
    }
  }

  componentDidUpdate (preProps) {
    if (preProps.children.length === 0 && (this.props.children as any).length > 0) {
      (this.mySwiper as any).loopDestroy()
      ;(this.mySwiper as any).loopCreate()
    }
    if (!this.mySwiper) return
    if (this.props.autoplay) {
      if (this._$width !== this.mySwiper.width || this._$height !== this.mySwiper.height) {
        this.mySwiper.autoplay.start()
      }
    }
    this._$width = this.mySwiper.width
    this._$height = this.mySwiper.height
  }

  componentWillUnmount () {
    this.$el = null
    if (this.mySwiper) this.mySwiper.destroy()
  }

  handleOnChange (e: Event) {
    const func = this.props.onChange
    typeof func === 'function' && func(e)
  }

  handleOnAnimationFinish (e: TouchEvent) {
    const func = this.props.onAnimationFinish
    typeof func === 'function' && func(e)
  }

  parsePX (s = '0px') {
    return parseFloat(s.replace(/r*px/i, ''))
  }

  render () {
    const {
      className,
      style,
      vertical,
      previousMargin,
      nextMargin,
      indicatorColor,
      indicatorActiveColor
    } = this.props
    const defaultIndicatorColor = indicatorColor || 'rgba(0, 0, 0, .3)'
    const defaultIndicatorActiveColor = indicatorActiveColor || '#000'
    const cls = classNames(`taro-swiper-${this._id}`, className)
    const sty = Object.assign({
      paddingTop: vertical ? this.parsePX(previousMargin) : 0,
      paddingRight: vertical ? 0 : this.parsePX(nextMargin),
      paddingBottom: vertical ? this.parsePX(nextMargin) : 0,
      paddingLeft: vertical ? 0 : this.parsePX(previousMargin),
      overflow: 'hidden'
    }, style)
    const paginationCls = classNames(
      'swiper-pagination',
      {
        'swiper-pagination-hidden': !this.props.indicatorDots,
        'swiper-pagination-bullets': this.props.indicatorDots
      }
    )
    return (
      <div className={`swiper-container-wrapper ${cls}`} style={sty}>
        <div className='swiper-container' style={{ overflow: 'visible' }} ref={(el) => { this.$el = el }}>
          <div
            dangerouslySetInnerHTML={{
              __html: `<style type='text/css'>
              .taro-swiper-${this._id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet { background: ${defaultIndicatorColor} }
              .taro-swiper-${this._id} > .swiper-container > .swiper-pagination > .swiper-pagination-bullet-active { background: ${defaultIndicatorActiveColor} }
              </style>`
            }}
          />
          <div className='swiper-wrapper'>{this.props.children}</div>
          <div className={paginationCls} />
        </div>
      </div>
    )
  }
}

export { Swiper, SwiperItem }
