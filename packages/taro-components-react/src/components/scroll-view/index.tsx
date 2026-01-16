import './style/index.scss'

import { isFunction } from '@tarojs/shared'
import classNames from 'classnames'

import { createForwardRefComponent, throttle } from '../../utils'
import { useEffect, useRef } from '../../utils/hooks'

import type React from 'react'

function easeOutScroll (from = 0, to = 0, callback) {
  if (from === to || typeof from !== 'number') {
    return
  }
  const change = to - from
  const dur = 500
  const sTime = +new Date()
  function linear (t, b, c, d) {
    return (c * t) / d + b
  }
  const isLarger = to >= from

  function step () {
    from = linear(+new Date() - sTime, from, change, dur)
    if ((isLarger && from >= to) || (!isLarger && to >= from)) {
      callback(to)
      return
    }
    callback(from)
    requestAnimationFrame(step)
  }
  step()
}

function scrollIntoView (id = '', isHorizontal = false, animated = true, scrollIntoViewAlignment?: ScrollLogicalPosition) {
  document.querySelector(`#${id}`)?.scrollIntoView({
    behavior: animated ? 'smooth' : 'auto',
    block: !isHorizontal ? (scrollIntoViewAlignment || 'center') : 'center',
    inline: isHorizontal ? (scrollIntoViewAlignment || 'start') : 'start'
  })
}

function scrollVertical (container, scrollTop, top, isAnimation) {
  if (isAnimation) {
    easeOutScroll(scrollTop.current, top, pos => {
      if (container.current) container.current.scrollTop = pos
    })
  } else {
    if (container.current) container.current.scrollTop = top
  }
  scrollTop.current = top
}

function scrollHorizontal (container, scrollLeft, left, isAnimation) {
  if (isAnimation) {
    easeOutScroll(scrollLeft.current, left, pos => {
      if (container.current) container.current.scrollLeft = pos
    })
  } else {
    if (container.current) container.current.scrollLeft = left
  }
  scrollLeft.current = left
}

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollX: boolean
  scrollY: boolean
  upperThreshold: number
  lowerThreshold: number
  scrollTop: number
  scrollLeft: number
  scrollIntoView?: string
  scrollIntoViewAlignment?: ScrollLogicalPosition
  scrollWithAnimation: boolean
  enableBackToTop?: boolean
  forwardedRef?: React.MutableRefObject<HTMLDivElement>
  onScrollToUpper: (e: React.SyntheticEvent<HTMLDivElement, Event>) => void
  onScrollToLower: (e: React.SyntheticEvent<HTMLDivElement, Event>) => void
  onScroll: (e: React.SyntheticEvent<HTMLDivElement, Event>) => void
  onScrollStart?: (e: React.SyntheticEvent<HTMLDivElement, Event>) => void
  onScrollEnd?: (e: React.SyntheticEvent<HTMLDivElement, Event>) => void
  onTouchMove: (e: React.SyntheticEvent<HTMLDivElement, Event>) => void
  onTouchStart?: (e: React.SyntheticEvent<HTMLDivElement, Event>) => void
  onTouchEnd?: (e: React.SyntheticEvent<HTMLDivElement, Event>) => void
  showScrollbar?: boolean // 新增参数，默认true
  enhanced?: boolean // 新增参数，默认false
}

function ScrollView (props: IProps) {
  const _scrollTop = useRef<any>(null)
  const _scrollLeft = useRef<any>(null)
  const container = useRef<any>(null)
  const scrollEndTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isScrollingRef = useRef<boolean>(false)
  const isInitializedRef = useRef<boolean>(false)
  const onTouchMove = (e) => {
    e.stopPropagation()
  }

  const handleScroll = (props: IProps, isInit = false) => {
    // scrollIntoView
    if (
      props.scrollIntoView &&
      typeof props.scrollIntoView === 'string' &&
      document &&
      document.querySelector &&
      document.querySelector(`#${props.scrollIntoView}`)
    ) {
      const isHorizontal = props.scrollX && !props.scrollY
      if (isInit) {
        setTimeout(() => scrollIntoView(props.scrollIntoView, props.scrollWithAnimation, isHorizontal, props.scrollIntoViewAlignment), 500)
      } else {
        scrollIntoView(props.scrollIntoView, props.scrollWithAnimation, isHorizontal, props.scrollIntoViewAlignment)
      }
    } else {
      const isAnimation = !!props.scrollWithAnimation
      // Y 轴滚动
      if (props.scrollY && typeof props.scrollTop === 'number' && props.scrollTop !== _scrollTop.current) {
        setTimeout(() => scrollVertical(container, _scrollTop, props.scrollTop, isAnimation), 10)
      }
      // X 轴滚动
      if (props.scrollX && typeof props.scrollLeft === 'number' && props.scrollLeft !== _scrollLeft.current) {
        setTimeout(() => scrollHorizontal(container, _scrollLeft, props.scrollLeft, isAnimation), 10)
      }
    }
  }

  useEffect(() => {
    handleScroll(props, true)
    isInitializedRef.current = true
  }, [])

  // 监听 scrollTop、scrollLeft、scrollIntoView 的变化（排除初始化）
  useEffect(() => {
    if (isInitializedRef.current && container.current) {
      handleScroll(props, false)
    }
  }, [props.scrollTop, props.scrollLeft, props.scrollIntoView])

  const {
    className,
    style = {},
    onScroll,
    onScrollToUpper,
    onScrollToLower,
    scrollX,
    scrollY,
    showScrollbar = true, // 默认显示滚动条
    enhanced = false // 默认不增强
  } = props
  let { upperThreshold = 50, lowerThreshold = 50 } = props
  const cls = classNames(
    'taro-scroll',
    {
      'taro-scroll-view__scroll-x': scrollX,
      'taro-scroll-view__scroll-y': scrollY,
      'taro-scroll--hidebar': enhanced === true && showScrollbar === false,
      'taro-scroll--enhanced': enhanced === true
    },
    className
  )
  upperThreshold = Number(upperThreshold)
  lowerThreshold = Number(lowerThreshold)
  const upperAndLower = e => {
    if (!container.current) return
    const { offsetWidth, offsetHeight, scrollLeft, scrollTop, scrollHeight, scrollWidth } = container.current
    if (
      onScrollToLower &&
      ((props.scrollY && offsetHeight + scrollTop + lowerThreshold >= scrollHeight) ||
        (props.scrollX && offsetWidth + scrollLeft + lowerThreshold >= scrollWidth))
    ) {
      onScrollToLower(e)
    }
    if (
      onScrollToUpper &&
      ((props.scrollY && scrollTop <= upperThreshold) || (props.scrollX && scrollLeft <= upperThreshold))
    ) {
      onScrollToUpper(e)
    }
  }
  const upperAndLowerThrottle = throttle(upperAndLower, 200)
  const _onScroll = e => {
    const { scrollLeft, scrollTop, scrollHeight, scrollWidth } = container.current
    _scrollLeft.current = scrollLeft
    _scrollTop.current = scrollTop
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      writable: true,
      value: {
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth
      }
    })

    // 处理滚动开始
    if (!isScrollingRef.current) {
      isScrollingRef.current = true
      if (props.onScrollStart) {
        props.onScrollStart(e)
      }
    }

    // 清除滚动结束定时器
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current)
      scrollEndTimerRef.current = null
    }

    // 设置滚动结束定时器（150ms 无滚动事件后触发）
    if (props.onScrollEnd) {
      scrollEndTimerRef.current = setTimeout(() => {
        if (isScrollingRef.current) {
          isScrollingRef.current = false
          props.onScrollEnd?.(e)
        }
        scrollEndTimerRef.current = null
      }, 150)
    }

    upperAndLowerThrottle(e)
    onScroll && onScroll(e)
  }
  const _onTouchMove = e => {
    isFunction(props.onTouchMove) ? props.onTouchMove(e) : onTouchMove(e)
  }
  const _onTouchStart = e => {
    if (isFunction(props.onTouchStart)) {
      props.onTouchStart(e)
    }
  }
  const _onTouchEnd = e => {
    if (isFunction(props.onTouchEnd)) {
      props.onTouchEnd(e)
    }
  }
  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current)
        scrollEndTimerRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={e => {
        if (e) {
          container.current = e
          if (props.forwardedRef) props.forwardedRef.current = e
        }
      }}
      style={style}
      className={cls}
      onScroll={_onScroll}
      onTouchMove={_onTouchMove}
      onTouchStart={_onTouchStart}
      onTouchEnd={_onTouchEnd}
    >
      {props.children}
    </div>
  )
}

export default createForwardRefComponent(ScrollView)
