import './style/index.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/zoom'

import classNames from 'classnames'
import React, { useEffect, useRef } from 'react'
import { Autoplay, Pagination, Zoom } from 'swiper/modules'
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react'

import { nonNullable } from '../../utils'

import type { default as SwiperClass } from 'swiper/types/swiper-class'

const SwiperItem = SwiperSlide

type SwiperIndexChangeSource = 'touch' | 'autoplay' | ''
type TaroSwiperEvent = ({
  detail: { current, source },
}: {
  detail: { current: number, source: SwiperIndexChangeSource }
}) => void
interface TaroSwiperProps {
  autoplay?: boolean
  interval?: number
  duration?: number
  current?: number
  displayMultipleItems?: number
  circular?: boolean
  vertical?: boolean
  previousMargin?: string
  nextMargin?: string
  indicatorColor?: string
  indicatorActiveColor?: string
  indicatorDots?: boolean
  zoom?: boolean
  full?: boolean
  onAnimationFinish?: TaroSwiperEvent
  onChange?: TaroSwiperEvent
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Swiper: React.FC<TaroSwiperProps> = ({
  autoplay = false,
  interval = 5000,
  duration = 500,
  current = 0,
  displayMultipleItems = 1,
  circular = false,
  vertical = false,
  previousMargin = '0px',
  nextMargin = '0px',
  indicatorColor = 'rgba(0, 0, 0, .3)',
  indicatorActiveColor = '#000000',
  indicatorDots = false,
  zoom = false,
  full = false,
  onAnimationFinish,
  onChange,
  className,
  style,
  children,
  ...restProps
}) => {
  const source = useRef<SwiperIndexChangeSource>('')
  const swiperInstance = useRef<SwiperClass>()

  const parsePX = (s = '0px') => {
    return parseFloat(s.replace(/r*px/i, ''))
  }

  const moduleArray = [autoplay ? Autoplay : null, indicatorDots ? Pagination : null, zoom ? Zoom : null].filter(
    nonNullable
  )

  useEffect(() => {
    if (!swiperInstance.current) return
    const n = parseInt(String(current), 10)
    if (isNaN(n)) return
    if (circular) {
      swiperInstance.current.slideToLoop(n)
    } else {
      swiperInstance.current.slideTo(n)
    }
  }, [current, circular])

  return (
    <>
      <SwiperReact
        style={Object.assign(
          {
            '--swiper-pagination-bullet-inactive-opacity': '1',
            '--swiper-pagination-bullet-inactive-color': indicatorColor,
            '--swiper-pagination-color': indicatorActiveColor,
            paddingTop: vertical ? parsePX(previousMargin) : 0,
            paddingRight: vertical ? 0 : parsePX(nextMargin),
            paddingBottom: vertical ? parsePX(nextMargin) : 0,
            paddingLeft: vertical ? 0 : parsePX(previousMargin),
          },
          full ? { height: '100dvh' } : {},
          style
        )}
        className={classNames('taro-swiper-h5', className)}
        autoplay={{ delay: interval, disableOnInteraction: false }}
        direction={vertical ? 'vertical' : 'horizontal'}
        loop={circular}
        zoom={zoom}
        speed={duration}
        slidesPerView={displayMultipleItems}
        modules={moduleArray}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => (swiperInstance.current = swiper)}
        // onSlideChange={() => console.log('slide change')}
        onRealIndexChange={(swiper) => {
          // realIndexChange 触发在 autoplay 之前，所以需要 setTimeout 确保 source 正确
          setTimeout(() => {
            onChange?.({
              detail: {
                current: swiper.realIndex,
                source: source.current,
              },
            })
          }, 0)
        }}
        onAutoplay={() => {
          source.current = 'autoplay'
        }}
        onTouchEnd={() => {
          source.current = 'touch'
        }}
        onTransitionEnd={(swiper) => {
          onAnimationFinish?.({
            detail: {
              current: swiper.realIndex,
              source: source.current,
            },
          })

          source.current = ''
        }}
        {...restProps}
      >
        {children}
      </SwiperReact>
    </>
  )
}

export { Swiper, SwiperItem }
