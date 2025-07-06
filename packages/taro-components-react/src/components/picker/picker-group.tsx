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
  height?: number // 改为可选参数
  initialValue?: any // 新增：初始选中值
  columnId: string
  updateHeight: (height: number, columnId: string, needRevise?: boolean) => void
  onColumnChange?: (e: { columnId: string, index: number }) => void // 修改为传递 index
  customItem?: React.ReactNode
  updateDay?: (value: number, fields: number) => void
}

const PICKER_LINE_HEIGHT = 34 // px
const PICKER_VISIBLE_ITEMS = 5 // 可见行数
const PICKER_TOP = PICKER_LINE_HEIGHT * ((PICKER_VISIBLE_ITEMS - 1) / 2) // 计算中间位置

export function PickerGroupBasic(props: PickerGroupProps) {
  const {
    range = [],
    rangeKey,
    height = 0, // 默认值
    initialValue,
    columnId,
    updateHeight,
    onColumnChange,
    customItem
  } = props

  const scrollViewRef = React.useRef<TaroScrollView>(null)
  const itemRefs = React.useRef<Array<TaroView | null>>([])

  // 计算选中项索引（改进版）
  const getSelectedIndex = (scrollTop: number) => {
    const index = Math.round(scrollTop / PICKER_LINE_HEIGHT)
    return Math.max(0, Math.min(range.length - 1, index))
  }

  // 计算相对高度
  const getRelativeHeight = (index: number) => {
    return PICKER_TOP - index * PICKER_LINE_HEIGHT
  }

  // 滚动事件处理（添加防抖）
  const handleScroll = React.useCallback(() => {
    if (!scrollViewRef.current) return

    const scrollTop = scrollViewRef.current.scrollTop
    const currentIndex = getSelectedIndex(scrollTop)
    const relativeHeight = getRelativeHeight(currentIndex)

    // 只有当索引变化时才触发更新，减少不必要的回调
    if (currentIndex !== getSelectedIndex(height)) {
      updateHeight(relativeHeight, columnId)
      onColumnChange?.({ columnId, index: currentIndex })
    }
  }, [height, columnId, updateHeight, onColumnChange])

  // 处理初始值
  React.useEffect(() => {
    if (initialValue !== undefined && scrollViewRef.current && range.length > 0) {
      // 查找初始值对应的索引
      const initialIndex = range.findIndex(item => {
        const value = rangeKey ? item[rangeKey] : item
        return value === initialValue
      })

      if (initialIndex >= 0) {
        // 滚动到初始位置
        scrollViewRef.current.scrollTo({
          scrollTop: initialIndex * PICKER_LINE_HEIGHT,
          duration: 0
        })

        // 更新高度
        const relativeHeight = getRelativeHeight(initialIndex)
        updateHeight(relativeHeight, columnId, true) // 标记为初始更新
      }
    }
  }, [initialValue, range, rangeKey, columnId, updateHeight])

  // 计算当前选中项
  const selectedIndex = getSelectedIndex(height)

  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const isSelected = index === selectedIndex

    return (
      <View
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
        style={{
          height: PICKER_LINE_HEIGHT * PICKER_VISIBLE_ITEMS,
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
  const { range = [], rangeKey, height = 0, columnId, updateHeight, onColumnChange, customItem } = props
  const PICKER_LINE_HEIGHT = 34
  const PICKER_TOP = 102
  // 无限滚动：补帧4行，拼接数据
  const loopCount = range.length
  const displayRange = [...range.slice(-4), ...range, ...range.slice(0, 4)]
  // 选中项 index（需偏移4行）
  const selectedIndex = Math.max(0, Math.round((PICKER_TOP - height) / PICKER_LINE_HEIGHT)) + 4
  const scrollViewRef = React.useRef<any>(null)
  const itemRefs = React.useRef<any[]>([])

  // 初始化滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0) {
      // 默认滚动到中间位置
      const initialScrollTop = 4 * PICKER_LINE_HEIGHT // 补帧区后的第一项
      scrollViewRef.current.scrollTop = initialScrollTop

      // 更新高度
      const relativeHeight = PICKER_TOP - PICKER_LINE_HEIGHT * 0 // 选中第一项
      updateHeight(relativeHeight, columnId, true) // 标记为初始更新
    }
  }, [range, columnId, updateHeight])

  // 滚动到选中项
  const handleScroll = () => {
    if (!scrollViewRef.current) return
    const scrollTop = scrollViewRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)
    // 边界：如果滚动到补帧区，立刻跳到真实区
    if (idx < 4) {
      // 跳到真实区末尾
      const realIdx = idx + loopCount
      const realTop = realIdx * PICKER_LINE_HEIGHT
      scrollViewRef.current.scrollTop = realTop
      return
    }
    if (idx >= loopCount + 4) {
      // 跳到真实区开头
      const realIdx = idx - loopCount
      const realTop = realIdx * PICKER_LINE_HEIGHT
      scrollViewRef.current.scrollTop = realTop
      return
    }
    // 选中项回调
    const relativeHeight = PICKER_TOP - PICKER_LINE_HEIGHT * (idx - 4)
    updateHeight(relativeHeight, columnId)
    onColumnChange?.({ columnId, index: idx - 4 }) // 修改为传递 index
  }
  // 渲染选项
  const pickerItem = displayRange.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const isSelected = index === selectedIndex
    return (
      <View
        key={index}
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
    updateHeight,
    onColumnChange,
    start = '1970-01-01',
    end = '2999-12-31',
    fields = 'day',
    value = [1970, 1, 1],
    updateDay,
  } = props
  const PICKER_LINE_HEIGHT = 34
  const PICKER_TOP = 102

  // 解析起止日期
  const startDate = new Date(start)
  const endDate = new Date(end)
  // 当前选中年、月、日
  const [selectedYear, setSelectedYear] = React.useState(value[0] || startDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState(value[1] || 1)
  const [selectedDay, setSelectedDay] = React.useState(value[2] || 1)

  // 年、月、日范围
  const yearRange = getYearRange(startDate.getFullYear(), endDate.getFullYear())
  const monthRange = getMonthRange(startDate, endDate, selectedYear)
  const dayRange = getDayRange(startDate, endDate, selectedYear, selectedMonth)

  // 选中项 index
  const yearIndex = yearRange.indexOf(selectedYear)
  const monthIndex = monthRange.indexOf(selectedMonth)
  const dayIndex = dayRange.indexOf(selectedDay)

  // 滚动到选中项
  const yearScrollRef = React.useRef<any>(null)
  const monthScrollRef = React.useRef<any>(null)
  const dayScrollRef = React.useRef<any>(null)
  const yearItemRefs = React.useRef<any[]>([])
  const monthItemRefs = React.useRef<any[]>([])
  const dayItemRefs = React.useRef<any[]>([])

  // 滚动处理
  const handleYearScroll = () => {
    if (!yearScrollRef.current) return
    const scrollTop = yearScrollRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)
    const newYear = yearRange[idx] || yearRange[0]
    setSelectedYear(newYear)
    // 联动刷新月、日
    if (fields !== 'year') {
      setSelectedMonth(1)
      setSelectedDay(1)
    }
    updateDay?.(newYear, 0)
    updateHeight(PICKER_TOP - PICKER_LINE_HEIGHT * idx, '0')
    onColumnChange?.({ columnId: '0', index: idx }) // 修改为传递 index
  }
  const handleMonthScroll = () => {
    if (!monthScrollRef.current) return
    const scrollTop = monthScrollRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)
    const newMonth = monthRange[idx] || monthRange[0]
    setSelectedMonth(newMonth)
    // 联动刷新日
    if (fields === 'day') {
      setSelectedDay(1)
    }
    updateDay?.(newMonth, 1)
    updateHeight(PICKER_TOP - PICKER_LINE_HEIGHT * idx, '1')
    onColumnChange?.({ columnId: '1', index: idx }) // 修改为传递 index
  }
  const handleDayScroll = () => {
    if (!dayScrollRef.current) return
    const scrollTop = dayScrollRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)
    const newDay = dayRange[idx] || dayRange[0]
    setSelectedDay(newDay)
    updateDay?.(newDay, 2)
    updateHeight(PICKER_TOP - PICKER_LINE_HEIGHT * idx, '2')
    onColumnChange?.({ columnId: '2', index: idx }) // 修改为传递 index
  }

  // 渲染列
  const renderYear = (
    <ScrollView
      ref={yearScrollRef}
      scrollY
      className="taro-picker__content"
      style={{ height: PICKER_LINE_HEIGHT * 5 }}
      onScroll={handleYearScroll}
      scrollWithAnimation
    >
      {yearRange.map((item, idx) => (
        <View
          key={item}
          ref={(el) => (yearItemRefs.current[idx] = el)}
          className={`taro-picker__item${idx === yearIndex ? ' taro-picker__item--selected' : ''}`}
          style={{ height: PICKER_LINE_HEIGHT }}
        >
          {item}年
        </View>
      ))}
    </ScrollView>
  )
  const renderMonth = fields !== 'year' && (
    <ScrollView
      ref={monthScrollRef}
      scrollY
      className="taro-picker__content"
      style={{ height: PICKER_LINE_HEIGHT * 5 }}
      onScroll={handleMonthScroll}
      scrollWithAnimation
    >
      {monthRange.map((item, idx) => (
        <View
          key={item}
          ref={(el) => (monthItemRefs.current[idx] = el)}
          className={`taro-picker__item${idx === monthIndex ? ' taro-picker__item--selected' : ''}`}
          style={{ height: PICKER_LINE_HEIGHT }}
        >
          {item < 10 ? `0${item}` : item}月
        </View>
      ))}
    </ScrollView>
  )
  const renderDay = fields === 'day' && (
    <ScrollView
      ref={dayScrollRef}
      scrollY
      className="taro-picker__content"
      style={{ height: PICKER_LINE_HEIGHT * 5 }}
      onScroll={handleDayScroll}
      scrollWithAnimation
    >
      {dayRange.map((item, idx) => (
        <View
          key={item}
          ref={(el) => (dayItemRefs.current[idx] = el)}
          className={`taro-picker__item${idx === dayIndex ? ' taro-picker__item--selected' : ''}`}
          style={{ height: PICKER_LINE_HEIGHT }}
        >
          {item < 10 ? `0${item}` : item}日
        </View>
      ))}
    </ScrollView>
  )
  return (
    <View className="taro-picker__group taro-picker__group--date">
      <View className="taro-picker__mask" />
      <View className="taro-picker__indicator" />
      <View className="taro-picker__columns">
        {renderYear}
        {renderMonth}
        {renderDay}
      </View>
    </View>
  )
}

// 地区选择器骨架（后续补全）
export function PickerGroupRegion(props: PickerGroupProps) {
  const { range = [], rangeKey, height = 0, columnId, updateHeight, onColumnChange, customItem } = props
  const PICKER_LINE_HEIGHT = 34
  const PICKER_TOP = 102
  // 选中项 index
  const selectedIndex = Math.max(0, Math.round((PICKER_TOP - height) / PICKER_LINE_HEIGHT))
  const scrollViewRef = React.useRef<any>(null)
  const itemRefs = React.useRef<any[]>([])

  // 初始化滚动位置
  React.useEffect(() => {
    if (scrollViewRef.current && range.length > 0) {
      // 默认滚动到第一项
      const initialIndex = 0
      const initialScrollTop = initialIndex * PICKER_LINE_HEIGHT
      scrollViewRef.current.scrollTop = initialScrollTop

      // 更新高度
      const relativeHeight = PICKER_TOP - PICKER_LINE_HEIGHT * initialIndex
      updateHeight(relativeHeight, columnId, true) // 标记为初始更新
    }
  }, [range, columnId, updateHeight])

  const handleScroll = () => {
    if (!scrollViewRef.current) return
    const scrollTop = scrollViewRef.current.scrollTop
    const idx = Math.round(scrollTop / PICKER_LINE_HEIGHT)
    const relativeHeight = PICKER_TOP - PICKER_LINE_HEIGHT * idx
    updateHeight(relativeHeight, columnId)
    onColumnChange?.({ columnId, index: idx }) // 修改为传递 index
  }
  // 渲染选项
  const pickerItem = range.map((item, index) => {
    const content = rangeKey && item && typeof item === 'object' ? item[rangeKey] : item
    const isSelected = index === selectedIndex
    return (
      <View
        key={index}
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
