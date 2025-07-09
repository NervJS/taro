import './style/index.scss'

import { View } from '@tarojs/components'
import classNames from 'classnames'
import * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'

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

// 数据层级检测函数
function detectDataLevel(data: RegionData[]): number {
  if (!data || data.length === 0) return 0

  let maxLevel = 1
  const traverse = (item: RegionData, level: number) => {
    if (level > maxLevel) maxLevel = level
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      item.children.forEach(child => traverse(child, level + 1))
    }
  }

  data.forEach(item => traverse(item, 1))
  return maxLevel
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

// 辅助函数：获取省市区某列的数据
function getRegionColumnData(
  data: RegionData[],
  columnIndex: number,
  selectedValues: string[] = [],
  dataLevel: number
): RegionData[] {
  if (!data || data.length === 0) return []

  // 根据数据层级和列索引获取对应数据
  if (dataLevel === 3) {
    // 三级数据：省→市→区
    if (columnIndex === 0) {
      return data // 省份数据
    } else if (columnIndex === 1) {
      const selectedProvince = selectedValues[0]
      const province = data.find(item => item.value === selectedProvince)
      return province?.children || [] // 市数据
    } else if (columnIndex === 2) {
      const selectedProvince = selectedValues[0]
      const selectedCity = selectedValues[1]
      const province = data.find(item => item.value === selectedProvince)
      const city = province?.children?.find(item => item.value === selectedCity)
      return city?.children || [] // 区数据
    }
  } else if (dataLevel === 4) {
    // 四级数据：国家→省→市→区
    if (columnIndex === 0) {
      return data // 国家数据
    } else if (columnIndex === 1) {
      const selectedCountry = selectedValues[0]
      const country = data.find(item => item.value === selectedCountry)
      return country?.children || [] // 省份数据
    } else if (columnIndex === 2) {
      const selectedCountry = selectedValues[0]
      const selectedProvince = selectedValues[1]
      const country = data.find(item => item.value === selectedCountry)
      const province = country?.children?.find(item => item.value === selectedProvince)
      return province?.children || [] // 市数据
    } else if (columnIndex === 3) {
      const selectedCountry = selectedValues[0]
      const selectedProvince = selectedValues[1]
      const selectedCity = selectedValues[2]
      const country = data.find(item => item.value === selectedCountry)
      const province = country?.children?.find(item => item.value === selectedProvince)
      const city = province?.children?.find(item => item.value === selectedCity)
      return city?.children || [] // 区数据
    }
  }

  return []
}

export type Mode = 'selector' | 'multiSelector' | 'time' | 'date' | 'region'
export type Fields = 'day' | 'month' | 'year'
export type RegionLevel = 'province' | 'city' | 'region' | 'sub-district' | 'country'
export type PickerValue = number | number[] | string | string[]

export interface PickerText {
  okText?: string
  cancelText?: string
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
  regionData?: RegionData[] // 省市区数据（region 模式专用，支持三级或四级数据）
  level?: RegionLevel
  textProps?: PickerText
  onChange?: (e: { detail: { value: PickerValue, code?: string, postcode?: string } }) => void
  onColumnChange?: (e: { detail: { column: number, value: number } }) => void
  onCancel?: () => void
  children?: React.ReactNode
  style?: React.CSSProperties
  forwardedRef?: React.MutableRefObject<HTMLDivElement | null>
  formType?: string
}

interface IState {
  pickerValue: PickerValue
  selectedIndices: number[] // 索引数组
  hidden: boolean
  fadeOut: boolean
  isWillLoadCalled: boolean
}

export function Picker(props: IProps) {
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
    level,
    regionData,
    textProps = EMPTY_OBJECT,
    onChange,
    onColumnChange,
    onCancel,
    children,
    style,
    forwardedRef,
    formType,
    ...restProps
  } = props
  const indexRef = React.useRef<number[]>([])
  const pickerDateRef = React.useRef<PickerDate>()

  const [state, setState] = React.useState<IState>({
    pickerValue: value || EMPTY_ARRAY,
    selectedIndices: EMPTY_ARRAY.slice(), // 索引数组
    hidden: true,
    fadeOut: false,
    isWillLoadCalled: false
  })

  // 获取当前索引数组
  const getIndices = useCallback(() => {
    return indexRef.current
  }, [])

  // 处理属性变化
  const handleProps = useCallback(() => {
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

      // 确保索引在有效范围内，并考虑补帧偏移（前4个是补帧）
      const safeHourIndex = hourIndex >= 0 ? hourIndex + 4 : 4 // 对应 '00'
      const safeMinuteIndex = minuteIndex >= 0 ? minuteIndex + 4 : 4 // 对应 '00'

      indexRef.current = [
        Math.max(0, Math.min(safeHourIndex, hoursRange.length + 3)), // +3 因为有前后补帧
        Math.max(0, Math.min(safeMinuteIndex, minutesRange.length + 3))
      ]
    } else if (mode === 'date') {
      const val = value as string
      let _value = verifyDate(val) || new Date(new Date().setHours(0, 0, 0, 0))
      const _start = verifyDate(start) || new Date('1970/01/01')
      const _end = verifyDate(end) || new Date('2999/01/01')
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
      // region 模式处理 - 验证数据并自动识别层级
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

      const dataLevel = detectDataLevel(regionData)
      const val = Array.isArray(value) ? (value as unknown as string[]) : []

      // 根据数据层级确定索引
      const maxColumns = dataLevel === 4 ? 4 : 3
      indexRef.current = val.length > 0 ? val.map((item, index) => {
        if (index >= maxColumns) return 0
        const columnData = getRegionColumnData(regionData, index, val.slice(0, index), dataLevel)
        const itemIndex = columnData.findIndex(dataItem => dataItem.value === item)
        return itemIndex >= 0 ? itemIndex : 0
      }) : new Array(maxColumns).fill(0)
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
  }, [mode, range, value, start, end, fields, regionData, getIndices])

  // 组件初始化
  useEffect(() => {
    setState(prev => ({ ...prev, isWillLoadCalled: true }))
    handleProps()
  }, [])

  // 属性变化监听 - 添加 value 依赖以支持联动选择器
  useEffect(() => {
    if (state.isWillLoadCalled) {
      handleProps()
    }
  }, [handleProps, state.isWillLoadCalled, value])

  // 显示 Picker
  const showPicker = useCallback(() => {
    if (disabled) return
    const newIndices = getIndices()
    setState(prev => ({
      ...prev,
      selectedIndices: newIndices,
      hidden: false
    }))
  }, [disabled, getIndices])

  // 隐藏 Picker
  const hidePicker = useCallback(() => {
    setState(prev => ({ ...prev, fadeOut: true }))
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        hidden: true,
        fadeOut: false
      }))
    }, 350)
  }, [])

  // 更新索引
  const updateIndex = React.useCallback((index: number, columnId: string, needRevise = false) => {
    const columnIndex = Number(columnId)

    setState(prev => {
      const newIndices = [...prev.selectedIndices]
      newIndices[columnIndex] = index
      return { ...prev, selectedIndices: newIndices }
    })

    // region 模式的级联更新逻辑
    if (mode === 'region' && regionData) {
      const dataLevel = detectDataLevel(regionData)
      const maxColumns = dataLevel === 4 ? 4 : 3

      // 当某一列发生变化时，重置后续列为第一个选项
      setState(prev => {
        const newIndices = [...prev.selectedIndices]
        newIndices[columnIndex] = index

        // 重置后续列到第一个选项（索引0）
        for (let i = columnIndex + 1; i < maxColumns; i++) {
          newIndices[i] = 0
        }

        return { ...prev, selectedIndices: newIndices }
      })
      return
    }

    // time picker 必须在规定时间范围内，因此需要在 touchEnd 做修正
    if (needRevise && mode === 'time') {
      let startTime = start
      let endTime = end

      if (!verifyTime(startTime)) startTime = '00:00'
      if (!verifyTime(endTime)) endTime = '23:59'
      if (!compareTime(startTime, endTime)) return

      const timeRanges = [hoursRange.slice(), minutesRange.slice()]

      // 使用当前最新的状态计算
      setState(prev => {
        const currentIndices = [...prev.selectedIndices]

        // 根据索引获取时间
        const timeStr = currentIndices.map((idx, i) => {
          const rangeIdx = Math.max(0, Math.min(idx, timeRanges[i].length - 1))
          return timeRanges[i][rangeIdx] || '00'
        }).join(':')

        if (!compareTime(startTime, timeStr)) {
          // 修正到 start
          const startParts = startTime.split(':').map(part => parseInt(part))
          const newIndices = startParts.map((time, i) => {
            // 在 range 中找到对应时间的索引
            const idx = timeRanges[i].findIndex(item => parseInt(item) === time)
            return idx >= 0 ? idx : 4 // 默认使用索引 4
          })
          return { ...prev, selectedIndices: newIndices }
        } else if (!compareTime(timeStr, endTime)) {
          // 修正到 end
          const endParts = endTime.split(':').map(part => parseInt(part))
          const newIndices = endParts.map((time, i) => {
            // 在 range 中找到对应时间的索引
            const idx = timeRanges[i].findIndex(item => parseInt(item) === time)
            return idx >= 0 ? idx : 4 // 默认使用索引 4
          })
          return { ...prev, selectedIndices: newIndices }
        }

        return { ...prev, selectedIndices: currentIndices }
      })
    }
  }, [start, end, mode, regionData])

  // 更新日期
  const updateDay = useCallback((value: number, fields: number) => {
    if (!pickerDateRef.current) return

    const { _start, _end, _updateValue } = pickerDateRef.current

    _updateValue[fields] = value

    const currentYear = _updateValue[0]
    const currentMonth = _updateValue[1]
    const currentDay = _updateValue[2]

    // 滚动年份
    if (fields === 0) {
      const monthRange = getMonthRange(_start, _end, currentYear)
      if (monthRange.length === 0) return // 防止空范围

      const max = monthRange[monthRange.length - 1]
      const min = monthRange[0]

      if (currentMonth > max) _updateValue[1] = max
      if (currentMonth < min) _updateValue[1] = min

      const monthIndex = monthRange.indexOf(_updateValue[1])
      if (monthIndex >= 0) {
        updateIndex(monthIndex, '1')

        // 检查并更新日范围
        const dayRange = getDayRange(_start, _end, currentYear, _updateValue[1])
        if (dayRange.length > 0) {
          const dayMax = dayRange[dayRange.length - 1]
          const dayMin = dayRange[0]

          if (currentDay > dayMax) _updateValue[2] = dayMax
          if (currentDay < dayMin) _updateValue[2] = dayMin

          const dayIndex = dayRange.indexOf(_updateValue[2])
          if (dayIndex >= 0) {
            updateIndex(dayIndex, '2')
          }
        }
      }
    } else if (fields === 1) {
      const dayRange = getDayRange(_start, _end, currentYear, currentMonth)
      if (dayRange.length === 0) return // 防止空范围

      const max = dayRange[dayRange.length - 1]
      const min = dayRange[0]

      if (currentDay > max) _updateValue[2] = max
      if (currentDay < min) _updateValue[2] = min

      const dayIndex = dayRange.indexOf(_updateValue[2])
      if (dayIndex >= 0) {
        updateIndex(dayIndex, '2')
      }
    }
  }, [updateIndex])

  // 处理确认
  const handleChange = useCallback(() => {
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
        newValue = [year]
      } else if (fields === 'month') {
        newValue = [year, month]
      } else {
        newValue = [year, month, day]
      }

      // 安全的字符串转换
      newValue = newValue
        .filter(item => item !== undefined && item !== null) // 过滤无效值
        .map(item => {
          const num = Number(item)
          return num < 10 ? `0${num}` : String(num)
        })
        .join('-')
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

      const dataLevel = detectDataLevel(regionData)
      const selectedValues: string[] = []
      const selectedCodes: string[] = []
      const maxColumns = dataLevel === 4 ? 4 : 3

      // 确定实际显示的列数
      let displayColumns = maxColumns
      if (dataLevel === 3) {
        displayColumns = level === 'province' ? 1 : level === 'city' ? 2 : 3
      } else if (dataLevel === 4) {
        displayColumns = level === 'country' ? 1 : level === 'province' ? 2 : level === 'city' ? 3 : 4
      }

      // 安全获取选中值，确保级联的正确性
      for (let i = 0; i < Math.min(newIndices.length, displayColumns); i++) {
        const columnData = getRegionColumnData(regionData, i, selectedValues, dataLevel)
        const selectedIndex = Math.floor(newIndices[i])

        // 确保索引在有效范围内
        if (columnData.length > 0 && selectedIndex >= 0 && selectedIndex < columnData.length) {
          selectedValues.push(columnData[selectedIndex].value || '')
          selectedCodes.push(columnData[selectedIndex].code || '')
        } else {
          // 如果索引无效，使用第一个选项，但不添加到 selectedValues
          break
        }
      }

      // 检查是否所有需要的列都有值
      if (selectedValues.length < displayColumns) {
        alert('Please complete all items')
        return
      }

      newValue = selectedValues

      // 触发 onChange 事件，包含 code 信息
      hidePicker()
      setState(prev => ({
        ...prev,
        pickerValue: newValue
      }))

      onChange?.({
        detail: {
          value: newValue,
          code: selectedCodes.join(','),
          postcode: '' // 可以根据需要从最后一级获取邮政编码
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
  }, [hidePicker, state.selectedIndices, mode, fields, onChange, regionData, level])

  // 处理列变化
  const handleColumnChange = useCallback((e: { columnId: string, index: number }) => {
    const { columnId, index } = e
    onColumnChange?.({
      detail: {
        column: Number(columnId),
        value: index
      }
    })
  }, [onColumnChange])

  // 处理取消
  const handleCancel = useCallback(() => {
    hidePicker()
    onCancel?.()
  }, [hidePicker, onCancel])

  // 渲染选择器组
  const renderPickerGroup = useMemo(() => {
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
          />
        ))
      }
      case 'time': {
        const hourRange = hoursRange.slice()
        const minRange = minutesRange.slice()
        return [
          <PickerGroup
            key="hour"
            mode="time"
            range={hourRange}
            updateIndex={updateIndex}
            columnId="0"
          />,
          <PickerGroup
            key="minute"
            mode="time"
            range={minRange}
            updateIndex={updateIndex}
            columnId="1"
          />
        ]
      }
      case 'date': {
        if (!pickerDateRef.current) return null

        const { _start, _end, _updateValue } = pickerDateRef.current
        const currentYear = _updateValue[0]
        const currentMonth = _updateValue[1]

        const yearRange = getYearRange(_start.getFullYear(), _end.getFullYear())
          .map(item => `${item}年`)
        const monthRange = getMonthRange(_start, _end, currentYear)
          .map(item => `${item < 10 ? `0${item}` : item}月`)
        const dayRange = getDayRange(_start, _end, currentYear, currentMonth)
          .map(item => `${item < 10 ? `0${item}` : item}日`)

        const renderView = [
          <PickerGroup
            key="year"
            mode="date"
            range={yearRange}
            updateDay={updateDay}
            updateIndex={updateIndex}
            columnId="0"
          />
        ]
        if (fields === 'month' || fields === 'day') {
          renderView.push(
            <PickerGroup
              key="month"
              mode="date"
              range={monthRange}
              updateDay={updateDay}
              updateIndex={updateIndex}
              columnId="1"
            />
          )
        }
        if (fields === 'day') {
          renderView.push(
            <PickerGroup
              key="day"
              mode="date"
              range={dayRange}
              updateDay={updateDay}
              updateIndex={updateIndex}
              columnId="2"
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

        const validation = validateRegionData(regionData, 'Picker')
        if (!validation.valid) {
          console.error(validation.error)
          return null
        }

        const dataLevel = detectDataLevel(regionData)

        // 从当前状态获取选中值
        const selectedIndices = state.selectedIndices
        const selectedValues: string[] = []
        const maxColumns = dataLevel === 4 ? 4 : 3

        // 确定实际显示的列数
        let displayColumns = maxColumns
        if (dataLevel === 3) {
          displayColumns = level === 'province' ? 1 : level === 'city' ? 2 : 3
        } else if (dataLevel === 4) {
          displayColumns = level === 'country' ? 1 : level === 'province' ? 2 : level === 'city' ? 3 : 4
        }

        // 安全获取选中值，确保级联的正确性
        for (let i = 0; i < Math.min(selectedIndices.length, displayColumns); i++) {
          const columnData = getRegionColumnData(regionData, i, selectedValues, dataLevel)
          const selectedIndex = selectedIndices[i]

          // 确保索引在有效范围内
          if (columnData.length > 0 && selectedIndex >= 0 && selectedIndex < columnData.length) {
            selectedValues.push(columnData[selectedIndex].value || '')
          } else {
            // 如果索引无效，使用第一个选项，但不添加到 selectedValues
            break
          }
        }

        const columns: JSX.Element[] = []

        for (let i = 0; i < Math.min(displayColumns, maxColumns); i++) {
          const columnData = getRegionColumnData(regionData, i, selectedValues.slice(0, i), dataLevel)
          if (columnData.length > 0) {
            columns.push(
              <PickerGroup
                key={`region-${i}`}
                mode="region"
                range={columnData}
                rangeKey="value"
                updateIndex={updateIndex}
                onColumnChange={handleColumnChange}
                columnId={String(i)}
              />
            )
          }
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
          />
        )
    }
  }, [mode, range, rangeKey, fields, updateIndex, updateDay, handleColumnChange, pickerDateRef.current, level, regionData])

  // 动画类名控制逻辑
  const clsMask = classNames('taro-picker__mask-overlay', 'taro-picker__animate-fade-in', {
    'taro-picker__animate-fade-out': state.fadeOut
  })
  const clsSlider = classNames('taro-picker', 'taro-picker__animate-slide-up', {
    'taro-picker__animate-slide-down': state.fadeOut
  })

  return (
    <View
      ref={forwardedRef}
      style={style}
      {...(formType ? { 'data-form-type': formType } : {})}
      {...omit(restProps, ['mode', 'disabled', 'range', 'rangeKey', 'value', 'start', 'end', 'fields', 'name', 'textProps', 'onChange', 'onColumnChange', 'onCancel', 'children', 'style', 'forwardedRef', 'formType'])}
    >
      <View onClick={showPicker}>
        {children}
      </View>
      {!state.hidden && (
        <View className="taro-picker__overlay">
          <View className={clsMask} onClick={handleCancel} />
          <View className={clsSlider}>
            <View className="taro-picker__hd">
              <View className="taro-picker__action" onClick={handleCancel}>
                {textProps.cancelText ?? '取消'}
              </View>
              {headerText && (
                <View className="taro-picker__title">{headerText}</View>
              )}
              <View className="taro-picker__action" onClick={handleChange}>
                {textProps.okText ?? '确定'}
              </View>
            </View>
            <View className="taro-picker__bd">{renderPickerGroup}</View>
          </View>
        </View>
      )}
    </View>
  )
}

export default Picker
