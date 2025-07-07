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
  selectedIndex?: number // 替换height，直接使用索引
  initialValue?: any
  columnId: string
  updateIndex: (index: number, columnId: string, needRevise?: boolean) => void // 替换updateHeight
  onColumnChange?: (e: { columnId: string, index: number }) => void // 修改回调参数
  customItem?: React.ReactNode
  updateDay?: (value: number, fields: number) => void
}

// 定义常量
const PICKER_LINE_HEIGHT = 34 // px
const PICKER_VISIBLE_ITEMS = 5 // 可见行数

export function PickerGroupBasic(props: PickerGroupProps) {
  const {
    range = [],
    rangeKey,
    selectedIndex = 0, // 默认值
    initialValue,
    columnId,
    updateIndex,
    onColumnChange,
    customItem
  } = props

  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const itemRefs = React.useRef<Array<TaroView | null>>([])
  const [scrollIntoView, setScrollIntoView] = React.useState<string | null>(null)

  // 计算选中项索引
  const getSelectedIndex = (scrollTop: number) => {
    const index = Math.round(scrollTop / PICKER_LINE_HEIGHT)
    return Math.max(0, Math.min(range.length - 1, index))
  }

  // 滚动事件处理（添加防抖）
  const handleScroll = React.useCallback(() => {
    if (!scrollViewRef.current) return

    const scrollTop = scrollViewRef.current.scrollTop
    const currentIndex = getSelectedIndex(scrollTop)

    // 只有当索引变化时才触发更新，减少不必要的回调
    if (currentIndex !== selectedIndex) {
      updateIndex(currentIndex, columnId)
      onColumnChange?.({ columnId, index: currentIndex })
    }
  }, [selectedIndex, columnId, updateIndex, onColumnChange])

  // 当索引变化时，自动滚动到对应位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0) {
      // 使用scrollIntoView：设置id并滚动
      const itemId = `picker-item-${columnId}-${selectedIndex}`
      setScrollIntoView(itemId)
    }
  }, [selectedIndex, columnId, range.length])

  // 处理初始值
  React.useEffect(() => {
    if (initialValue !== undefined && scrollViewRef.current && range.length > 0) {
      // 查找初始值对应的索引
      const initialIndex = range.findIndex(item => {
        const value = rangeKey ? item[rangeKey] : item
        return value === initialValue
      })

      if (initialIndex >= 0) {
        // 更新索引
        updateIndex(initialIndex, columnId, true) // 标记为初始更新
      }
    }
  }, [initialValue, range, rangeKey, columnId, updateIndex])

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const isSelected = index === selectedIndex

    return (
      <View
        id={`picker-item-${columnId}-${index}`}
        key={index}
        ref={(el) => (itemRefs.current[index] = el)}
        className={`taro-picker__item${isSelected ? ' taro-picker__item--selected' : ''}`}
        style={{ height: PICKER_LINE_HEIGHT }}
      >
        {content}
      </View>
    )
  })

  // 添加自定义项
  const finalPickerItems = customItem
    ? [
      <View
        key="custom"
        className="taro-picker__item taro-picker__item--custom"
        style={{ height: PICKER_LINE_HEIGHT }}
      >
        {customItem}
      </View>,
      ...pickerItem,
    ]
    : pickerItem

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View className="taro-picker__indicator" />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        className="taro-picker__content"
        scrollIntoView={scrollIntoView || undefined}
        style={{
          height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS * 2,
        }}
        onScroll={handleScroll}
        scrollWithAnimation
      >
        {finalPickerItems}
      </ScrollView>
    </View>
  )
}

// 时间选择器骨架
export function PickerGroupTime(props: PickerGroupProps) {
  const { range = [], rangeKey, selectedIndex = 0, columnId, updateIndex, onColumnChange, customItem } = props

  // 无限滚动：补帧4行，拼接数据
  const loopCount = range.length
  const displayRange = [...range.slice(-4), ...range, ...range.slice(0, 4)]

  const scrollViewRef = React.useRef<any>(null)
  const itemRefs = React.useRef<any[]>([])
  const [scrollIntoView, setScrollIntoView] = React.useState<string | null>(null)

  // 当索引变化时，滚动到对应位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0) {
      // 考虑补帧，实际索引需要+4
      const adjustedIndex = selectedIndex + 4
      const itemId = `picker-item-${columnId}-${adjustedIndex}`
      setScrollIntoView(itemId)
    }
  }, [selectedIndex, columnId, range.length])

  // 初始化滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0) {
      // 默认选中第一项
      updateIndex(0, columnId, true) // 标记为初始更新
    }
  }, [range, columnId, updateIndex])

  // 滚动处理
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    const scrollTop = scrollViewRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)

    // 边界：如果滚动到补帧区，立刻跳到真实区
    if (idx < 4) {
      // 通知父组件更新选中项
      const realIdx = loopCount - (4 - idx)
      updateIndex(realIdx >= 0 ? realIdx : 0, columnId)
      onColumnChange?.({ columnId, index: realIdx >= 0 ? realIdx : 0 })
      return
    }

    if (idx >= loopCount + 4) {
      // 通知父组件更新选中项
      const realIdx = idx - loopCount - 4
      updateIndex(realIdx < loopCount ? realIdx : loopCount - 1, columnId)
      onColumnChange?.({ columnId, index: realIdx < loopCount ? realIdx : loopCount - 1 })
      return
    }

    // 正常区域
    const realIdx = idx - 4
    updateIndex(realIdx, columnId)
    onColumnChange?.({ columnId, index: realIdx })
  }

  // 渲染选项
  const pickerItem = displayRange.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const realIndex = index - 4 // 补帧后的实际索引
    const isSelected = realIndex === selectedIndex

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

  const finalPickerItems = customItem
    ? [
      <View key="custom" className="taro-picker__item taro-picker__item--custom">
        {customItem}
      </View>,
      ...pickerItem,
    ]
    : pickerItem

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View className="taro-picker__indicator" />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        className="taro-picker__content"
        scrollIntoView={scrollIntoView || undefined}
        style={{ height: PICKER_LINE_HEIGHT * 5 }}
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
    selectedIndex = 0,
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

  // 年、月、日范围
  const yearRange = getYearRange(startDate.getFullYear(), endDate.getFullYear())
  const monthRange = getMonthRange(startDate, endDate, selectedYear)
  const dayRange = getDayRange(startDate, endDate, selectedYear, selectedMonth)

  // ScrollView引用
  const scrollViewRef = React.useRef<any>(null)
  const [scrollIntoView, setScrollIntoView] = React.useState<string | null>(null)

  // 当外部索引变化时，滚动到对应位置
  React.useEffect(() => {
    if (scrollViewRef.current) {
      const itemId = `picker-item-${columnId}-${selectedIndex}`
      setScrollIntoView(itemId)
    }
  }, [selectedIndex, columnId])

  // 滚动处理
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    const scrollTop = scrollViewRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)

    // 确保索引在有效范围内
    const range = columnId === '0' ? yearRange
      : columnId === '1' ? monthRange : dayRange
    const safeIdx = Math.max(0, Math.min(idx, range.length - 1))

    if (columnId === '0') {
      const newYear = yearRange[safeIdx] || yearRange[0]
      setSelectedYear(newYear)
      if (fields !== 'year') {
        setSelectedMonth(1)
        // 我们不再跟踪selectedDay状态
        // setSelectedDay(1)
      }
      updateDay?.(newYear, 0)
    } else if (columnId === '1') {
      const newMonth = monthRange[safeIdx] || monthRange[0]
      setSelectedMonth(newMonth)
      if (fields === 'day') {
        // 我们不再跟踪selectedDay状态
        // setSelectedDay(1)
      }
      updateDay?.(newMonth, 1)
    } else if (columnId === '2') {
      const newDay = dayRange[safeIdx] || dayRange[0]
      // 我们不再跟踪selectedDay状态
      // setSelectedDay(newDay)
      updateDay?.(newDay, 2)
    }

    updateIndex(safeIdx, columnId)
    onColumnChange?.({ columnId, index: safeIdx })
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
        className={`taro-picker__item${idx === selectedIndex ? ' taro-picker__item--selected' : ''}`}
        style={{ height: PICKER_LINE_HEIGHT }}
      >
        {formatItem(item)}
      </View>
    ))
  }

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View className="taro-picker__indicator" />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        className="taro-picker__content"
        scrollIntoView={scrollIntoView || undefined}
        style={{ height: PICKER_LINE_HEIGHT * 5 }}
        onScroll={handleScroll}
        scrollWithAnimation
      >
        {renderItems()}
      </ScrollView>
    </View>
  )
}

// 地区选择器骨架
export function PickerGroupRegion(props: PickerGroupProps) {
  const { range = [], rangeKey, selectedIndex = 0, columnId, updateIndex, onColumnChange, customItem } = props

  const scrollViewRef = React.useRef<any>(null)
  const itemRefs = React.useRef<any[]>([])
  const [scrollIntoView, setScrollIntoView] = React.useState<string | null>(null)

  // 当索引变化时，滚动到对应位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0) {
      const itemId = `picker-item-${columnId}-${selectedIndex}`
      setScrollIntoView(itemId)
    }
  }, [selectedIndex, columnId, range.length])

  // 初始化滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0) {
      // 使用当前索引
      updateIndex(selectedIndex, columnId, true)
    }
  }, [selectedIndex, range, columnId, updateIndex])

  const handleScroll = () => {
    if (!scrollViewRef.current) return
    const scrollTop = scrollViewRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)
    const safeIdx = Math.max(0, Math.min(idx, range.length - 1))
    updateIndex(safeIdx, columnId)
    onColumnChange?.({ columnId, index: safeIdx })
  }

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const isSelected = index === selectedIndex
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

  const finalPickerItems = customItem
    ? [
      <View key="custom" className="taro-picker__item taro-picker__item--custom">
        {customItem}
      </View>,
      ...pickerItem,
    ]
    : pickerItem

  return (
    <View className="taro-picker__group">
      <View className="taro-picker__mask" />
      <View className="taro-picker__indicator" />
      <ScrollView
        ref={scrollViewRef}
        scrollY
        className="taro-picker__content"
        scrollIntoView={scrollIntoView || undefined}
        style={{ height: PICKER_LINE_HEIGHT * 5 }}
        onScroll={handleScroll}
        scrollWithAnimation
      >
        {finalPickerItems}
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
