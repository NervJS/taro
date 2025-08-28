import './style/index.scss'

import { View } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'

import {
  compareTime,
  getDayRange,
  getMonthRange,
  getYearRange,
  hoursRange,
  minutesRange,
  omit,
  verifyDate,
  verifyTime,
  verifyValue
} from '../../utils'
import { PickerGroup } from './picker-group'

// 定义 RegionData 类型，与 Taro 官方保持一致
export interface RegionData {
  value: string
  code: string
  postcode?: string
  children?: RegionData[]
}

// 稳定的空数组引用，避免每次渲染都创建新引用
const EMPTY_ARRAY: any[] = []
const EMPTY_OBJECT: Record<string, any> = {}

// 语言映射函数
function getLanguageText(lang?: string) {
  const isEnglish = lang === 'en-US' || lang === 'en-GB'
  return {
    confirm: isEnglish ? 'Confirm' : '确定',
    cancel: isEnglish ? 'Cancel' : '取消',
    year: isEnglish ? 'Year ' : '年',
    month: isEnglish ? 'Month ' : '月',
    day: isEnglish ? 'Day ' : '日'
  }
}

// 数据验证函数
function validateRegionData(data: RegionData[], componentName = 'Picker'): { valid: boolean, error?: string } {
  if (!data) {
    return { valid: false, error: `${componentName}: regionData is required for region mode` }
  }

  if (!Array.isArray(data)) {
    return { valid: false, error: `${componentName}: regionData must be an array` }
  }

  if (data.length === 0) {
    return { valid: false, error: `${componentName}: regionData cannot be empty` }
  }

  // 检查数据结构
  const validateItem = (item: RegionData, path: string): { valid: boolean, error?: string } => {
    if (!item || typeof item !== 'object') {
      return { valid: false, error: `${componentName}: Invalid item at ${path}` }
    }

    if (!item.value || typeof item.value !== 'string') {
      return { valid: false, error: `${componentName}: Missing or invalid 'value' field at ${path}` }
    }

    if (!item.code || typeof item.code !== 'string') {
      return { valid: false, error: `${componentName}: Missing or invalid 'code' field at ${path}` }
    }

    if (item.postcode !== undefined && typeof item.postcode !== 'string') {
      return { valid: false, error: `${componentName}: Invalid 'postcode' field at ${path}` }
    }

    if (item.children && !Array.isArray(item.children)) {
      return { valid: false, error: `${componentName}: 'children' must be an array at ${path}` }
    }

    if (item.children) {
      for (let i = 0; i < item.children.length; i++) {
        const childResult = validateItem(item.children[i], `${path}.children[${i}]`)
        if (!childResult.valid) return childResult
      }
    }

    return { valid: true }
  }

  for (let i = 0; i < data.length; i++) {
    const result = validateItem(data[i], `regionData[${i}]`)
    if (!result.valid) return result
  }

  return { valid: true }
}

export type Mode = 'selector' | 'multiSelector' | 'time' | 'date' | 'region'
export type Fields = 'day' | 'month' | 'year'
export type RegionLevel = 'province' | 'city' | 'region'
export type PickerValue = number | number[] | string | string[]

export interface PickerText {
  okText?: string
  cancelText?: string
}

export interface PickerColors {
  confirmButtonColor?: string // 确定按钮颜色
  cancelButtonColor?: string // 取消按钮颜色
  itemDefaultColor?: string // 选项字体默认颜色
  itemSelectedColor?: string // 选项字体选中颜色
}

export interface PickerDate {
  _value: Date
  _start: Date
  _end: Date
  _updateValue: [number, number, number]
}

interface IProps {
  mode?: Mode
  disabled?: boolean
  range?: any[]
  rangeKey?: string
  value?: PickerValue
  start?: string
  end?: string
  fields?: Fields
  name?: string
  headerText?: string
  regionData?: RegionData[] // 省市区/县数据（region 模式专用）
  level?: RegionLevel
  textProps?: PickerText
  colors?: PickerColors // 颜色配置
  onChange?: (e: { detail: { value: PickerValue, code?: string, postcode?: string } }) => void
  onColumnChange?: (e: { detail: { column: number, value: number } }) => void
  onCancel?: () => void
  children?: React.ReactNode
  forwardedRef?: React.MutableRefObject<HTMLDivElement | null>
  formType?: string
  lang?: string // 语言参数，支持 'zh-CN'、'en-US'、'en-GB'
}

interface IState {
  pickerValue: PickerValue
  selectedIndices: number[] // 索引数组
  hidden: boolean
  fadeOut: boolean
  isWillLoadCalled: boolean
  timestamp: number
}

// 普通函数
function getRegionColumnsCount(level: RegionLevel): number {
  switch (level) {
    case 'province': return 1
    case 'city': return 2
    case 'region': return 3
    default: return 3 // 默认显示省市区/县三列
  }
}

// 暴露给外部的 ref 类型
export interface PickerRef {
  showPicker: () => void
  hidePicker: () => void
}

const Picker = React.forwardRef<PickerRef, IProps>((props, ref) => {
  const {
    mode = 'selector',
    disabled = false,
    range = EMPTY_ARRAY,
    rangeKey,
    value,
    start = '',
    end = '',
    fields = 'day',
    headerText,
    level = 'region',
    regionData,
    textProps = EMPTY_OBJECT,
    colors = EMPTY_OBJECT,
    onChange,
    onColumnChange,
    onCancel,
    children,
    formType,
    lang,
    ...restProps
  } = props
  const indexRef = React.useRef<number[]>([])
  const pickerDateRef = React.useRef<PickerDate>()
  // 记录是否是用户滚动
  const isInitializationCompletedRef = React.useRef(false)

  const [state, setState] = React.useState<IState>({
    pickerValue: value || EMPTY_ARRAY,
    selectedIndices: EMPTY_ARRAY.slice(), // 索引数组
    hidden: true,
    fadeOut: false,
    isWillLoadCalled: false,
    timestamp: 0 // 用以部分模式下强制刷新组件的的时间戳，多用于反复限位
  })

  // 在组件内部
  const [columnsCount, setColumnsCount] = React.useState(() => getRegionColumnsCount(level))

  // 只在level变化时更新列数
  React.useEffect(() => {
    setColumnsCount(getRegionColumnsCount(level))
  }, [level])

  // 获取当前索引数组
  const getIndices = React.useCallback(() => {
    return indexRef.current
  }, [])

  // 处理属性变化
  const handleProps = React.useCallback(() => {
    if (mode === 'selector') {
      const val = value as number
      indexRef.current = [verifyValue(val, range) ? Math.floor(val) : 0]
    } else if (mode === 'multiSelector') {
      const val = value as number[]
      indexRef.current = []
      range.forEach((rangeItem, index) => {
        const valItem = val?.[index]
        const item = verifyValue(valItem, rangeItem as any[]) ? Math.floor(valItem) : 0
        indexRef.current.push(item)
      })
    } else if (mode === 'time') {
      let val = value as string
      if (!verifyTime(val)) {
        console.warn('time picker value illegal')
        val = '0:0'
      }
      const time = val.split(':').map(n => +n)

      // 在 hoursRange 和 minutesRange 中找到对应的索引
      const hourIndex = hoursRange.findIndex(item => parseInt(item) === time[0])
      const minuteIndex = minutesRange.findIndex(item => parseInt(item) === time[1])

      // 确保索引在有效范围内
      const safeHourIndex = hourIndex >= 0 ? hourIndex : 0 // 默认为第一项
      const safeMinuteIndex = minuteIndex >= 0 ? minuteIndex : 0 // 默认为第一项

      indexRef.current = [
        Math.max(0, Math.min(safeHourIndex, hoursRange.length - 1)),
        Math.max(0, Math.min(safeMinuteIndex, minutesRange.length - 1))
      ]
    } else if (mode === 'date') {
      const val = value as string
      let _value = verifyDate(val) || new Date(new Date().setHours(0, 0, 0, 0))
      const _start = verifyDate(start) || new Date('1875/01/01')
      const _end = verifyDate(end) || new Date('2100/01/01')
      if (!(_start <= _end)) {
        throw new Error(`Picker start time must be less than end time.`)
      }
      if (!(_value >= _start && _value <= _end)) {
        _value = _start
      }
      const currentYear = _value.getFullYear()
      const currentMonth = _value.getMonth() + 1
      const currentDay = _value.getDate()
      const yearRange = getYearRange(_start.getFullYear(), _end.getFullYear())
      const monthRange = getMonthRange(_start, _end, currentYear)
      const dayRange = getDayRange(_start, _end, currentYear, currentMonth)
      indexRef.current = [
        yearRange.indexOf(currentYear),
        monthRange.indexOf(currentMonth),
        dayRange.indexOf(currentDay)
      ]
      if (
        !pickerDateRef.current ||
        pickerDateRef.current._value.getTime() !== _value.getTime() ||
        pickerDateRef.current._start.getTime() !== _start.getTime() ||
        pickerDateRef.current._end.getTime() !== _end.getTime()
      ) {
        pickerDateRef.current = {
          _value,
          _start,
          _end,
          _updateValue: [currentYear, currentMonth, currentDay]
        }
      }
    } else if (mode === 'region') {
      // region 模式处理 - 验证数据
      if (!regionData) {
        console.error('Picker: regionData is required for region mode')
        indexRef.current = [0]
        return
      }

      const validation = validateRegionData(regionData, 'Picker')
      if (!validation.valid) {
        console.error(validation.error)
        indexRef.current = [0]
        return
      }

      // 获取列数
      const val = Array.isArray(value) ? value : []

      // 根据level和当前值确定索引
      indexRef.current = []
      let currentData = regionData

      for (let i = 0; i < columnsCount; i++) {
        if (!currentData?.length) {
          indexRef.current.push(0)
          continue
        }
        let idx = 0
        if (typeof val[i] === 'number') {
          const rawIdx = val[i] as number
          idx = (rawIdx >= 0 && rawIdx < currentData.length) ? rawIdx : 0
        } else if (typeof val[i] === 'string') {
          const parsed = parseInt(val[i] as string, 10)
          idx = (parsed >= 0 && parsed < currentData.length) ? parsed : 0
        }
        indexRef.current.push(idx)
        currentData = currentData[idx]?.children || []
      }
    } else {
      throw new Error(`Picker not support "${mode}" mode.`)
    }

    // 更新索引值
    const newIndices = getIndices()
    setState(prev => ({
      ...prev,
      selectedIndices: newIndices,
      pickerValue: value || EMPTY_ARRAY
    }))
  }, [mode, range, value, start, end, fields, regionData, level, columnsCount, getIndices])

  // 组件初始化
  React.useEffect(() => {
    setState(prev => ({ ...prev, isWillLoadCalled: true }))
    handleProps()
  }, [])

  // 属性变化监听 - 添加 value 依赖以支持联动选择器
  React.useEffect(() => {
    if (state.isWillLoadCalled) {
      handleProps()
    }
  }, [handleProps, state.isWillLoadCalled, JSON.stringify(value)])

  // 显示 Picker
  const showPicker = React.useCallback(() => {
    if (disabled) return
    isInitializationCompletedRef.current = false
    const newIndices = getIndices()
    setState(prev => ({
      ...prev,
      selectedIndices: newIndices,
      hidden: false
    }))
  }, [disabled, getIndices])

  // 隐藏 Picker
  const hidePicker = React.useCallback(() => {
    isInitializationCompletedRef.current = false
    // 动画暂时不支持，暂时屏蔽相关样式挂载逻辑
    // setState(prev => ({ ...prev, fadeOut: true }))
    // setTimeout(() => {
    //   setState(prev => ({
    //     ...prev,
    //     hidden: true,
    //     fadeOut: false
    //   }))
    // }, 350)
    setState(prev => ({ ...prev, hidden: true }))
  }, [])

  // 更新索引
  const updateIndex = React.useCallback((index: number, columnId: string, needRevise: boolean = false, isUserScrollRef: boolean = false) => {
    const columnIndex = Number(columnId)
    let finalIndices = [...state.selectedIndices]
    finalIndices[columnIndex] = index
    let hasLimited = false

    // region 模式的级联更新逻辑
    if (mode === 'region' && regionData) {
      if (isUserScrollRef && !isInitializationCompletedRef.current) {
        isInitializationCompletedRef.current = true
      }
      if (!isInitializationCompletedRef.current) {
        return
      }
      // 重置后续列
      for (let i = columnIndex + 1; i < columnsCount; i++) {
        finalIndices[i] = 0
      }
      setState(prev => ({
        ...prev,
        selectedIndices: finalIndices,
      }))
      return // 直接返回
    }

    // time picker
    if (needRevise && mode === 'time') {
      let startTime = start
      let endTime = end

      if (!verifyTime(startTime)) startTime = '00:00'
      if (!verifyTime(endTime)) endTime = '23:59'
      if (!compareTime(startTime, endTime)) return false

      const timeRanges = [hoursRange.slice(), minutesRange.slice()]
      // 然后基于更新后的索引数组计算时间
      const timeStr = finalIndices.map((idx, i) => {
        const rangeIdx = Math.max(0, Math.min(idx, timeRanges[i].length - 1))
        return timeRanges[i][rangeIdx] || '00'
      }).join(':')

      // 检查是否需要限位
      if (!compareTime(startTime, timeStr)) {
        // 修正到 start
        const startParts = startTime.split(':').map(part => parseInt(part))
        const newIndices = startParts.map((time, i) => {
          const idx = timeRanges[i].findIndex(item => parseInt(item) === time)
          return idx >= 0 ? idx : 0
        })

        finalIndices = [...newIndices]
        hasLimited = true
      } else if (!compareTime(timeStr, endTime)) {
        // 修正到 end
        const endParts = endTime.split(':').map(part => parseInt(part))
        const newIndices = endParts.map((time, i) => {
          const idx = timeRanges[i].findIndex(item => parseInt(item) === time)
          return idx >= 0 ? idx : 0
        })

        finalIndices = [...newIndices]
        hasLimited = true
      }

      // 触发限位，更新状态，其它状态不用主动触发滚动
      if (hasLimited) {
        setState(prev => ({
          ...prev,
          selectedIndices: finalIndices,
          timestamp: Date.now()
        }))
      } else {
        setState(prev => ({
          ...prev,
          selectedIndices: finalIndices,
        }))
      }

      return hasLimited
    }

    // 常规更新
    finalIndices[columnIndex] = index
    setState(prev => ({
      ...prev,
      selectedIndices: finalIndices,
    }))

    return false // 没有限位
  }, [start, end, mode, regionData, state.selectedIndices, columnsCount])

  // 更新日期
  const updateDay = React.useCallback((value: number, fields: number) => {
    if (!pickerDateRef.current) return

    const { _start, _end, _updateValue } = pickerDateRef.current

    // 更新当前字段的值
    _updateValue[fields] = value

    // 获取当前年月日
    const currentYear = _updateValue[0]
    const currentMonth = _updateValue[1]
    const currentDay = _updateValue[2]

    // 保存原始值用于后面比较
    const originalValues = [..._updateValue]

    // 准备最终的索引数组 - 复制当前索引状态作为起点
    const finalIndices = [...state.selectedIndices]

    // 获取基础范围数据
    const yearRange = getYearRange(_start.getFullYear(), _end.getFullYear())
    const monthRange = getMonthRange(_start, _end, currentYear)
    let dayRange = getDayRange(_start, _end, currentYear, currentMonth)

    // 根据修改的字段进行不同处理
    if (fields === 0) {
      // 年份索引直接更新
      finalIndices[0] = yearRange.indexOf(currentYear)

      // 月份限位处理
      if (monthRange.length > 0) {
        if (currentMonth > monthRange[monthRange.length - 1]) {
          _updateValue[1] = monthRange[monthRange.length - 1]
        }
        if (currentMonth < monthRange[0]) {
          _updateValue[1] = monthRange[0]
        }

        // 更新月份索引
        finalIndices[1] = monthRange.indexOf(_updateValue[1])

        // 重新计算日期范围
        dayRange = getDayRange(_start, _end, currentYear, _updateValue[1])

        // 日期限位处理
        if (dayRange.length > 0) {
          if (currentDay > dayRange[dayRange.length - 1]) {
            _updateValue[2] = dayRange[dayRange.length - 1]
          }
          if (currentDay < dayRange[0]) {
            _updateValue[2] = dayRange[0]
          }

          // 更新日期索引
          finalIndices[2] = dayRange.indexOf(_updateValue[2])
        }
      }
    } else if (fields === 1) { // 月份变化
      // 月份索引直接更新
      finalIndices[1] = monthRange.indexOf(currentMonth)

      // 日期限位处理
      if (dayRange.length > 0) {
        if (currentDay > dayRange[dayRange.length - 1]) {
          _updateValue[2] = dayRange[dayRange.length - 1]
        }
        if (currentDay < dayRange[0]) {
          _updateValue[2] = dayRange[0]
        }

        // 更新日期索引
        finalIndices[2] = dayRange.indexOf(_updateValue[2])
      }
    } else if (fields === 2) { // 日期变化
      // 日期索引直接更新
      finalIndices[2] = dayRange.indexOf(currentDay)
    }

    // 只在有实际变化时更新状态
    if (
      JSON.stringify(originalValues) !== JSON.stringify(_updateValue) ||
      JSON.stringify(finalIndices) !== JSON.stringify(state.selectedIndices)
    ) {
      // 一次性更新状态
      setState(prev => ({
        ...prev,
        selectedIndices: finalIndices,
      }))
    }
  }, [state.selectedIndices])

  // 处理确认
  const handleChange = React.useCallback(() => {
    const newIndices = [...state.selectedIndices]
    indexRef.current = newIndices

    let newValue: PickerValue = newIndices.length && mode !== 'selector'
      ? newIndices
      : newIndices[0]

    if (mode === 'time') {
      const range = [hoursRange.slice(), minutesRange.slice()]

      // 安全的时间处理，添加边界检查
      const timeArr = newIndices.map<string>((idx, i) => {
        const index = Math.max(0, Math.min(idx, range[i].length - 1))
        return range[i][index] || (i === 0 ? '00' : '00')
      })

      // 确保时间值有效
      const validTimeArr = timeArr.map(time => {
        const num = parseInt(time)
        return isNaN(num) ? '00' : time
      })

      indexRef.current = validTimeArr.map(item => parseInt(item))
      newValue = validTimeArr.join(':')
    }

    if (mode === 'date') {
      if (!pickerDateRef.current) return

      const { _start, _end, _updateValue } = pickerDateRef.current
      const currentYear = _updateValue[0]
      const currentMonth = _updateValue[1]
      const yearRange = getYearRange(_start.getFullYear(), _end.getFullYear())
      const monthRange = getMonthRange(_start, _end, currentYear)
      const dayRange = getDayRange(_start, _end, currentYear, currentMonth)

      // 添加边界检查，确保索引有效
      const yearIndex = Math.min(Math.max(Math.floor(newIndices[0]), 0), yearRange.length - 1)
      const monthIndex = Math.min(Math.max(Math.floor(newIndices[1]), 0), monthRange.length - 1)
      const dayIndex = Math.min(Math.max(Math.floor(newIndices[2]), 0), dayRange.length - 1)

      const year = yearRange[yearIndex]
      const month = monthRange[monthIndex]
      const day = dayRange[dayIndex]

      // 确保所有值都存在
      if (year === undefined || month === undefined || day === undefined) {
        console.warn('Date picker: invalid date values', { year, month, day })
        return
      }

      if (fields === 'year') {
        newValue = year.toString()
      } else if (fields === 'month') {
        // YYYY-MM 格式
        newValue = `${year}-${month < 10 ? `0${month}` : month}`
      } else {
        // YYYY-MM-DD 格式
        newValue = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
      }

      hidePicker()
      setState(prev => ({
        ...prev,
        pickerValue: newValue
      }))

      onChange?.({ detail: { value: newValue } })
      return
    }

    if (mode === 'region') {
      if (!regionData) {
        console.error('Picker: regionData is required for region mode')
        return
      }

      const validation = validateRegionData(regionData, 'Picker')
      if (!validation.valid) {
        console.error(validation.error)
        return
      }

      // 直接使用索引数组
      const selectedCodes: string[] = []
      let postcode = ''

      // 安全获取选中值
      let currentData = regionData
      for (let i = 0; i < columnsCount; i++) {
        if (!currentData || currentData.length === 0) break

        const index = newIndices[i] || 0
        if (index < 0 || index >= currentData.length) break

        const item = currentData[index]
        selectedCodes.push(item.code)

        // 如果是最后一项，获取邮政编码
        if (i === columnsCount - 1 && item.postcode) {
          postcode = item.postcode
        }

        // 准备下一级数据
        currentData = item.children || []
      }

      // 检查索引数组长度是否符合要求
      if (newIndices.length < columnsCount) {
        console.warn('Region picker: incomplete selection')
        return
      }

      // 触发 onChange 事件，包含 code 信息
      hidePicker()
      setState(prev => ({
        ...prev,
        pickerValue: newIndices
      }))

      onChange?.({
        detail: {
          value: newIndices,
          code: selectedCodes.join(','),
          postcode
        }
      })
      return
    }

    hidePicker()
    setState(prev => ({
      ...prev,
      pickerValue: newValue
    }))

    // 触发 onChange 事件，格式与原始组件一致
    onChange?.({ detail: { value: newValue } })
  }, [hidePicker, state.selectedIndices, mode, fields, onChange, regionData, columnsCount])

  // 处理列变化
  const handleColumnChange = React.useCallback((e: { columnId: string, index: number }) => {
    const { columnId, index } = e
    onColumnChange?.({
      detail: {
        column: Number(columnId),
        value: index
      }
    })
  }, [onColumnChange])

  // 处理取消
  const handleCancel = React.useCallback(() => {
    hidePicker()
    onCancel?.()
  }, [hidePicker, onCancel])

  // 渲染选择器组
  const renderPickerGroup = React.useMemo(() => {
    switch (mode) {
      case 'multiSelector': {
        return range.map((rangeItem, index) => (
          <PickerGroup
            key={index}
            range={rangeItem}
            rangeKey={rangeKey}
            updateIndex={updateIndex}
            onColumnChange={handleColumnChange}
            columnId={String(index)}
            selectedIndex={state.selectedIndices[index]} // 传递对应列的selectedIndex
            colors={colors}
          />
        ))
      }
      case 'time': {
        return [
          <PickerGroup
            key={`hour-${state.timestamp}`}
            mode="time"
            range={hoursRange}
            updateIndex={updateIndex}
            columnId="0"
            selectedIndex={state.selectedIndices[0]} // 传递小时列的selectedIndex
            colors={colors}
          />,
          <PickerGroup
            key={`minute-${state.timestamp}`}
            mode="time"
            range={minutesRange}
            updateIndex={updateIndex}
            columnId="1"
            selectedIndex={state.selectedIndices[1]} // 传递分钟列的selectedIndex
            colors={colors}
          />
        ]
      }
      case 'date': {
        if (!pickerDateRef.current) return null

        const { _start, _end, _updateValue } = pickerDateRef.current
        const currentYear = _updateValue[0]
        const currentMonth = _updateValue[1]

        const langText = getLanguageText(lang)
        const isEnglish = lang === 'en-US' || lang === 'en-GB'
        const yearRange = getYearRange(_start.getFullYear(), _end.getFullYear())
          .map(item => isEnglish ? `${langText.year}${item}` : `${item}${langText.year}`)
        const monthRange = getMonthRange(_start, _end, currentYear)
          .map(item => isEnglish ? `${langText.month}${item < 10 ? `0${item}` : item}` : `${item < 10 ? `0${item}` : item}${langText.month}`)
        const dayRange = getDayRange(_start, _end, currentYear, currentMonth)
          .map(item => isEnglish ? `${langText.day}${item < 10 ? `0${item}` : item}` : `${item < 10 ? `0${item}` : item}${langText.day}`)

        const renderView = [
          <PickerGroup
            key={`year`}
            mode="date"
            range={yearRange}
            updateDay={updateDay}
            updateIndex={updateIndex}
            columnId="0"
            selectedIndex={state.selectedIndices[0]} // 传递年份列的selectedIndex
            colors={colors}
          />
        ]
        if (fields === 'month' || fields === 'day') {
          renderView.push(
            <PickerGroup
              key={`month`}
              mode="date"
              range={monthRange}
              updateDay={updateDay}
              updateIndex={updateIndex}
              columnId="1"
              selectedIndex={state.selectedIndices[1]} // 传递月份列的selectedIndex
              colors={colors}
            />
          )
        }
        if (fields === 'day') {
          renderView.push(
            <PickerGroup
              key={`day`}
              mode="date"
              range={dayRange}
              updateDay={updateDay}
              updateIndex={updateIndex}
              columnId="2"
              selectedIndex={state.selectedIndices[2]} // 传递日期列的selectedIndex
              colors={colors}
            />
          )
        }
        return renderView
      }
      case 'region': {
        // region 模式处理 - 自动识别数据层级
        if (!regionData) {
          console.error('Picker: regionData is required for region mode')
          return null
        }

        // 简化验证逻辑
        if (!validateRegionData(regionData, 'Picker').valid) {
          return null
        }

        const columns: JSX.Element[] = []
        let currentData = regionData

        for (let i = 0; i < columnsCount; i++) {
          if (i > 0 && currentData?.length) {
            // 获取上一级选中项的children作为当前列数据
            const prevIndex = state.selectedIndices[i - 1] || 0
            if (prevIndex >= 0 && prevIndex < currentData.length) {
              currentData = currentData[prevIndex].children || []
            } else {
              currentData = []
            }
          }

          columns.push(
            <PickerGroup
              key={`region-${i}`}
              mode="region"
              range={currentData}
              rangeKey="value"
              updateIndex={updateIndex}
              columnId={String(i)}
              selectedIndex={state.selectedIndices[i]}
              colors={colors}
            />
          )
        }

        return columns
      }
      default:
        return (
          <PickerGroup
            range={range}
            rangeKey={rangeKey}
            updateIndex={updateIndex}
            columnId="0"
            selectedIndex={state.selectedIndices[0]} // 传递selector模式的selectedIndex
            colors={colors}
          />
        )
    }
  }, [mode, range, rangeKey, fields, updateIndex, updateDay, handleColumnChange, pickerDateRef.current, level, regionData, state.selectedIndices, columnsCount, lang, colors])

  // 动画类名控制逻辑
  const clsMask = classNames('taro-picker__mask-overlay', 'taro-picker__animate-fade-in', {
    'taro-picker__animate-fade-out': state.fadeOut
  })
  const clsSlider = classNames('taro-picker', 'taro-picker__animate-slide-up', {
    'taro-picker__animate-slide-down': state.fadeOut
  })

  // 暴露方法给外部
  React.useImperativeHandle(ref, () => ({
    showPicker,
    hidePicker
  }))

  // 获取语言文本
  const langText = getLanguageText(lang)

  return (
    <View
      ref={ref as any} // 直接绑定 ref
      {...(formType ? { 'data-form-type': formType } : {})}
      {...omit(restProps, ['mode', 'disabled', 'range', 'rangeKey', 'value', 'start', 'end', 'fields', 'name', 'textProps', 'onChange', 'onColumnChange', 'onCancel', 'children', 'formType'])}
    >
      <View onClick={showPicker}>
        {children}
      </View>
      {!state.hidden && (
        <View className="taro-picker__overlay">
          <View className={clsMask} onClick={handleCancel} />
          <View className={clsSlider}>
            <View className="taro-picker__hd">
              <View
                className="taro-picker__action"
                onClick={handleCancel}
                style={{ color: colors.cancelButtonColor }}
              >
                {textProps.cancelText ?? langText.cancel}
              </View>
              {headerText && (
                <View className="taro-picker__title">{headerText}</View>
              )}
              <View
                className="taro-picker__action"
                onClick={handleChange}
                style={{ color: colors.confirmButtonColor }}
              >
                {textProps.okText ?? langText.confirm}
              </View>
            </View>
            <View className="taro-picker__bd">{renderPickerGroup}</View>
          </View>
        </View>
      )}
    </View>
  )
})

Picker.displayName = 'Picker'
export default Picker
