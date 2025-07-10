import { ScrollView, View } from '@tarojs/components'
import * as React from 'react'

import { getDayRange, getMonthRange, getYearRange } from '../../utils'

// 添加类型定义
type TaroScrollView = React.ElementRef<typeof ScrollView>;
type TaroView = React.ElementRef<typeof View>;

export interface PickerGroupProps {
  mode?: 'basic' | 'time' | 'date' | 'region'
  range: any[]
  rangeKey?: string
  columnId: string
  updateIndex: (index: number, columnId: string, needRevise?: boolean) => void // 替换updateHeight
  onColumnChange?: (e: { columnId: string, index: number }) => void // 修改回调参数
  updateDay?: (value: number, fields: number) => void
}

// 定义常量
const PICKER_LINE_HEIGHT = 34 // px
const PICKER_VISIBLE_ITEMS = 7 // 可见行数
const PICKER_BLANK_ITEMS = 3 // 空白行数

export function PickerGroupBasic(props: PickerGroupProps) {
  const {
    range = [],
    rangeKey,
    columnId,
    updateIndex,
  } = props
  // const [targetScrollTop, setTargetScrollTop] = React.useState(0)
  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const itemRefs = React.useRef<Array<TaroView | null>>([])
  // 默认选中第一项
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const getCurrentItemHeight = () => {
    // 获取当前项的高度  实际高度与渲染高度不一定一致
    return scrollViewRef.current?.scrollHeight / scrollViewRef.current?.childNodes.length || PICKER_LINE_HEIGHT
  }
  const getSelectedIndex = (scrollTop: number) => {
    return Math.round(scrollTop / getCurrentItemHeight())
  }

  // 是否处于归中状态
  const isCenterTimerId = React.useRef<NodeJS.Timeout | null>(null)
  // 简化为直接在滚动结束时通知父组件
  const handleScrollEnd = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    // 做一个0.2s延时  0.2s之内没有新的滑动 则把选项归到中间 然后更新选中项
    isCenterTimerId.current = setTimeout(() => {
      // const scrollTop = scrollViewRef.current.scrollTop
      // const newIndex = getSelectedIndex(scrollTop)

      // setTargetScrollTop(newIndex * getCurrentItemHeight() + Math.random() * 0.001) // 随机数为了在一个项内滚动时强制刷新
      updateIndex(currentIndex, columnId)
    }, 200)
  }
  // 滚动处理 - 在滚动时计算索引然后更新选中项样式
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    if (isCenterTimerId.current) {
      clearTimeout(isCenterTimerId.current)
      isCenterTimerId.current = null
    }
    const scrollTop = scrollViewRef.current.scrollTop
    const newIndex = getSelectedIndex(scrollTop)
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
        // className={`taro-picker__item${index === currentIndex ? ' taro-picker__item--selected' : ''}`}
        className={`taro-picker__item`}
        style={{ height: PICKER_LINE_HEIGHT }}
      >
        {content}
      </View>
    )
  })

  const realPickerItems = [...(new Array(PICKER_BLANK_ITEMS).fill(null).map((_, idx) => (
    <View
      key={`blank-top-${idx}`}
      className="taro-picker__item taro-picker__item--blank"
      style={{ height: PICKER_LINE_HEIGHT }}
    />
  ))), ...pickerItem, ...(new Array(PICKER_BLANK_ITEMS).fill(null).map((_, idx) => (
    <View
      key={`blank-bottom-${idx}`}
      className="taro-picker__item taro-picker__item--blank"
      style={{ height: PICKER_LINE_HEIGHT }}
    />
  )))]

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View className="taro-picker__indicator" />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        className="taro-picker__content"
        style={{
          height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS,
        }}
        // scrollTop={targetScrollTop}
        onScroll={handleScroll}
        onScrollEnd={handleScrollEnd}
        scrollWithAnimation
      >
        {realPickerItems}
      </ScrollView>
    </View>
  )
}

// 时间选择器骨架
export function PickerGroupTime(props: PickerGroupProps) {
  const { range = [], rangeKey, columnId, updateIndex, onColumnChange } = props

  // 无限滚动：补帧4行，拼接数据
  const loopCount = range.length
  const displayRange = [...range.slice(-4), ...range, ...range.slice(0, 4)]

  const scrollViewRef = React.useRef<any>(null)
  const itemRefs = React.useRef<any[]>([])
  // 内部自主管理索引状态
  const currentIndex = React.useRef(0)
  const [scrollIntoView, setScrollIntoView] = React.useState<string | null>(null)

  // 初始化滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0) {
      // 默认选中第一项
      updateIndex(0, columnId, true) // 标记为初始更新

      // 考虑补帧，实际索引需要+4
      const adjustedIndex = 4 // 默认选中第一项，补帧后是索引4
      const itemId = `picker-item-${columnId}-${adjustedIndex}`
      setScrollIntoView(itemId)
    }
  }, [range, columnId, updateIndex])

  // 滚动处理 - 简化逻辑
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    const scrollTop = scrollViewRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)

    let realIdx: number

    // 边界：如果滚动到补帧区，立刻调整索引
    if (idx < 4) {
      realIdx = loopCount - (4 - idx)
      realIdx = realIdx >= 0 ? realIdx : 0
    } else if (idx >= loopCount + 4) {
      realIdx = idx - loopCount - 4
      realIdx = realIdx < loopCount ? realIdx : loopCount - 1
    } else {
      realIdx = idx - 4
    }

    // 只有索引变化时才通知父组件
    if (realIdx !== currentIndex.current) {
      updateIndex(realIdx, columnId)
      onColumnChange?.({ columnId, index: realIdx })
      currentIndex.current = realIdx
    }
  }

  // 渲染选项
  const pickerItem = displayRange.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const realIndex = index - 4 // 补帧后的实际索引
    const isSelected = realIndex === currentIndex.current

    return (
      <View
        key={index}
        id={`picker-item-${columnId}-${index}`}
        ref={(el) => (itemRefs.current[index] = el)}
        className={`taro-picker__item${isSelected ? ' taro-picker__item--selected' : ''}`}
        style={{ height: PICKER_LINE_HEIGHT }}
      >
        {content}
      </View>
    )
  })

  const finalPickerItems = pickerItem

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View className="taro-picker__indicator" />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        className="taro-picker__content"
        scrollIntoView={scrollIntoView || undefined}
        style={{ height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS }}
        onScroll={handleScroll}
        scrollWithAnimation
      >
        {finalPickerItems}
      </ScrollView>
    </View>
  )
}

// 日期选择器实现
export function PickerGroupDate(
  props: PickerGroupProps & {
    start?: string
    end?: string
    fields?: 'year' | 'month' | 'day'
    value?: [number, number, number]
    updateDay?: (value: number, fields: number) => void
  }
) {
  const {
    updateIndex,
    onColumnChange,
    start = '1970-01-01',
    end = '2999-12-31',
    fields = 'day',
    value = [1970, 1, 1],
    updateDay,
    columnId
  } = props

  // 解析起止日期
  const startDate = new Date(start)
  const endDate = new Date(end)
  // 当前选中年、月、日
  const [selectedYear, setSelectedYear] = React.useState(value[0] || startDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState(value[1] || 1)
  // 内部管理索引
  const currentIndex = React.useRef(0)

  // 年、月、日范围
  const yearRange = getYearRange(startDate.getFullYear(), endDate.getFullYear())
  const monthRange = getMonthRange(startDate, endDate, selectedYear)
  const dayRange = getDayRange(startDate, endDate, selectedYear, selectedMonth)

  // ScrollView引用
  const scrollViewRef = React.useRef<any>(null)
  const [scrollIntoView, setScrollIntoView] = React.useState<string | null>(null)

  // 初始化滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current) {
      // 默认选中第一项
      const itemId = `picker-item-${columnId}-0`
      setScrollIntoView(itemId)
    }
  }, [columnId])

  // 滚动处理 - 简化逻辑
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    const scrollTop = scrollViewRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)

    // 确保索引在有效范围内
    const range = columnId === '0' ? yearRange
      : columnId === '1' ? monthRange : dayRange
    const safeIdx = Math.max(0, Math.min(idx, range.length - 1))

    // 只有索引变化时才更新
    if (safeIdx !== currentIndex.current) {
      currentIndex.current = safeIdx

      if (columnId === '0') {
        const newYear = yearRange[safeIdx] || yearRange[0]
        setSelectedYear(newYear)
        if (fields !== 'year') {
          setSelectedMonth(1)
        }
        updateDay?.(newYear, 0)
      } else if (columnId === '1') {
        const newMonth = monthRange[safeIdx] || monthRange[0]
        setSelectedMonth(newMonth)
        updateDay?.(newMonth, 1)
      } else if (columnId === '2') {
        const newDay = dayRange[safeIdx] || dayRange[0]
        updateDay?.(newDay, 2)
      }

      updateIndex(safeIdx, columnId)
      onColumnChange?.({ columnId, index: safeIdx })
    }
  }

  // 渲染列表项
  const renderItems = () => {
    // 根据列ID选择正确的数据源和格式化方式
    const range = columnId === '0' ? yearRange
      : columnId === '1' ? monthRange : dayRange

    const formatItem = (item: number) => {
      if (columnId === '0') return `${item}年`
      if (columnId === '1') return `${item < 10 ? `0${item}` : item}月`
      return `${item < 10 ? `0${item}` : item}日`
    }

    return range.map((item, idx) => (
      <View
        key={idx}
        id={`picker-item-${columnId}-${idx}`}
        className={`taro-picker__item${idx === currentIndex.current ? ' taro-picker__item--selected' : ''}`}
        style={{ height: PICKER_LINE_HEIGHT }}
      >
        {formatItem(item)}
      </View>
    ))
  }

  const realPickerItems = [...(new Array(PICKER_BLANK_ITEMS).fill(null).map((_, idx) => (
    <View
      key={`blank-top-${idx}`}
      className="taro-picker__item taro-picker__item--blank"
      style={{ height: PICKER_LINE_HEIGHT }}
    />
  ))), ...renderItems(), ...(new Array(PICKER_BLANK_ITEMS).fill(null).map((_, idx) => (
    <View
      key={`blank-bottom-${idx}`}
      className="taro-picker__item taro-picker__item--blank"
      style={{ height: PICKER_LINE_HEIGHT }}
    />
  )))]

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View className="taro-picker__indicator" />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        className="taro-picker__content"
        scrollIntoView={scrollIntoView || undefined}
        style={{ height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS }}
        onScroll={handleScroll}
        scrollWithAnimation
      >
        {realPickerItems}
      </ScrollView>
    </View>
  )
}

// 地区选择器骨架
export function PickerGroupRegion(props: PickerGroupProps) {
  const { range = [], rangeKey, columnId, updateIndex, onColumnChange } = props

  const scrollViewRef = React.useRef<any>(null)
  const itemRefs = React.useRef<any[]>([])
  // 内部自主管理索引
  const currentIndex = React.useRef(0)
  const [scrollIntoView, setScrollIntoView] = React.useState<string | null>(null)

  // 初始化滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0) {
      // 默认选中第一项
      const itemId = `picker-item-${columnId}-0`
      setScrollIntoView(itemId)

      // 通知父组件初始选中
      updateIndex(0, columnId, true)
    }
  }, [range, columnId, updateIndex])

  // 滚动处理 - 简化逻辑
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    const scrollTop = scrollViewRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)
    const safeIdx = Math.max(0, Math.min(idx, range.length - 1))

    // 只有索引变化时才通知父组件
    if (safeIdx !== currentIndex.current) {
      currentIndex.current = safeIdx
      updateIndex(safeIdx, columnId)
      onColumnChange?.({ columnId, index: safeIdx })
    }
  }

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const isSelected = index === currentIndex.current
    return (
      <View
        key={index}
        id={`picker-item-${columnId}-${index}`}
        ref={(el) => (itemRefs.current[index] = el)}
        className={`taro-picker__item${isSelected ? ' taro-picker__item--selected' : ''}`}
        style={{ height: PICKER_LINE_HEIGHT }}
      >
        {content}
      </View>
    )
  })

  const realPickerItems = [...(new Array(PICKER_BLANK_ITEMS).fill(null).map((_, idx) => (
    <View
      key={`blank-top-${idx}`}
      className="taro-picker__item taro-picker__item--blank"
      style={{ height: PICKER_LINE_HEIGHT }}
    />
  ))), ...pickerItem, ...(new Array(PICKER_BLANK_ITEMS).fill(null).map((_, idx) => (
    <View
      key={`blank-bottom-${idx}`}
      className="taro-picker__item taro-picker__item--blank"
      style={{ height: PICKER_LINE_HEIGHT }}
    />
  )))]
  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View className="taro-picker__indicator" />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        className="taro-picker__content"
        scrollIntoView={scrollIntoView || undefined}
        style={{ height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS }}
        onScroll={handleScroll}
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
