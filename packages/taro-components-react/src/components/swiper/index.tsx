/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import 'swiper/swiper-bundle.min.css'
import 'weui'
import './style/index.css'

import classNames from 'classnames'
import React from 'react'
import Swipers from 'swiper/swiper-bundle.esm.js'

import { debounce } from '../../utils'

import type ISwiper from 'swiper'

let INSTANCE_ID = 0

interface SwiperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  itemId: string
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
  observer: MutationObserver
  observerFirst: MutationObserver
  observerLast: MutationObserver

  componentDidMount () {
    const {
      autoplay = false,
      circular = true,
      current = 0,
      displayMultipleItems = 1,
      duration = 500,
      interval = 5000,
      spaceBetween,
      vertical
    } = this.props

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const opt: Record<string, any> = {
      // 指示器
      pagination: { el: `.taro-swiper-${this._id} > .swiper-container > .swiper-pagination` },
      direction: vertical ? 'vertical' : 'horizontal',
      loop: circular,
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
          } catch (err) {} // eslint-disable-line no-empty
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
          } catch (err) {} // eslint-disable-line no-empty
          that.handleOnAnimationFinish(e)
        },
        observerUpdate (_swiper: ISwiper, e) {
          const target = e.target
          const className = target && typeof target.className === 'string' ? target.className : ''
          if (className.includes('taro_page') && target.style.display !== 'none') {
            if (that.props.autoplay && target.contains(_swiper.$el[0])) {
              if (that.props.circular) {
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

    if (!this.mySwiper || !this.props.circular) return

    const wrapper = this.mySwiper.$wrapperEl[0]
    this.observer = new MutationObserver(this.handleSwiperLoopListen)

    this.observer.observe(wrapper, {
      childList: true
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.mySwiper) {
      const nextCurrent = typeof nextProps.current === 'number' ? nextProps.current : this._$current || 0

      this.handleSwiperLoop()
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
    this.observer?.disconnect?.()
    this.observerFirst?.disconnect?.()
    this.observerLast?.disconnect?.()
  }

  handleOnChange (e: React.FormEvent<HTMLDivElement>) {
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

  handleSwiperLoopListen = () => {
    this.observerFirst?.disconnect?.()
    this.observerLast?.disconnect?.()
    this.observerFirst = new MutationObserver(this.handleSwiperLoop)
    this.observerLast = new MutationObserver(this.handleSwiperLoop)
    const wrapper = this.mySwiper.$wrapperEl[0]
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

  handleSwiperLoop = debounce(() => {
    if (this.mySwiper && this.mySwiper.$wrapperEl && this.props.circular) {
      // @ts-ignore
      this.mySwiper.loopDestroy()
      // @ts-ignore
      this.mySwiper.loopCreate()
    }
  }, 500)

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
