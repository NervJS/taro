import './style/index.scss'

import classNames from 'classnames'

import {
  compareTime,
  createForwardRefComponent,
  getDayRange,
  getMonthRange,
  getYearRange,
  hoursRange,
  minutesRange,
  omit,
  PICKER_LINE_HEIGHT,
  PICKER_TOP,
  verifyDate,
  verifyTime,
  verifyValue
} from '../../utils'
import { useCallback, useEffect, useMemo, useRef, useState } from '../../utils/hooks'
import { PickerGroup } from './picker-group'

import type React from 'react'

export type Mode = 'selector' | 'multiSelector' | 'time' | 'date'
export type Fields = 'day' | 'month' | 'year'
export type PickerValue = number | number[] | string

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
  textProps?: PickerText
  onChange?: (e: { detail: { value: PickerValue } }) => void
  onColumnChange?: (e: { detail: { column: number, value: number } }) => void
  onCancel?: () => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  forwardedRef?: React.MutableRefObject<HTMLDivElement | null>
  formType?: string
}

interface IState {
  pickerValue: PickerValue
  height: number[]
  hidden: boolean
  fadeOut: boolean
  isWillLoadCalled: boolean
}

export function Picker(props: IProps) {
  const {
    mode = 'selector',
    disabled = false,
    range = [],
    rangeKey,
    value,
    start = '',
    end = '',
    fields = 'day',
    textProps = {},
    onChange,
    onColumnChange,
    onCancel,
    children,
    className,
    style,
    forwardedRef,
    formType,
    ...restProps
  } = props
  const indexRef = useRef<number[]>([])
  const pickerDateRef = useRef<PickerDate>()
  const overlayRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<IState>({
    pickerValue: value || [],
    height: [],
    hidden: true,
    fadeOut: false,
    isWillLoadCalled: false
  })

  // 先定义 getHeightByIndex
  const getHeightByIndex = useCallback(() => {
    return indexRef.current.map(i => {
      let factor = 0
      if (mode === 'time') {
        factor = PICKER_LINE_HEIGHT * 4
      }
      return PICKER_TOP - PICKER_LINE_HEIGHT * i - factor
    })
  }, [mode])

  // 再定义 handleProps
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
      indexRef.current = time
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
    } else {
      throw new Error(`Picker not support "${mode}" mode.`)
    }
    // 更新高度值
    const newHeight = getHeightByIndex()
    setState(prev => ({
      ...prev,
      height: newHeight,
      pickerValue: value || []
    }))
  }, [mode, value, range, start, end, fields, getHeightByIndex])

  // 组件初始化
  useEffect(() => {
    setState(prev => ({ ...prev, isWillLoadCalled: true }))
    handleProps()
  }, [])

  // 属性变化监听
  useEffect(() => {
    if (state.isWillLoadCalled) {
      handleProps()
    }
  }, [handleProps, state.isWillLoadCalled])

  // 显示 Picker
  const showPicker = useCallback(() => {
    if (disabled) return

    // 确保在显示picker之前先处理props
    handleProps()

    const newHeight = getHeightByIndex()
    setState(prev => ({
      ...prev,
      height: newHeight,
      hidden: false
    }))
  }, [disabled, getHeightByIndex, handleProps])

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

  // 更新高度
  const updateHeight = useCallback((height: number, columnId: string, needRevise = false) => {
    const temp = [...state.height]
    temp[Number(columnId)] = height
    setState(prev => ({ ...prev, height: temp }))

    // time picker 必须在规定时间范围内，因此需要在 touchEnd 做修正
    if (needRevise) {
      let startTime = start
      let endTime = end

      if (!verifyTime(startTime)) startTime = '00:00'
      if (!verifyTime(endTime)) endTime = '23:59'
      if (!compareTime(startTime, endTime)) return

      const range = [hoursRange.slice(), minutesRange.slice()]

      const timeList = temp.map(h => (PICKER_TOP - h) / PICKER_LINE_HEIGHT)
      const timeStr = timeList.map((n, i) => range[i][n]).join(':')

      if (!compareTime(startTime, timeStr)) {
        // 修正到 start
        const height = startTime
          .split(':')
          .map(i => PICKER_TOP - PICKER_LINE_HEIGHT * (+i + 4))
        requestAnimationFrame(() => {
          setState(prev => ({ ...prev, height }))
        })
      } else if (!compareTime(timeStr, endTime)) {
        // 修正到 end
        const height = endTime
          .split(':')
          .map(i => PICKER_TOP - PICKER_LINE_HEIGHT * (+i + 4))
        requestAnimationFrame(() => {
          setState(prev => ({ ...prev, height }))
        })
      }
    }
  }, [state.height, start, end])

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
      const max = monthRange[monthRange.length - 1]
      const min = monthRange[0]

      if (currentMonth > max) _updateValue[1] = max
      if (currentMonth < min) _updateValue[1] = min
      const index = monthRange.indexOf(_updateValue[1])
      const height = PICKER_TOP - PICKER_LINE_HEIGHT * index

      updateDay(_updateValue[1], 1)
      updateHeight(height, '1')
    } else if (fields === 1) {
      const dayRange = getDayRange(_start, _end, currentYear, currentMonth)
      const max = dayRange[dayRange.length - 1]
      const min = dayRange[0]

      if (currentDay > max) _updateValue[2] = max
      if (currentDay < min) _updateValue[2] = min
      const index = dayRange.indexOf(_updateValue[2])
      const height = PICKER_TOP - PICKER_LINE_HEIGHT * index

      updateDay(_updateValue[2], 2)
      updateHeight(height, '2')
    }
  }, [updateHeight])

  // 处理确认
  const handleChange = useCallback(() => {
    hidePicker()

    const newIndex = state.height.map(h => (PICKER_TOP - h) / PICKER_LINE_HEIGHT)
    indexRef.current = newIndex

    let newValue: PickerValue = newIndex.length && mode !== 'selector'
      ? newIndex
      : newIndex[0]

    if (mode === 'time') {
      const range = [hoursRange.slice(), minutesRange.slice()]

      const timeArr = newIndex.map<string>((n, i) => range[i][n])

      indexRef.current = timeArr.map(item => parseInt(item))
      newValue = timeArr.join(':')
    }

    if (mode === 'date') {
      if (!pickerDateRef.current) return

      const { _start, _end, _updateValue } = pickerDateRef.current
      const currentYear = _updateValue[0]
      const currentMonth = _updateValue[1]
      const yearRange = getYearRange(_start.getFullYear(), _end.getFullYear())
      const monthRange = getMonthRange(_start, _end, currentYear)
      const dayRange = getDayRange(_start, _end, currentYear, currentMonth)

      const year = yearRange[newIndex[0]]
      const month = monthRange[newIndex[1]]
      const day = dayRange[newIndex[2]]

      if (fields === 'year') {
        newValue = [year]
      } else if (fields === 'month') {
        newValue = [year, month]
      } else {
        newValue = [year, month, day]
      }
      newValue = newValue
        .map(item => {
          return item < 10 ? `0${item}` : item
        })
        .join('-')
    }

    setState(prev => ({
      ...prev,
      pickerValue: newValue
    }))

    // 触发 onChange 事件，格式与原始组件一致
    onChange?.({ detail: { value: newValue } })
  }, [hidePicker, state.height, mode, fields, onChange])

  // 处理列变化
  const handleColumnChange = useCallback((e: { columnId: string, height: number }) => {
    const { columnId, height } = e
    onColumnChange?.({
      detail: {
        column: Number(columnId),
        value: (PICKER_TOP - height) / PICKER_LINE_HEIGHT
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
            height={state.height[index]}
            updateHeight={updateHeight}
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
            height={state.height[0]}
            updateHeight={updateHeight}
            columnId="0"
          />,
          <PickerGroup
            key="minute"
            mode="time"
            range={minRange}
            height={state.height[1]}
            updateHeight={updateHeight}
            columnId="1"
          />
        ]
      }
      case 'date': {
        const { height } = state
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
            height={height[0]}
            updateDay={updateDay}
            updateHeight={updateHeight}
            columnId="0"
          />
        ]
        if (fields === 'month' || fields === 'day') {
          renderView.push(
            <PickerGroup
              key="month"
              mode="date"
              range={monthRange}
              height={height[1]}
              updateDay={updateDay}
              updateHeight={updateHeight}
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
              height={height[2]}
              updateDay={updateDay}
              updateHeight={updateHeight}
              columnId="2"
            />
          )
        }
        return renderView
      }
      default:
        return (
          <PickerGroup
            range={range}
            rangeKey={rangeKey}
            height={state.height[0]}
            updateHeight={updateHeight}
            columnId="0"
          />
        )
    }
  }, [mode, range, rangeKey, state.height, fields, updateHeight, updateDay, handleColumnChange, pickerDateRef.current])

  // 动画类名控制逻辑
  const clsMask = classNames('weui-mask', 'weui-animate-fade-in', {
    'weui-animate-fade-out': state.fadeOut
  })
  const clsSlider = classNames('weui-picker', 'weui-animate-slide-up', {
    'weui-animate-slide-down': state.fadeOut
  })

  return (
    <div
      ref={forwardedRef}
      className={className}
      style={style}
      {...(formType ? { 'data-form-type': formType } : {})}
      {...omit(restProps, ['mode', 'disabled', 'range', 'rangeKey', 'value', 'start', 'end', 'fields', 'name', 'textProps', 'onChange', 'onColumnChange', 'onCancel', 'children', 'className', 'style', 'forwardedRef', 'formType'])}
    >
      <div onClick={showPicker}>
        {children}      </div>
      {/* 全屏遮罩浮层，display:none 控制显示，结构与原版一致 */}
      <div
        className="weui-picker__overlay"
        style={state.hidden ? { display: 'none' } : {}}
        ref={overlayRef}
      >
        <div className={clsMask} onClick={handleCancel} />
        <div className={clsSlider}>
          <div className="weui-picker__hd">
            <div className="weui-picker__action" onClick={handleCancel}>
              {textProps.cancelText ?? '取消'}
            </div>
            <div className="weui-picker__action" onClick={handleChange}>
              {textProps.okText ?? '确定'}
            </div>
          </div>
          <div className="weui-picker__bd">{renderPickerGroup}</div>
        </div>
      </div>
    </div>
  )
}

export default createForwardRefComponent(Picker)
