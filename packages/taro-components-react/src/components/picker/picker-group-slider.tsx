import { ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import * as React from 'react'

import type { PickerGroupProps } from './picker-group'

// 添加类型定义
type TaroScrollView = React.ElementRef<typeof ScrollView>

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

/** 系统读屏是否开启：开启时 mask 需可命中（关掉 pointer-events:none） */
function useA11yOpen(): boolean {
  const [a11yOpen, setA11yOpen] = React.useState(false)
  React.useEffect(() => {
    Taro.checkIsOpenAccessibility()
      .then((res) => {
        setA11yOpen(!!(res as Taro.checkIsOpenAccessibility.SuccessCallbackResult).open)
      })
      .catch(() => {})
  }, [])
  return a11yOpen
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
  // 使用selectedIndex初始化当前索引
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  // 触摸状态用于优化用户体验
  const isTouchingRef = React.useRef(false)
  // 系统读屏开启时关闭 mask 的 pointer-events:none，便于无障碍命中；未开启则保持穿透以便手势滚动
  const a11yOpen = useA11yOpen()

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

  // 滚动到指定索引（供程序化对齐与无障碍步进复用）
  const scrollToIndex = React.useCallback((index: number, withRandomOffset = false) => {
    const baseValue = index * itemHeightRef.current
    const randomOffset = withRandomOffset ? Math.random() * 0.001 : undefined
    setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
  }, [])

  // props 的 selectedIndex 变化：滚至对应项
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouchingRef.current) {
      scrollToIndex(selectedIndex)
      setCurrentIndex(selectedIndex)
    }
  }, [selectedIndex, range, scrollToIndex])

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

      isTouchingRef.current = false
      scrollToIndex(newIndex, true)
      updateIndex(newIndex, columnId)
      onColumnChange?.({ columnId, index: newIndex })
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
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  // 无障碍：整列作单 slider，转子 increment/decrement 切相邻项
  const clampIndex = (index: number) => Math.max(0, Math.min(index, range.length - 1))
  // 切换后主动播报当前项：焦点停在 slider 容器上，aria 属性更新读屏不会自动重读，需主动触发
  const announceIndex = (index: number) => {
    const item = range[index]
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const text = content != null ? String(content) : ''
    if (!text) return
    const fn = (Taro as any).accessibilityAnnounce
    if (typeof fn !== 'function') return
    fn({ announce: text, delay: 300 })
  }
  const commitIndexByA11y = (nextIndex: number) => {
    const clamped = clampIndex(nextIndex)
    if (clamped === currentIndex) return
    isTouchingRef.current = false
    setCurrentIndex(clamped)
    scrollToIndex(clamped, true)
    updateIndex(clamped, columnId)
    onColumnChange?.({ columnId, index: clamped })
    announceIndex(clamped)
  }
  const handleAriaAction = (e: any) => {
    const actionName = e?.detail?.actionName
    if (actionName === 'increment') {
      commitIndexByA11y(currentIndex + 1)
    } else if (actionName === 'decrement') {
      commitIndexByA11y(currentIndex - 1)
    }
  }

  // 无障碍 label：当前项值（用 rangeKey 取显示值），仅 string 或 number（转 string）挂载，对象等其它类型不挂载
  const currentItem = range[currentIndex]
  const currentValue = rangeKey && currentItem && typeof currentItem === 'object' ? currentItem[rangeKey] : currentItem
  const ariaLabel =
    typeof currentValue === 'string'
      ? currentValue
      : typeof currentValue === 'number'
        ? String(currentValue)
        : undefined

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item

    return (
      <View
        id={`picker-item-${columnId}-${index}`}
        key={index}
        ariaHidden
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
          ariaHidden
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
          ariaHidden
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
  ]

  const clickScrollViewProps = enableClickItemScroll
    ? { scrollIntoView, scrollIntoViewAlignment: 'center' as const }
    : {}

  return (
    <View
      className="taro-picker__group"
      style={{ position: 'relative' }}
    >
      {/* 视觉蒙层兼无障碍焦点靶：CSS 默认 pointer-events:none 保证手势穿透滚动；
          系统读屏开启时改为 auto，便于无障碍命中 */}
      <View
        className="taro-picker__mask"
        style={a11yOpen ? { pointerEvents: 'auto' } : undefined}
        ariaRole="slider"
        ariaLabel={ariaLabel}
        // @ts-expect-error Taro View 未声明无障碍扩展 props
        ariaAction={[
          { name: 'increment', label: 'increment' },
          { name: 'decrement', label: 'decrement' },
        ]}
        onAriaAction={handleAriaAction}
      />
      <View
        className="taro-picker__indicator"
        {...(indicatorStyle ? { style: indicatorStyle } : {})}
      />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        showScrollbar={false}
        className="taro-picker__content"
        ariaHidden
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
    timeA11yLimitEventNonce,
    enableClickItemScroll = true,
  } = props

  const indicatorStyle = colors.lineColor ? getIndicatorStyle(colors.lineColor) : null
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const [scrollIntoView, scrollToItemId] = usePickerItemScrollIntoView()
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const isTouchingRef = React.useRef(false)
  const a11yOpen = useA11yOpen()

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

  // 滚动到指定索引（供程序化对齐与无障碍步进复用）
  const scrollToIndex = React.useCallback((index: number, withRandomOffset = false) => {
    const baseValue = index * itemHeightRef.current
    const randomOffset = withRandomOffset ? Math.random() * 0.001 : undefined
    setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
  }, [])

  // props 的 selectedIndex 变化：滚至对应项
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouchingRef.current) {
      scrollToIndex(selectedIndex)
      setCurrentIndex(selectedIndex)
    }
  }, [selectedIndex, range, scrollToIndex])

  // 限位回弹强制对齐：限位后即使 selectedIndex 值不变（回弹到同一边界），nonce 变化也强制重新对齐 scrollTop
  React.useEffect(() => {
    if (!timeA11yLimitEventNonce) return
    if (!scrollViewRef.current || range.length === 0 || isTouchingRef.current) return
    scrollToIndex(selectedIndex, true)
    setCurrentIndex(selectedIndex)
    // 仅被限位触发的列在回弹稳定后补播报一次修正值（nonce 两列共享，需按 columnId 过滤）
    if (timeA11yLimitFocus && timeA11yLimitFocus.columnId === columnId) {
      const item = range[selectedIndex]
      const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
      const text = content != null ? String(content) : ''
      const fn = (Taro as any).accessibilityAnnounce
      if (text && typeof fn === 'function') {
        fn({ announce: text, delay: 300 })
      }
    }
  }, [timeA11yLimitEventNonce]) // 仅依赖 nonce，其余用 ref

  // 是否处于归中状态
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)

  // 滚动静止后归中并同步选中（保留 time 限位业务：超 start/end 由父级修正后经 selectedIndex 回弹）
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
      isTouchingRef.current = false
      const isLimited = Boolean(updateIndex(newIndex, columnId, true))
      // 限位时不归中：父级会通过 selectedIndex / nonce 下发修正值触发重新对齐
      if (!isLimited) {
        scrollToIndex(newIndex, true)
      }
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
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  // 无障碍：整列作单 slider，转子 increment/decrement 切相邻项（保留 time 限位）
  const clampIndex = (index: number) => Math.max(0, Math.min(index, range.length - 1))
  // 切换后主动播报当前项：焦点停在 slider 覆盖层上，aria 属性更新读屏不会自动重读，需主动触发
  const announceIndex = (index: number) => {
    const item = range[index]
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const text = content != null ? String(content) : ''
    if (!text) return
    const fn = (Taro as any).accessibilityAnnounce
    if (typeof fn !== 'function') return
    fn({ announce: text, delay: 300 })
  }
  const commitIndexByA11y = (nextIndex: number) => {
    const clamped = clampIndex(nextIndex)
    if (clamped === currentIndex) return
    isTouchingRef.current = false
    setCurrentIndex(clamped)
    scrollToIndex(clamped, true)
    // 保留 time 限位：超 start/end 时父级修正并经 selectedIndex / nonce 回弹对齐
    updateIndex(clamped, columnId, true)
    announceIndex(clamped)
  }
  const handleAriaAction = (e: any) => {
    const actionName = e?.detail?.actionName
    if (actionName === 'increment') {
      commitIndexByA11y(currentIndex + 1)
    } else if (actionName === 'decrement') {
      commitIndexByA11y(currentIndex - 1)
    }
  }

  // 无障碍 label：当前项值，仅 string 或 number（转 string）挂载，对象等其它类型不挂载
  const currentItem = range[currentIndex]
  const currentValue = rangeKey && currentItem && typeof currentItem === 'object' ? currentItem[rangeKey] : currentItem
  const ariaLabel =
    typeof currentValue === 'string'
      ? currentValue
      : typeof currentValue === 'number'
        ? String(currentValue)
        : undefined

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item

    return (
      <View
        id={`picker-item-${columnId}-${index}`}
        key={index}
        ariaHidden
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
          ariaHidden
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
          ariaHidden
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
  ]

  const clickScrollViewProps = enableClickItemScroll
    ? { scrollIntoView, scrollIntoViewAlignment: 'center' as const }
    : {}

  return (
    <View
      className="taro-picker__group"
      style={{ position: 'relative' }}
    >
      {/* 视觉蒙层兼无障碍焦点靶：CSS 默认 pointer-events:none 保证手势穿透滚动；
          系统读屏开启时改为 auto，便于无障碍命中 */}
      <View
        className="taro-picker__mask"
        style={a11yOpen ? { pointerEvents: 'auto' } : undefined}
        ariaRole="slider"
        ariaLabel={ariaLabel}
        // @ts-expect-error Taro View 未声明无障碍扩展 props
        ariaAction={[
          { name: 'increment', label: 'increment' },
          { name: 'decrement', label: 'decrement' },
        ]}
        onAriaAction={handleAriaAction}
      />
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
        ariaHidden
        {...({
          accessibilityElementsHidden: true,
          importantForAccessibility: 'no-hide-descendants',
        } as any)}
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
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const isTouchingRef = React.useRef(false)
  const a11yOpen = useA11yOpen()

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

  // 滚动到指定索引（供程序化对齐与无障碍步进复用）
  const scrollToIndex = React.useCallback((index: number, withRandomOffset = false) => {
    const baseValue = index * itemHeightRef.current
    const randomOffset = withRandomOffset ? Math.random() * 0.001 : undefined
    setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
  }, [])

  // props 的 selectedIndex 变化：滚至对应项
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouchingRef.current) {
      scrollToIndex(selectedIndex)
      setCurrentIndex(selectedIndex)
    }
  }, [selectedIndex, range, scrollToIndex])

  // 提交日期值：解析文本中的数字（移除年、月、日等后缀）后回调 updateDay
  const commitDay = (index: number) => {
    if (!updateDay) return
    const valueText = range[index] || ''
    const numericValue = parseInt(valueText.replace(/[^0-9]/g, ''))
    updateDay(isNaN(numericValue) ? 0 : numericValue, parseInt(columnId))
  }

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

      isTouchingRef.current = false
      scrollToIndex(newIndex, true)
      commitDay(newIndex)
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
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  // 无障碍：整列作单 slider，转子 increment/decrement 切相邻项
  const clampIndex = (index: number) => Math.max(0, Math.min(index, range.length - 1))
  // 切换后主动播报当前项：焦点停在 slider 覆盖层上，aria 属性更新读屏不会自动重读，需主动触发
  const announceIndex = (index: number) => {
    const text = range[index] != null ? String(range[index]) : ''
    if (!text) return
    const fn = (Taro as any).accessibilityAnnounce
    if (typeof fn !== 'function') return
    fn({ announce: text, delay: 300 })
  }
  const commitIndexByA11y = (nextIndex: number) => {
    const clamped = clampIndex(nextIndex)
    if (clamped === currentIndex) return
    isTouchingRef.current = false
    setCurrentIndex(clamped)
    scrollToIndex(clamped, true)
    commitDay(clamped)
    announceIndex(clamped)
  }
  const handleAriaAction = (e: any) => {
    const actionName = e?.detail?.actionName
    if (actionName === 'increment') {
      commitIndexByA11y(currentIndex + 1)
    } else if (actionName === 'decrement') {
      commitIndexByA11y(currentIndex - 1)
    }
  }

  // 无障碍 label：当前项值，仅 string 或 number（转 string）挂载，对象等其它类型不挂载
  const currentValue = range[currentIndex]
  const ariaLabel =
    typeof currentValue === 'string'
      ? currentValue
      : typeof currentValue === 'number'
        ? String(currentValue)
        : undefined

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    return (
      <View
        id={`picker-item-${columnId}-${index}`}
        key={index}
        ariaHidden
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
          ariaHidden
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
          ariaHidden
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
  ]

  const clickScrollViewProps = enableClickItemScroll
    ? { scrollIntoView, scrollIntoViewAlignment: 'center' as const }
    : {}

  return (
    <View
      className="taro-picker__group"
      style={{ position: 'relative' }}
    >
      {/* 视觉蒙层兼无障碍焦点靶：CSS 默认 pointer-events:none 保证手势穿透滚动；
          系统读屏开启时改为 auto，便于无障碍命中 */}
      <View
        className="taro-picker__mask"
        style={a11yOpen ? { pointerEvents: 'auto' } : undefined}
        ariaRole="slider"
        ariaLabel={ariaLabel}
        // @ts-expect-error Taro View 未声明无障碍扩展 props
        ariaAction={[
          { name: 'increment', label: 'increment' },
          { name: 'decrement', label: 'decrement' },
        ]}
        onAriaAction={handleAriaAction}
      />
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
        ariaHidden
        {...({
          accessibilityElementsHidden: true,
          importantForAccessibility: 'no-hide-descendants',
        } as any)}
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
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const [scrollIntoView, scrollToItemId] = usePickerItemScrollIntoView()
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const isTouchingRef = React.useRef(false)
  // 程序化滚动标记：开屏/受控同步预设值时置 true，避免被 region 级联门误判为用户滚动而重置后续列
  const syncScrollFromPropsRef = React.useRef(false)
  const a11yOpen = useA11yOpen()

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

  // 滚动到指定索引（供程序化对齐与无障碍步进复用）
  const scrollToIndex = React.useCallback((index: number, withRandomOffset = false) => {
    const baseValue = index * itemHeightRef.current
    const randomOffset = withRandomOffset ? Math.random() * 0.001 : undefined
    setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
  }, [])

  // props 的 selectedIndex 变化：滚至对应项，并短时标记程序化滚动（避免级联门误判）
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouchingRef.current) {
      syncScrollFromPropsRef.current = true
      scrollToIndex(selectedIndex)
      setCurrentIndex(selectedIndex)
      const tid = setTimeout(() => {
        syncScrollFromPropsRef.current = false
      }, 400)
      return () => clearTimeout(tid)
    }
  }, [selectedIndex, range, scrollToIndex])

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

      // 程序化滚动（受控同步预设值）不触发级联初始化，仅用户滚动才翻转初始化标志并重置后续列
      const isUserScroll = !syncScrollFromPropsRef.current
      isTouchingRef.current = false
      scrollToIndex(newIndex, true)
      updateIndex(newIndex, columnId, false, isUserScroll)
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
    // 用户触摸滚动立即清程序化标志，使其 scrollEnd 被正确判为用户滚动（触发 region 级联）
    if (isTouchingRef.current) {
      syncScrollFromPropsRef.current = false
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const ih = itemHeightRef.current
    const newIndex = getSelectedIndex(scrollTop, ih, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  // 无障碍：整列作单 slider，转子 increment/decrement 切相邻项
  const clampIndex = (index: number) => Math.max(0, Math.min(index, range.length - 1))
  // 切换后主动播报当前项：焦点停在 slider 覆盖层上，aria 属性更新读屏不会自动重读，需主动触发
  const announceIndex = (index: number) => {
    const item = range[index]
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const text = content != null ? String(content) : ''
    if (!text) return
    const fn = (Taro as any).accessibilityAnnounce
    if (typeof fn !== 'function') return
    fn({ announce: text, delay: 300 })
  }
  const commitIndexByA11y = (nextIndex: number) => {
    const clamped = clampIndex(nextIndex)
    if (clamped === currentIndex) return
    isTouchingRef.current = false
    setCurrentIndex(clamped)
    scrollToIndex(clamped, true)
    updateIndex(clamped, columnId, false, true)
    announceIndex(clamped)
  }
  const handleAriaAction = (e: any) => {
    const actionName = e?.detail?.actionName
    if (actionName === 'increment') {
      commitIndexByA11y(currentIndex + 1)
    } else if (actionName === 'decrement') {
      commitIndexByA11y(currentIndex - 1)
    }
  }

  // 无障碍 label：当前项值（region 用 rangeKey 取显示值），仅 string 或 number 挂载
  const currentItem = range[currentIndex]
  const currentValue = rangeKey && currentItem && typeof currentItem === 'object' ? currentItem[rangeKey] : currentItem
  const ariaLabel =
    typeof currentValue === 'string'
      ? currentValue
      : typeof currentValue === 'number'
        ? String(currentValue)
        : undefined

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item

    return (
      <View
        id={`picker-item-${columnId}-${index}`}
        key={index}
        ariaHidden
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
          ariaHidden
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
          ariaHidden
          className="taro-picker__item taro-picker__item--blank"
          style={{ height: PICKER_LINE_HEIGHT }}
        />
      )),
  ]
  const clickScrollViewProps = enableClickItemScroll
    ? { scrollIntoView, scrollIntoViewAlignment: 'center' as const }
    : {}

  return (
    <View
      className="taro-picker__group"
      style={{ position: 'relative' }}
    >
      {/* 视觉蒙层兼无障碍焦点靶：CSS 默认 pointer-events:none 保证手势穿透滚动；
          系统读屏开启时改为 auto，便于无障碍命中 */}
      <View
        className="taro-picker__mask"
        style={a11yOpen ? { pointerEvents: 'auto' } : undefined}
        ariaRole="slider"
        ariaLabel={ariaLabel}
        // @ts-expect-error Taro View 未声明无障碍扩展 props
        ariaAction={[
          { name: 'increment', label: 'increment' },
          { name: 'decrement', label: 'decrement' },
        ]}
        onAriaAction={handleAriaAction}
      />
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
        ariaHidden
        {...({
          accessibilityElementsHidden: true,
          importantForAccessibility: 'no-hide-descendants',
        } as any)}
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

// 新版无障碍（slider 遮挡方案），根据 mode 自动分发
export function PickerGroupSlider(props: PickerGroupProps) {
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
