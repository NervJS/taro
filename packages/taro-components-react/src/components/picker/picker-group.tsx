import { ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import * as React from 'react'

// 添加类型定义
type TaroScrollView = React.ElementRef<typeof ScrollView>
type TaroView = React.ElementRef<typeof View>

export interface PickerGroupProps {
  mode?: 'basic' | 'time' | 'date' | 'region'
  range: any[]
  rangeKey?: string
  columnId: string
  updateIndex: (index: number, columnId: string, needRevise?: boolean, isUserBeginScroll?: boolean) => void // 替换updateHeight
  onColumnChange?: (e: { columnId: string, index: number }) => void // 修改回调参数名称
  updateDay?: (value: number, fields: number) => void
  selectedIndex?: number // 添加selectedIndex参数
  _updateTrigger?: any // 仅用于强制触发更新
  colors?: {
    itemDefaultColor?: string // 选项字体默认颜色
    itemSelectedColor?: string // 选项字体选中颜色
    lineColor?: string // 选中指示线颜色
  }
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
const MIN_APP_VERSION = '15.7.0'

// semver 版本比较
const isAppVersionAtLeast = (version: string | undefined, min: string): boolean => {
  if (!version || typeof version !== 'string') return false
  const parts = (v: string) => {
    const m = String(v).trim().match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/)
    if (!m) return []
    return [parseInt(m[1], 10) || 0, parseInt(m[2] || '0', 10) || 0, parseInt(m[3] || '0', 10) || 0]
  }
  const a = parts(version)
  const b = parts(min)
  if (a.length === 0) return false
  if (b.length === 0) return true
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const da = a[i] ?? 0
    const db = b[i] ?? 0
    if (da > db) return true
    if (da < db) return false
  }
  return true
}

// 读取 JDMobileConfig，异常时返回 undefined
const tryGetMobileConfigSync = (opt: { space: string, configName: string, key: string }): unknown => {
  try {
    const fn = (Taro as any).JDMobileConfig?.getMobileConfigSync
    if (typeof fn !== 'function') return undefined
    return fn(opt)
  } catch {
    return undefined
  }
}

// 判断是否启用测量值缩放适配（true=启用, false=使用系统侧缩放）
const resolveUseMeasuredScale = (res: Taro.getSystemInfo.Result): boolean => {
  // H5/weapp 不参与大屏系数
  if (process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'weapp') {
    return false
  }

  // 条件1: designAppVersion < 16，不满足则使用系统侧缩放
  const designAppVersionRaw = (res as any).designAppVersion
  const designAppVersionMajor = designAppVersionRaw != null ? parseInt(String(designAppVersionRaw).trim(), 10) : Number.NaN
  if (!Number.isFinite(designAppVersionMajor) || designAppVersionMajor < MIN_DESIGN_APP_VERSION) {
    return false
  }

  // 条件2: appVersion < 15.7.0，不满足则使用系统侧缩放
  if (!isAppVersionAtLeast(res.version, MIN_APP_VERSION)) {
    return false
  }

  // 条件3: 平台判断
  const platform = String((res as any).platform || '').toLowerCase()
  if (platform === 'harmony') {
    return true
  }
  if (platform === 'android') {
    const raw = tryGetMobileConfigSync({ space: 'taro', configName: 'config', key: 'disableFixBoundingScaleRatio' })
    return raw !== 1 && raw !== '1'
  }
  if (platform === 'ios') {
    const raw = tryGetMobileConfigSync({ space: 'Taro', configName: 'excutor', key: 'disableBoundingScaleRatio' })
    return raw !== 1 && raw !== '1'
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
  } = props
  const indicatorStyle = colors.lineColor ? getIndicatorStyle(colors.lineColor) : null
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const itemRefs = React.useRef<Array<TaroView | null>>([])
  // 使用selectedIndex初始化当前索引
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  // 触摸状态用于优化用户体验
  const [isTouching, setIsTouching] = React.useState(false)

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

  // 当selectedIndex变化时，调整滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouching) {
      const baseValue = selectedIndex * itemHeightRef.current
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, undefined, lengthScaleRatioRef.current)
      setCurrentIndex(selectedIndex)
    }
  }, [selectedIndex, range])

  // 是否处于归中状态
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)
  // 简化为直接在滚动结束时通知父组件
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    // 做一个0.1s延时  0.1s之内没有新的滑动 则把选项归到中间 然后更新选中项
    isCenterTimerId.current = setTimeout(() => {
      if (!scrollViewRef.current) return

      const scrollTop = scrollViewRef.current.scrollTop
      const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)

      setIsTouching(false)
      const baseValue = newIndex * itemHeightRef.current
      const randomOffset = Math.random() * 0.001 // 随机数为了在一个项内滚动时强制刷新
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
      updateIndex(newIndex, columnId)
      onColumnChange?.({ columnId, index: newIndex })
      isCenterTimerId.current = null
    }, 100)
  }
  // 滚动处理 - 在滚动时计算索引然后更新选中项样式
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
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

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View
        className="taro-picker__indicator"
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
        onScroll={handleScroll}
        onTouchStart={() => setIsTouching(true)}
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
  } = props

  const indicatorStyle = colors.lineColor ? getIndicatorStyle(colors.lineColor) : null
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const itemRefs = React.useRef<Array<TaroView | null>>([])
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const [isTouching, setIsTouching] = React.useState(false)

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

  // 当selectedIndex变化时，调整滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouching) {
      const baseValue = selectedIndex * itemHeightRef.current
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, undefined, lengthScaleRatioRef.current)
      setCurrentIndex(selectedIndex)
    }
  }, [selectedIndex, range])

  // 是否处于归中状态
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)

  // 简化为直接在滚动结束时通知父组件
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    // 做一个0.1s延时  0.1s之内没有新的滑动 则把选项归到中间 然后更新选中项
    isCenterTimerId.current = setTimeout(() => {
      if (!scrollViewRef.current) return

      const scrollTop = scrollViewRef.current.scrollTop
      const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
      setIsTouching(false)
      // 调用updateIndex执行限位逻辑，获取是否触发了限位
      const isLimited = Boolean(updateIndex(newIndex, columnId, true))
      // 如果没有触发限位，才执行归中逻辑
      if (!isLimited) {
        const baseValue = newIndex * itemHeightRef.current
        const randomOffset = Math.random() * 0.001
        setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
      }
      isCenterTimerId.current = null
    }, 100)
  }

  // 滚动处理
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
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

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View
        className="taro-picker__indicator"
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
        onScroll={handleScroll}
        onTouchStart={() => setIsTouching(true)}
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
  } = props

  const indicatorStyle = colors.lineColor ? getIndicatorStyle(colors.lineColor) : null
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const [isTouching, setIsTouching] = React.useState(false)

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

  // 当selectedIndex变化时，调整滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouching) {
      const baseValue = selectedIndex * itemHeightRef.current
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, undefined, lengthScaleRatioRef.current)
      setCurrentIndex(selectedIndex)
    }
  }, [selectedIndex, range])

  // 是否处于归中状态
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)

  // 简化为直接在滚动结束时通知父组件
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }

    // 做一个0.1s延时  0.1s之内没有新的滑动 则把选项归到中间 然后更新选中项
    isCenterTimerId.current = setTimeout(() => {
      if (!scrollViewRef.current) return

      const scrollTop = scrollViewRef.current.scrollTop
      const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)

      setIsTouching(false)
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
      isCenterTimerId.current = null
    }, 100)
  }

  // 滚动处理
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
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
        className={`taro-picker__item${index === currentIndex ? ' taro-picker__item--selected' : ''}`}
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

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View
        className="taro-picker__indicator"
        {...(indicatorStyle ? { style: indicatorStyle } : {})}
      />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        showScrollbar={false}
        className="taro-picker__content"
        style={{ height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS }}
        scrollTop={targetScrollTop}
        onScroll={handleScroll}
        onTouchStart={() => setIsTouching(true)}
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
  } = props

  const indicatorStyle = colors.lineColor ? getIndicatorStyle(colors.lineColor) : null
  const scrollViewRef = React.useRef<any>(null)
  const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex)
  const [isTouching, setIsTouching] = React.useState(false)

  const lengthScaleRatioRef = React.useRef(1)
  const useMeasuredScaleRef = React.useRef(false)
  const itemHeightRef = React.useRef(PICKER_LINE_HEIGHT)
  const isUserBeginScrollRef = React.useRef(false)

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

  // 当selectedIndex变化时，调整滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0 && !isTouching) {
      const baseValue = selectedIndex * itemHeightRef.current
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, undefined, lengthScaleRatioRef.current)
      setCurrentIndex(selectedIndex)
    }
  }, [selectedIndex, range])

  // 滚动结束处理
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    // 做一个0.1s延时  0.1s之内没有新的滑动 则把选项归到中间 然后更新选中项
    isCenterTimerId.current = setTimeout(() => {
      if (!scrollViewRef.current) return

      const scrollTop = scrollViewRef.current.scrollTop
      const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)

      setIsTouching(false)
      const baseValue = newIndex * itemHeightRef.current
      const randomOffset = Math.random() * 0.001 // 随机数为了在一个项内滚动时强制刷新
      setTargetScrollTopWithScale(setTargetScrollTop, baseValue, randomOffset, lengthScaleRatioRef.current)
      updateIndex(newIndex, columnId, false, isUserBeginScrollRef.current)
    }, 100)
  }

  // 滚动处理 - 在滚动时计算索引
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const newIndex = getSelectedIndex(scrollTop, itemHeightRef.current, lengthScaleRatioRef.current, useMeasuredScaleRef.current)
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
        className={`taro-picker__item${index === currentIndex ? ' taro-picker__item--selected' : ''}`}
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
  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View
        className="taro-picker__indicator"
        {...(indicatorStyle ? { style: indicatorStyle } : {})}
      />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        showScrollbar={false}
        className="taro-picker__content"
        style={{ height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS }}
        scrollTop={targetScrollTop}
        onScroll={handleScroll}
        onTouchStart={() => {
          setIsTouching(true)
          isUserBeginScrollRef.current = true
        }}
        onScrollEnd={handleScrollEnd}
        scrollWithAnimation
      >
        {realPickerItems}
      </ScrollView>
    </View>
  )
}

// 默认导出，根据 mode 自动分发
export function PickerGroup(props: PickerGroupProps) {
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
