import { ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import * as React from 'react'

import type { PickerGroupProps } from './picker-group'

// 添加类型定义
type TaroScrollView = React.ElementRef<typeof ScrollView>
type TaroView = React.ElementRef<typeof View>

function requestAccessibilityFocusOnView(node: TaroView | null | undefined): void {
  if (node == null) return
  const fn = (Taro as any).setAccessibilityFocus
  if (typeof fn !== 'function') return
  fn({ viewRef: { current: node } as React.RefObject<any> })
}

/** 部分端同 id 连续 scrollIntoView 不生效：先清空再在下一宏任务设回目标 id */
function usePickerItemScrollIntoView(): [string, (itemId: string) => void] {
  const [scrollIntoView, setScrollIntoView] = React.useState('')
  const pulseRef = React.useRef(0)

  const scrollToItemId = React.useCallback((itemId: string) => {
    pulseRef.current += 1
    const token = pulseRef.current
    setScrollIntoView('')
    setTimeout(() => {
      if (pulseRef.current !== token) return
      setScrollIntoView(itemId)
    }, 0)
  }, [])

  return [scrollIntoView, scrollToItemId]
}

// 定义常量
const PICKER_LINE_HEIGHT = 34 // px
const PICKER_VISIBLE_ITEMS = 7 // 可见行数
const PICKER_BLANK_ITEMS = 3 // 空白行数

const getIndicatorStyle = (lineColor: string): React.CSSProperties => {
  return {
    borderTopColor: lineColor,
    borderBottomColor: lineColor
  }
}

// 大屏方案版本要求
const MIN_DESIGN_APP_VERSION = 16

// 判断是否启用测量值缩放适配（true=启用, false=使用系统侧缩放）
const resolveUseMeasuredScale = (res: Taro.getSystemInfo.Result): boolean => {
  // H5/weapp 不参与大屏系数
  if (process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'weapp') {
    return false
  }

  const designAppVersionRaw = (res as any).designAppVersion
  const designAppVersionMajor = designAppVersionRaw != null ? parseInt(String(designAppVersionRaw).trim(), 10) : Number.NaN
  if (!Number.isFinite(designAppVersionMajor) || designAppVersionMajor < MIN_DESIGN_APP_VERSION) {
    return false
  }

  const platform = String((res as any).platform || '').toLowerCase()
  if (platform === 'harmony' || platform === 'android' || platform === 'ios') {
    return true
  }

  return false
}

// 辅助函数：计算 lengthScaleRatio
const calculateLengthScaleRatio = (res: Taro.getSystemInfo.Result): number => {
  let lengthScaleRatio = (res as any)?.lengthScaleRatio
  if (lengthScaleRatio == null || lengthScaleRatio === 0) {
    console.warn('Taro.getSystemInfo: lengthScaleRatio 不存在，使用计算值')
    lengthScaleRatio = 1
    if (res.windowWidth < 320) {
      lengthScaleRatio = res.windowWidth / 320
    } else if (res.windowWidth >= 400 && res.windowWidth < 600) {
      lengthScaleRatio = res.windowWidth / 400
    }
    const shortSide = res.windowWidth < res.windowHeight ? res.windowWidth : res.windowHeight
    const isBigScreen = shortSide >= 600
    if (isBigScreen) {
      lengthScaleRatio = shortSide / 720
    }
  }
  return lengthScaleRatio
}

// 辅助函数：获取系统信息的 lengthScaleRatio 并设置 targetScrollTop
const setTargetScrollTopWithScale = (
  setTargetScrollTop: (value: number) => void,
  baseValue: number,
  randomOffset?: number,
  lengthScaleRatio: number = 1,
) => {
  // H5 和 weapp 不参与放大计算，直接使用 baseValue
  if (process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'weapp') {
    const finalValue = randomOffset !== undefined ? baseValue + randomOffset : baseValue
    setTargetScrollTop(finalValue)
    return
  }

  if (process.env.TARO_PLATFORM === 'harmony') {
    const scaledValue = baseValue
    const finalValue = randomOffset !== undefined ? scaledValue + randomOffset : scaledValue
    setTargetScrollTop(finalValue)
  } else {
    const scaledValue = baseValue * lengthScaleRatio
    const finalValue = randomOffset !== undefined ? scaledValue + randomOffset : scaledValue
    setTargetScrollTop(finalValue)
  }
}

// 根据 scrollTop 计算选中索引
// 系统侧缩放模式：scrollHeight 已被系统缩放，直接相除即可
// 自行缩放模式：需要除以 ratio 换算（harmony 特殊处理，ratio 已内嵌在 itemHeight 中）
const getSelectedIndex = (scrollTop: number, itemHeight: number, lengthScaleRatio: number = 1, useMeasuredScale: boolean = false): number => {
  if (!useMeasuredScale || process.env.TARO_PLATFORM === 'harmony') {
    return Math.round(scrollTop / itemHeight)
  }
  return Math.round(scrollTop / lengthScaleRatio / itemHeight)
}

// 计算单项高度（返回设计稿值）
const calculateItemHeight = (
  scrollView: TaroScrollView | null,
  lengthScaleRatio: number,
  useMeasuredScale: boolean = false,
): number => {
  if (process.env.TARO_PLATFORM === 'harmony') {
    return useMeasuredScale ? PICKER_LINE_HEIGHT * lengthScaleRatio : PICKER_LINE_HEIGHT
  }
  if (scrollView && scrollView?.scrollHeight) {
    return useMeasuredScale
      ? scrollView.scrollHeight / lengthScaleRatio / scrollView.childNodes.length
      : scrollView.scrollHeight / scrollView.childNodes.length
  }
  console.warn('Height measurement anomaly')
  return PICKER_LINE_HEIGHT
}

export function PickerGroupBasic(props: PickerGroupProps) {
  const {
    range = [],
    rangeKey,
    columnId,
    updateIndex,
    onColumnChange,
    selectedIndex = 0, // 使用selectedIndex参数，默认为0
    colors = {},
    enableClickItemScroll = true,
  } = props
  const indicatorStyle = colors.lineColor ? getIndicatorStyle(colors.lineColor) : null
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const [scrollIntoView, scrollToItemId] = usePickerItemScrollIntoView()
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const itemRefs = React.useRef<Array<TaroView | null>>([])
  const selectedIndexPropRef = React.useRef(selectedIndex)
  selectedIndexPropRef.current = selectedIndex
  const syncScrollFromPropsRef = React.useRef(false)
  const pendingScrollSettleFocusRef = React.useRef(false)
  // 使用selectedIndex初始化当前索引
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  // 触摸状态用于优化用户体验
  const isTouchingRef = React.useRef(false)

  const lengthScaleRatioRef = React.useRef(1)
  const useMeasuredScaleRef = React.useRef(false)
  const itemHeightRef = React.useRef(PICKER_LINE_HEIGHT)

  // 初始化时计算 lengthScaleRatio 并判定缩放模式
  React.useEffect(() => {
    Taro.getSystemInfo({
      success: (res) => {
        lengthScaleRatioRef.current = calculateLengthScaleRatio(res)
        useMeasuredScaleRef.current = resolveUseMeasuredScale(res)
        itemHeightRef.current = calculateItemHeight(scrollViewRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
      },
      fail: () => {
        lengthScaleRatioRef.current = 1
        useMeasuredScaleRef.current = false
      }
    })
  }, [])

  React.useEffect(() => {
    itemHeightRef.current = calculateItemHeight(scrollViewRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
  }, [range.length]) // 只在range长度变化时重新计算

  // props 的 selectedIndex 变化：滚至对应项并短时标记程序化滚动（syncScrollFromPropsRef）
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouchingRef.current) {
      syncScrollFromPropsRef.current = true
      const baseValue = selectedIndex * itemHeightRef.current
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, undefined, lengthScaleRatioRef.current)
      setCurrentIndex(selectedIndex)
      const tid = setTimeout(() => {
        syncScrollFromPropsRef.current = false
      }, 400)
      return () => clearTimeout(tid)
    }
  }, [selectedIndex, range])

  // 是否处于归中状态
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)
  // 滚动静止后归中并同步选中
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    // 100ms 内无新滚动则归中并提交索引
    isCenterTimerId.current = setTimeout(() => {
      if (!scrollViewRef.current) return

      const scrollTop = scrollViewRef.current.scrollTop
      const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)

      const allowA11yFocus = !syncScrollFromPropsRef.current
      const shouldFocusOnScrollSettle = pendingScrollSettleFocusRef.current

      isTouchingRef.current = false
      const baseValue = newIndex * itemHeightRef.current
      const randomOffset = Math.random() * 0.001 // 随机数为了在一个项内滚动时强制刷新
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
      updateIndex(newIndex, columnId)
      onColumnChange?.({ columnId, index: newIndex })
      pendingScrollSettleFocusRef.current = false
      if (allowA11yFocus && shouldFocusOnScrollSettle) {
        requestAccessibilityFocusOnView(itemRefs.current[newIndex])
      }
      syncScrollFromPropsRef.current = false
      isCenterTimerId.current = null
    }, 100)
  }
  // 滚动中：按 scrollTop 更新高亮索引
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const ih = itemHeightRef.current
    const newIndex = getSelectedIndex(scrollTop, ih, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
    const spi = selectedIndexPropRef.current
    if (newIndex !== spi) {
      if (!syncScrollFromPropsRef.current || isTouchingRef.current) {
        pendingScrollSettleFocusRef.current = true
      }
      if (isTouchingRef.current) {
        syncScrollFromPropsRef.current = false
      }
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item

    return (
      <View
        id={`picker-item-${columnId}-${index}`}
        key={index}
        ref={(el) => (itemRefs.current[index] = el)}
        className={`taro-picker__item${index === currentIndex ? ' taro-picker__item--selected' : ''}`}
        {...(enableClickItemScroll
          ? { onClick: () => scrollToItemId(`picker-item-${columnId}-${index}`) }
          : {})}
        style={{
          height: PICKER_LINE_HEIGHT,
          color: index === currentIndex
            ? (colors.itemSelectedColor || undefined)
            : (colors.itemDefaultColor || undefined)
        }}
      >
        {content}
      </View>
    )
  })

  const realPickerItems = [
    ...new Array(PICKER_BLANK_ITEMS)
      .fill(null)
      .map((_, idx) => (
        <View
          key={`blank-top-${idx}`}
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
    ...pickerItem,
    ...new Array(PICKER_BLANK_ITEMS)
      .fill(null)
      .map((_, idx) => (
        <View
          key={`blank-bottom-${idx}`}
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
  ]

  const clickScrollViewProps = enableClickItemScroll
    ? { scrollIntoView, scrollIntoViewAlignment: 'center' as const }
    : {}

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" ariaHidden />
      <View
        className="taro-picker__indicator"
        ariaHidden
        {...(indicatorStyle ? { style: indicatorStyle } : {})}
      />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        showScrollbar={false}
        className="taro-picker__content"
        style={{
          height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS,
        }}
        scrollTop={targetScrollTop}
        {...clickScrollViewProps}
        onScroll={handleScroll}
        onTouchStart={() => { isTouchingRef.current = true }}
        onScrollEnd={handleScrollEnd}
        scrollWithAnimation
      >
        {realPickerItems}
      </ScrollView>
    </View>
  )
}

// 时间选择器实现
export function PickerGroupTime(props: PickerGroupProps) {
  const {
    range = [],
    rangeKey,
    columnId,
    updateIndex,
    selectedIndex = 0,
    colors = {},
    timeA11yLimitFocus,
    onTimeA11yLimitFocusConsumed,
    timeA11yLimitEventNonce,
    enableClickItemScroll = true,
  } = props

  const indicatorStyle = colors.lineColor ? getIndicatorStyle(colors.lineColor) : null
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const [scrollIntoView, scrollToItemId] = usePickerItemScrollIntoView()
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const itemRefs = React.useRef<Array<TaroView | null>>([])
  const selectedIndexPropRef = React.useRef(selectedIndex)
  selectedIndexPropRef.current = selectedIndex
  const syncScrollFromPropsRef = React.useRef(false)
  const prevLimitEventNonceRef = React.useRef<number | undefined>(undefined)
  const suppressScrollSettleFocusNonceRef = React.useRef<number | null>(null)
  const pendingScrollSettleFocusRef = React.useRef(false)
  const pendingLimitFocusRef = React.useRef<{ index: number, nonce: number, attempts: number } | null>(null)
  const limitFocusTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const isTouchingRef = React.useRef(false)

  const lengthScaleRatioRef = React.useRef(1)
  const useMeasuredScaleRef = React.useRef(false)
  const itemHeightRef = React.useRef(PICKER_LINE_HEIGHT)

  const clearLimitFocusTimer = React.useCallback(() => {
    if (limitFocusTimerRef.current) {
      clearTimeout(limitFocusTimerRef.current)
      limitFocusTimerRef.current = null
    }
  }, [])

  const tryFocusPendingLimit = React.useCallback(() => {
    const pending = pendingLimitFocusRef.current
    const scrollView = scrollViewRef.current
    if (!pending || !scrollView) return

    const visualIndex = getSelectedIndex(
      scrollView.scrollTop,
      itemHeightRef.current,
      lengthScaleRatioRef.current,
      useMeasuredScaleRef.current,
    )
    const isStable = visualIndex === pending.index

    if (!isStable) {
      if (pending.attempts >= 20) {
        pendingLimitFocusRef.current = null
        if (suppressScrollSettleFocusNonceRef.current === pending.nonce) {
          suppressScrollSettleFocusNonceRef.current = null
        }
        onTimeA11yLimitFocusConsumed?.()
        return
      }
      pending.attempts += 1
      clearLimitFocusTimer()
      limitFocusTimerRef.current = setTimeout(() => {
        tryFocusPendingLimit()
      }, 50)
      return
    }

    const node = itemRefs.current[pending.index]
    pendingLimitFocusRef.current = null
    if (suppressScrollSettleFocusNonceRef.current === pending.nonce) {
      suppressScrollSettleFocusNonceRef.current = null
    }
    clearLimitFocusTimer()
    requestAccessibilityFocusOnView(node)
    onTimeA11yLimitFocusConsumed?.()
  }, [clearLimitFocusTimer, onTimeA11yLimitFocusConsumed])

  const schedulePendingLimitFocus = React.useCallback(() => {
    if (!pendingLimitFocusRef.current) return
    clearLimitFocusTimer()
    limitFocusTimerRef.current = setTimeout(() => {
      tryFocusPendingLimit()
    }, 100)
  }, [clearLimitFocusTimer, tryFocusPendingLimit])

  React.useEffect(() => clearLimitFocusTimer, [clearLimitFocusTimer])

  // 初始化时计算 lengthScaleRatio 并判定缩放模式
  React.useEffect(() => {
    Taro.getSystemInfo({
      success: (res) => {
        lengthScaleRatioRef.current = calculateLengthScaleRatio(res)
        useMeasuredScaleRef.current = resolveUseMeasuredScale(res)
        itemHeightRef.current = calculateItemHeight(scrollViewRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
      },
      fail: () => {
        lengthScaleRatioRef.current = 1
        useMeasuredScaleRef.current = false
      }
    })
  }, [])

  React.useEffect(() => {
    itemHeightRef.current = calculateItemHeight(scrollViewRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
  }, [range.length]) // 只在range长度变化时重新计算

  // props 的 selectedIndex 变化：滚至对应项并短时标记程序化滚动（syncScrollFromPropsRef）
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouchingRef.current) {
      syncScrollFromPropsRef.current = true
      const baseValue = selectedIndex * itemHeightRef.current
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, undefined, lengthScaleRatioRef.current)
      setCurrentIndex(selectedIndex)
      const tid = setTimeout(() => {
        syncScrollFromPropsRef.current = false
      }, 400)
      return () => clearTimeout(tid)
    }
  }, [selectedIndex, range])

  // time 限位 nonce 变更：强制对齐 scrollTop（避免 remount 打断读屏焦点）
  React.useEffect(() => {
    if (!timeA11yLimitEventNonce) return
    if (!scrollViewRef.current || range.length === 0 || isTouchingRef.current) return
    syncScrollFromPropsRef.current = true
    const baseValue = selectedIndex * itemHeightRef.current
    setTargetScrollTopWithScale(setTargetScrollTop, baseValue, Math.random() * 0.001, lengthScaleRatioRef.current)
    setCurrentIndex(selectedIndex)
    const tid = setTimeout(() => {
      syncScrollFromPropsRef.current = false
    }, 400)
    return () => clearTimeout(tid)
  }, [timeA11yLimitEventNonce]) // 仅依赖 nonce，其余用 ref

  React.useLayoutEffect(() => {
    if (timeA11yLimitEventNonce === undefined) return
    const prev = prevLimitEventNonceRef.current
    prevLimitEventNonceRef.current = timeA11yLimitEventNonce
    if (timeA11yLimitEventNonce > 0 && (prev === undefined || timeA11yLimitEventNonce > prev)) {
      suppressScrollSettleFocusNonceRef.current = timeA11yLimitEventNonce
    }
  }, [timeA11yLimitEventNonce])

  // 限位后登记本列待聚焦项，稳定后再 requestAccessibilityFocus
  React.useEffect(() => {
    const req = timeA11yLimitFocus
    if (!req || req.columnId !== columnId) return
    const idx = selectedIndex
    const nonce = req.nonce
    pendingScrollSettleFocusRef.current = false
    pendingLimitFocusRef.current = { index: idx, nonce, attempts: 0 }
    schedulePendingLimitFocus()
  }, [timeA11yLimitFocus, columnId, selectedIndex, schedulePendingLimitFocus])

  // 是否处于归中状态
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)

  // 滚动静止后归中并同步选中
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    // 100ms 内无新滚动则归中并提交索引
    isCenterTimerId.current = setTimeout(() => {
      if (!scrollViewRef.current) return

      const scrollTop = scrollViewRef.current.scrollTop
      const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
      const allowA11yFocus = !syncScrollFromPropsRef.current
      const shouldFocusOnScrollSettle = pendingScrollSettleFocusRef.current
      isTouchingRef.current = false
      const isLimited = Boolean(updateIndex(newIndex, columnId, true))
      const hasPendingLimitFocus = pendingLimitFocusRef.current != null
      if (isLimited) {
        pendingScrollSettleFocusRef.current = false
      }
      if (!isLimited) {
        const baseValue = newIndex * itemHeightRef.current
        const randomOffset = Math.random() * 0.001
        setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
      }
      if (!isLimited && hasPendingLimitFocus) {
        pendingScrollSettleFocusRef.current = false
        schedulePendingLimitFocus()
        syncScrollFromPropsRef.current = false
        isCenterTimerId.current = null
        return
      }
      if (!isLimited && pendingLimitFocusRef.current == null && suppressScrollSettleFocusNonceRef.current != null) {
        suppressScrollSettleFocusNonceRef.current = null
      }
      const suppressByLimitNonce = suppressScrollSettleFocusNonceRef.current != null
      if (!isLimited && allowA11yFocus && shouldFocusOnScrollSettle) {
        pendingScrollSettleFocusRef.current = false
        if (!suppressByLimitNonce) {
          requestAccessibilityFocusOnView(itemRefs.current[newIndex])
        }
      }
      syncScrollFromPropsRef.current = false
      isCenterTimerId.current = null
    }, 100)
  }

  // 滚动中：按 scrollTop 更新高亮索引
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const ih = itemHeightRef.current
    const newIndex = getSelectedIndex(scrollTop, ih, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
    const spi = selectedIndexPropRef.current
    if (newIndex !== spi) {
      if (!syncScrollFromPropsRef.current || isTouchingRef.current) {
        pendingScrollSettleFocusRef.current = true
      }
      if (isTouchingRef.current) {
        syncScrollFromPropsRef.current = false
      }
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
    if (pendingLimitFocusRef.current) {
      schedulePendingLimitFocus()
    }
  }

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item

    return (
      <View
        id={`picker-item-${columnId}-${index}`}
        key={index}
        ref={(el) => (itemRefs.current[index] = el)}
        className={`taro-picker__item${index === currentIndex ? ' taro-picker__item--selected' : ''}`}
        {...(enableClickItemScroll
          ? { onClick: () => scrollToItemId(`picker-item-${columnId}-${index}`) }
          : {})}
        style={{
          height: PICKER_LINE_HEIGHT,
          color: index === currentIndex
            ? (colors.itemSelectedColor || undefined)
            : (colors.itemDefaultColor || undefined)
        }}
      >
        {content}
      </View>
    )
  })

  const realPickerItems = [
    ...new Array(PICKER_BLANK_ITEMS)
      .fill(null)
      .map((_, idx) => (
        <View
          key={`blank-top-${idx}`}
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
    ...pickerItem,
    ...new Array(PICKER_BLANK_ITEMS)
      .fill(null)
      .map((_, idx) => (
        <View
          key={`blank-bottom-${idx}`}
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
  ]

  const clickScrollViewProps = enableClickItemScroll
    ? { scrollIntoView, scrollIntoViewAlignment: 'center' as const }
    : {}

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" ariaHidden />
      <View
        className="taro-picker__indicator"
        ariaHidden
        {...(indicatorStyle ? { style: indicatorStyle } : {})}
      />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        showScrollbar={false}
        className="taro-picker__content"
        style={{
          height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS,
        }}
        scrollTop={targetScrollTop}
        {...clickScrollViewProps}
        onScroll={handleScroll}
        onTouchStart={() => { isTouchingRef.current = true }}
        onScrollEnd={handleScrollEnd}
        scrollWithAnimation
      >
        {realPickerItems}
      </ScrollView>
    </View>
  )
}

// 日期选择器实现
export function PickerGroupDate(props: PickerGroupProps) {
  const {
    range = [],
    columnId,
    updateDay,
    selectedIndex = 0,
    colors = {},
    enableClickItemScroll = true,
  } = props

  const indicatorStyle = colors.lineColor ? getIndicatorStyle(colors.lineColor) : null
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const [scrollIntoView, scrollToItemId] = usePickerItemScrollIntoView()
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const itemRefs = React.useRef<Array<TaroView | null>>([])
  const selectedIndexPropRef = React.useRef(selectedIndex)
  selectedIndexPropRef.current = selectedIndex
  const syncScrollFromPropsRef = React.useRef(false)
  const pendingScrollSettleFocusRef = React.useRef(false)
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const isTouchingRef = React.useRef(false)

  const lengthScaleRatioRef = React.useRef(1)
  const useMeasuredScaleRef = React.useRef(false)
  const itemHeightRef = React.useRef(PICKER_LINE_HEIGHT)

  // 初始化时计算 lengthScaleRatio 并判定缩放模式
  React.useEffect(() => {
    Taro.getSystemInfo({
      success: (res) => {
        lengthScaleRatioRef.current = calculateLengthScaleRatio(res)
        useMeasuredScaleRef.current = resolveUseMeasuredScale(res)
        itemHeightRef.current = calculateItemHeight(scrollViewRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
      },
      fail: () => {
        lengthScaleRatioRef.current = 1
        useMeasuredScaleRef.current = false
      }
    })
  }, [])

  React.useEffect(() => {
    itemHeightRef.current = calculateItemHeight(scrollViewRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
  }, [range.length]) // 只在range长度变化时重新计算

  // props 的 selectedIndex 变化：滚至对应项并短时标记程序化滚动（syncScrollFromPropsRef）
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouchingRef.current) {
      syncScrollFromPropsRef.current = true
      const baseValue = selectedIndex * itemHeightRef.current
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, undefined, lengthScaleRatioRef.current)
      setCurrentIndex(selectedIndex)
      const tid = setTimeout(() => {
        syncScrollFromPropsRef.current = false
      }, 400)
      return () => clearTimeout(tid)
    }
  }, [selectedIndex, range])

  // 是否处于归中状态
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)

  // 滚动静止后归中并同步选中
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }

    // 100ms 内无新滚动则归中并提交索引
    isCenterTimerId.current = setTimeout(() => {
      if (!scrollViewRef.current) return

      const scrollTop = scrollViewRef.current.scrollTop
      const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)

      const allowA11yFocus = !syncScrollFromPropsRef.current
      const shouldFocusOnScrollSettle = pendingScrollSettleFocusRef.current

      isTouchingRef.current = false
      const baseValue = newIndex * itemHeightRef.current
      const randomOffset = Math.random() * 0.001 // 随机数为了在一个项内滚动时强制刷新
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)

      // 更新日期值
      if (updateDay) {
        // 解析文本中的数字（移除年、月、日等后缀）
        const valueText = range[newIndex] || ''
        const numericValue = parseInt(valueText.replace(/[^0-9]/g, ''))
        updateDay(isNaN(numericValue) ? 0 : numericValue, parseInt(columnId))
      }
      pendingScrollSettleFocusRef.current = false
      if (allowA11yFocus && shouldFocusOnScrollSettle) {
        requestAccessibilityFocusOnView(itemRefs.current[newIndex])
      }
      syncScrollFromPropsRef.current = false
      isCenterTimerId.current = null
    }, 100)
  }

  // 滚动中：按 scrollTop 更新高亮索引
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const ih = itemHeightRef.current
    const newIndex = getSelectedIndex(scrollTop, ih, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
    const spi = selectedIndexPropRef.current
    if (newIndex !== spi) {
      if (!syncScrollFromPropsRef.current || isTouchingRef.current) {
        pendingScrollSettleFocusRef.current = true
      }
      if (isTouchingRef.current) {
        syncScrollFromPropsRef.current = false
      }
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    return (
      <View
        id={`picker-item-${columnId}-${index}`}
        key={index}
        ref={(el) => (itemRefs.current[index] = el)}
        className={`taro-picker__item${index === currentIndex ? ' taro-picker__item--selected' : ''}`}
        {...(enableClickItemScroll
          ? { onClick: () => scrollToItemId(`picker-item-${columnId}-${index}`) }
          : {})}
        style={{
          height: PICKER_LINE_HEIGHT,
          color: index === currentIndex
            ? (colors.itemSelectedColor || undefined)
            : (colors.itemDefaultColor || undefined)
        }}
      >
        {item}
      </View>
    )
  })

  const realPickerItems = [
    ...new Array(PICKER_BLANK_ITEMS)
      .fill(null)
      .map((_, idx) => (
        <View
          key={`blank-top-${idx}`}
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
    ...pickerItem,
    ...new Array(PICKER_BLANK_ITEMS)
      .fill(null)
      .map((_, idx) => (
        <View
          key={`blank-bottom-${idx}`}
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
  ]

  const clickScrollViewProps = enableClickItemScroll
    ? { scrollIntoView, scrollIntoViewAlignment: 'center' as const }
    : {}

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" ariaHidden />
      <View
        className="taro-picker__indicator"
        ariaHidden
        {...(indicatorStyle ? { style: indicatorStyle } : {})}
      />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        showScrollbar={false}
        className="taro-picker__content"
        style={{ height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS }}
        scrollTop={targetScrollTop}
        {...clickScrollViewProps}
        onScroll={handleScroll}
        onTouchStart={() => { isTouchingRef.current = true }}
        onScrollEnd={handleScrollEnd}
        scrollWithAnimation
      >
        {realPickerItems}
      </ScrollView>
    </View>
  )
}

// 地区选择器实现
export function PickerGroupRegion(props: PickerGroupProps) {
  const {
    range = [],
    rangeKey,
    columnId,
    updateIndex,
    selectedIndex = 0, // 使用selectedIndex参数，默认为0
    colors = {},
    enableClickItemScroll = true,
  } = props

  const indicatorStyle = colors.lineColor ? getIndicatorStyle(colors.lineColor) : null
  const scrollViewRef = React.useRef<any>(null)
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const [scrollIntoView, scrollToItemId] = usePickerItemScrollIntoView()
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const isTouchingRef = React.useRef(false)

  const lengthScaleRatioRef = React.useRef(1)
  const useMeasuredScaleRef = React.useRef(false)
  const itemHeightRef = React.useRef(PICKER_LINE_HEIGHT)
  const itemRefs = React.useRef<Array<TaroView | null>>([])
  const selectedIndexPropRef = React.useRef(selectedIndex)
  selectedIndexPropRef.current = selectedIndex
  const syncScrollFromPropsRef = React.useRef(false)
  const pendingScrollSettleFocusRef = React.useRef(false)

  // 初始化时计算 lengthScaleRatio 并判定缩放模式
  React.useEffect(() => {
    Taro.getSystemInfo({
      success: (res) => {
        lengthScaleRatioRef.current = calculateLengthScaleRatio(res)
        useMeasuredScaleRef.current = resolveUseMeasuredScale(res)
        itemHeightRef.current = calculateItemHeight(scrollViewRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
      },
      fail: () => {
        lengthScaleRatioRef.current = 1
        useMeasuredScaleRef.current = false
      }
    })
  }, [])

  React.useEffect(() => {
    itemHeightRef.current = calculateItemHeight(scrollViewRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
  }, [range.length]) // 只在range长度变化时重新计算

  // props 的 selectedIndex 变化：滚至对应项并短时标记程序化滚动（syncScrollFromPropsRef）
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouchingRef.current) {
      syncScrollFromPropsRef.current = true
      const baseValue = selectedIndex * itemHeightRef.current
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, undefined, lengthScaleRatioRef.current)
      setCurrentIndex(selectedIndex)
      const tid = setTimeout(() => {
        syncScrollFromPropsRef.current = false
      }, 400)
      return () => clearTimeout(tid)
    }
  }, [selectedIndex, range])

  // 滚动静止后归中（debounce）
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    // 100ms 内无新滚动则归中并提交索引
    isCenterTimerId.current = setTimeout(() => {
      if (!scrollViewRef.current) return

      const scrollTop = scrollViewRef.current.scrollTop
      const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)

      const allowA11yFocus = !syncScrollFromPropsRef.current
      const shouldFocusOnScrollSettle = pendingScrollSettleFocusRef.current

      isTouchingRef.current = false
      const baseValue = newIndex * itemHeightRef.current
      const randomOffset = Math.random() * 0.001 // 随机数为了在一个项内滚动时强制刷新
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
      updateIndex(newIndex, columnId, false, allowA11yFocus)
      pendingScrollSettleFocusRef.current = false
      if (allowA11yFocus && shouldFocusOnScrollSettle) {
        requestAccessibilityFocusOnView(itemRefs.current[newIndex])
      }
      syncScrollFromPropsRef.current = false
      isCenterTimerId.current = null
    }, 100)
  }

  // 滚动中：按 scrollTop 更新高亮索引
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const ih = itemHeightRef.current
    const newIndex = getSelectedIndex(scrollTop, ih, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
    const spi = selectedIndexPropRef.current
    if (newIndex !== spi) {
      if (!syncScrollFromPropsRef.current || isTouchingRef.current) {
        pendingScrollSettleFocusRef.current = true
      }
      if (isTouchingRef.current) {
        syncScrollFromPropsRef.current = false
      }
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item

    return (
      <View
        id={`picker-item-${columnId}-${index}`}
        key={index}
        ref={(el) => (itemRefs.current[index] = el)}
        className={`taro-picker__item${index === currentIndex ? ' taro-picker__item--selected' : ''}`}
        {...(enableClickItemScroll
          ? { onClick: () => scrollToItemId(`picker-item-${columnId}-${index}`) }
          : {})}
        style={{
          height: PICKER_LINE_HEIGHT,
          color: index === currentIndex
            ? (colors.itemSelectedColor || undefined)
            : (colors.itemDefaultColor || undefined)
        }}
      >
        {content}
      </View>
    )
  })

  const realPickerItems = [
    ...new Array(PICKER_BLANK_ITEMS)
      .fill(null)
      .map((_, idx) => (
        <View
          key={`blank-top-${idx}`}
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
    ...pickerItem,
    ...new Array(PICKER_BLANK_ITEMS)
      .fill(null)
      .map((_, idx) => (
        <View
          key={`blank-bottom-${idx}`}
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
  ]
  const clickScrollViewProps = enableClickItemScroll
    ? { scrollIntoView, scrollIntoViewAlignment: 'center' as const }
    : {}

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" ariaHidden />
      <View
        className="taro-picker__indicator"
        ariaHidden
        {...(indicatorStyle ? { style: indicatorStyle } : {})}
      />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        showScrollbar={false}
        className="taro-picker__content"
        style={{ height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS }}
        scrollTop={targetScrollTop}
        {...clickScrollViewProps}
        onScroll={handleScroll}
        onTouchStart={() => { isTouchingRef.current = true }}
        onScrollEnd={handleScrollEnd}
        scrollWithAnimation
      >
        {realPickerItems}
      </ScrollView>
    </View>
  )
}

// 旧版无障碍（逐项 setAccessibilityFocus），根据 mode 自动分发
export function PickerGroupLegacy(props: PickerGroupProps) {
  switch (props.mode) {
    case 'time':
      return <PickerGroupTime {...props} />
    case 'date':
      return <PickerGroupDate {...props} />
    case 'region':
      return <PickerGroupRegion {...props} />
    default:
      return <PickerGroupBasic {...props} />
  }
}
