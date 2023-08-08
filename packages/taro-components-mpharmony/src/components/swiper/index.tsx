import 'swiper/swiper-bundle.min.css'
import 'weui'
import './style/index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React, { FC, useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'

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

const SwiperItem: FC<SwiperItemProps> = ({ children }) => {
  return <div>{children}</div>
}

const Swiper: FC<SwiperProps> = ({
  children,
  onChange,
  autoplay = false,
  interval = 3000,
  circular = false,
  duration = 500,
  indicatorDots = false,
  current = 0,
  indicatorColor = 'rgba(0, 0, 0, .3)',
  indicatorActiveColor = '#000000',
  vertical = false,
  previousMargin = '0px',
  displayMultipleItems = 1,
  onAnimationFinish
}) => {


  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const ref: any = useRef(null)

  useEffect(() => {
    if (current !== 0) {
      setTimeout(() => {
        ref?.current?.slickGoTo(1)
      }, 100)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      autoplay ? ref?.current?.slickPlay() : ref?.current?.slickPause()
    }, 100)
  }, [autoplay, interval, circular, duration])

  const beforeChange = (_oldIndex, newIndex) => {
    setCurrentIndex(newIndex)
    if (onChange) {
      const e = createEvent('touchend')
      try {
        Object.defineProperty(e, 'detail', {
          enumerable: true,
          value: {
            current: newIndex
          }
        })
      } catch (err) {
      } // eslint-disable-line no-empty
      onChange(e)
    }
  }

  const onPageChange = (index) => {
    if (onAnimationFinish) {
      const e = createEvent('touchend')
      try {
        Object.defineProperty(e, 'detail', {
          enumerable: true,
          value: {
            current: index
          }
        })
      } catch (err) {
      } // eslint-disable-line no-empty
      onAnimationFinish(e)
    }
  }

  return <Slider
    ref={ref}
    dots={indicatorDots}
    speed={duration}
    slidesToScroll={1}
    adaptiveHeight={false}
    beforeChange={beforeChange}
    afterChange={onPageChange}
    infinite={circular}
    dotsClass={vertical ? 'swiper-dots-vertical' : 'swiper-dots'}
    autoplaySpeed={interval}
    vertical={vertical}
    verticalSwiping={vertical}
    centerMode={previousMargin !== '0px'}
    centerPadding={previousMargin || '0px'}
    slidesToShow={displayMultipleItems}
    appendDots={dots => (
      <div
        style={{
          backgroundColor: 'transparent'
        }}
      >
        <ul> {dots} </ul>
      </div>
    )}
    customPaging={i => (
      <div
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: i === currentIndex ? indicatorActiveColor : indicatorColor,
          borderRadius: '50%'
        }}
      >
      </div>
    )}
  >{children}</Slider>
}

export { Swiper, SwiperItem }
