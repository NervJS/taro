import { Component, ComponentInterface, Element, Event, EventEmitter, Host, h, Prop, State, Watch } from '@stencil/core'
import classNames from 'classnames'
import {
  hoursRange,
  minutesRange,
  compareTime,
  verifyValue,
  verifyTime,
  verifyDate,
  getYearRange,
  getMonthRange,
  getDayRange,
  formatValue
} from './utils'
import {
  TOP,
  LINE_HEIGHT
} from './constant'

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

@Component({
  tag: 'taro-picker-core',
  styleUrl: './style/index.scss'
})
export class Picker implements ComponentInterface {
  private index: number[] = []
  private pickerDate: PickerDate
  private overlay?: HTMLElement

  @Element() el: HTMLElement

  @Prop() mode: Mode = 'selector'
  @Prop() disabled = false
  @Prop() range: any[] = []
  @Prop() rangeKey: string
  @Prop({ mutable: true }) value: PickerValue
  @Prop() start = ''
  @Prop() end = ''
  @Prop() fields: Fields = 'day'
  @Prop() name = ''
  @Prop() textProps: PickerText = {}

  @State() pickerValue: PickerValue = []
  @State() height: number[] = []
  @State() hidden = true
  @State() fadeOut = false
  @State() isWillLoadCalled = false

  @Event({
    eventName: 'change'
  }) onChange: EventEmitter

  @Event({
    eventName: 'columnchange'
  }) onColumnChange: EventEmitter

  @Event({
    eventName: 'cancel'
  }) onCancel: EventEmitter

  componentWillLoad () {
    this.isWillLoadCalled = true
    this.handleProps()
  }

  componentDidLoad () {
    if (this.overlay) {
      document.body.appendChild(this.overlay)
    }
  }

  disconnectedCallback () {
    if (this.overlay) {
      this.overlay.parentNode?.removeChild(this.overlay)
    }
  }

  @Watch('mode')
  @Watch('value')
  @Watch('range')
  @Watch('start')
  @Watch('end')
  onPropsChange () {
    if (!this.isWillLoadCalled) return
    this.handleProps()
  }

  handleProps () {
    const { mode, start, end } = this

    if (mode === 'selector') {
      const value = this.value as number
      this.index = [verifyValue(value, this.range) ? Math.floor(value) : 0]
    } else if (mode === 'multiSelector') {
      const value = this.value as number[]
      this.index = []
      this.range.forEach((range, index) => {
        const val = value?.[index]
        const item = verifyValue(val, range as any[]) ? Math.floor(val) : 0
        this.index.push(item)
      })
    } else if (mode === 'time') {
      let value = this.value as string
      // check value...
      if (!verifyTime(value)) {
        console.warn('time picker value illegal')
        value = '0:0'
      }

      const time = value.split(':').map(n => +n)
      this.index = time
    } else if (mode === 'date') {
      const value = this.value as string

      let _value = verifyDate(value) || new Date(new Date().setHours(0, 0, 0, 0)) // 没传值或值的合法性错误默认今天时间
      const _start = verifyDate(start) || new Date('1970/01/01')
      const _end = verifyDate(end) || new Date('2999/01/01')

      // 时间区间有效性
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

      this.index = [
        yearRange.indexOf(currentYear),
        monthRange.indexOf(currentMonth),
        dayRange.indexOf(currentDay)
      ]
      if (
        !this.pickerDate ||
        this.pickerDate._value.getTime() !== _value.getTime() ||
        this.pickerDate._start.getTime() !== _start.getTime() ||
        this.pickerDate._end.getTime() !== _end.getTime()
      ) {
        this.pickerDate = {
          _value,
          _start,
          _end,
          _updateValue: [
            currentYear,
            currentMonth,
            currentDay
          ]
        }
      }
    } else {
      throw new Error(`Picker not support "${mode}" mode.`)
    }

    // Prop 变化时，无论是否正在显示弹层，都更新 height 值
    this.height = this.getHeightByIndex()

    // 同步表单 value 值，用于 form submit
    this.pickerValue = this.value
    if (mode === 'date') {
      const val = this.pickerValue as string
      if (this.fields === 'month') {
        this.pickerValue = val.split('-').slice(0, 2).join('-')
      } else if (this.fields === 'year') {
        this.pickerValue = val.split('-')[0]
      }
    }
  }

  // 展示 Picker
  showPicker = () => {
    if (this.disabled) return

    this.height = this.getHeightByIndex()
    this.hidden = false
  }

  getHeightByIndex = () => {
    const height = this.index.map(i => {
      let factor = 0
      if (this.mode === 'time') {
        factor = LINE_HEIGHT * 4
      }
      return TOP - LINE_HEIGHT * i - factor
    })
    return height
  }

  // 隐藏 picker
  hidePicker = () => {
    this.fadeOut = true
    setTimeout(() => {
      this.hidden = true
      this.fadeOut = false
    }, 350)
  }

  // 点击确定按钮
  handleChange = () => {
    this.hidePicker()

    this.index = this.height.map(h => (TOP - h) / LINE_HEIGHT)

    let value: PickerValue = this.index.length && this.mode !== 'selector'
      ? this.index
      : this.index[0]

    if (this.mode === 'time') {
      const range = [hoursRange.slice(), minutesRange.slice()]

      const timeArr = this.index.map<string>((n, i) => range[i][n])

      this.index = timeArr.map(item => parseInt(item))
      value = timeArr.join(':')
    }

    if (this.mode === 'date') {
      const { _start, _end, _updateValue } = this.pickerDate
      const currentYear = _updateValue[0]
      const currentMonth = _updateValue[1]
      const yearRange = getYearRange(_start.getFullYear(), _end.getFullYear())
      const monthRange = getMonthRange(_start, _end, currentYear)
      const dayRange = getDayRange(_start, _end, currentYear, currentMonth)

      const year = yearRange[this.index[0]]
      const month = monthRange[this.index[1]]
      const day = dayRange[this.index[2]]

      if (this.fields === 'year') {
        value = [year]
      } else if (this.fields === 'month') {
        value = [year, month]
      } else {
        value = [year, month, day]
      }
      value = value
        .map(item => {
          return item < 10 ? `0${item}` : item
        })
        .join('-')
    }

    this.value = value
    this.pickerValue = this.value

    this.onChange.emit({
      value
    })
  }

  handleColumnChange = (e: CustomEvent) => {
    const { columnId, height } = e.detail
    this.onColumnChange.emit({
      column: Number(columnId),
      value: (TOP - height) / LINE_HEIGHT
    })
  }

  // 点击取消按钮或蒙层
  handleCancel = () => {
    this.hidePicker()
    this.onCancel.emit()
  }

  updateHeight = (height: number, columnId: string, needRevise = false) => {
    const temp = [...this.height]
    temp[columnId] = height
    this.height = temp

    // time picker 必须在规定时间范围内，因此需要在 touchEnd 做修正
    if (needRevise) {
      let { start, end } = this

      if (!verifyTime(start)) start = '00:00'
      if (!verifyTime(end)) end = '23:59'
      if (!compareTime(start, end)) return

      const range = [hoursRange.slice(), minutesRange.slice()]

      const timeList = this.height.map(h => (TOP - h) / LINE_HEIGHT)
      const timeStr = timeList.map((n, i) => range[i][n]).join(':')

      if (!compareTime(start, timeStr)) {
        // 修正到 start
        const height = start
          .split(':')
          .map(i => TOP - LINE_HEIGHT * (+i + 4))
        requestAnimationFrame(() => (this.height = height))
      } else if (!compareTime(timeStr, end)) {
        // 修正到 end
        const height = end
          .split(':')
          .map(i => TOP - LINE_HEIGHT * (+i + 4))
        requestAnimationFrame(() => (this.height = height))
      }
    }
  }

  updateDay = (value: number, fields: number) => {
    const { _start, _end, _updateValue } = this.pickerDate

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
      const height = TOP - LINE_HEIGHT * index

      this.updateDay(_updateValue[1], 1)
      this.updateHeight(height, '1')
    } else if (fields === 1) {
      const dayRange = getDayRange(_start, _end, currentYear, currentMonth)
      const max = dayRange[dayRange.length - 1]
      const min = dayRange[0]

      if (currentDay > max) _updateValue[2] = max
      if (currentDay < min) _updateValue[2] = min
      const index = dayRange.indexOf(_updateValue[2])
      const height = TOP - LINE_HEIGHT * index

      this.updateDay(_updateValue[2], 2)
      this.updateHeight(height, '2')
    }
  }

  // 单列选择器
  getSelector = () => {
    return (
      <taro-picker-group
        range={this.range}
        rangeKey={this.rangeKey}
        height={this.height[0]}
        updateHeight={this.updateHeight}
        columnId='0'
      />
    )
  }

  // 多列选择器
  getMultiSelector = () => {
    return this.range.map((range, index) => {
      return (
        <taro-picker-group
          range={range}
          rangeKey={this.rangeKey}
          height={this.height[index]}
          updateHeight={this.updateHeight}
          onColumnChange={this.handleColumnChange}
          columnId={String(index)}
        />
      )
    })
  }

  // 时间选择器
  getTimeSelector = () => {
    const hourRange = hoursRange.slice()
    const minRange = minutesRange.slice()
    return [
      <taro-picker-group
        mode='time'
        range={hourRange}
        height={this.height[0]}
        updateHeight={this.updateHeight}
        columnId='0'
      />,
      <taro-picker-group
        mode='time'
        range={minRange}
        height={this.height[1]}
        updateHeight={this.updateHeight}
        columnId='1'
      />
    ]
  }

  // 日期选择器
  getDateSelector = () => {
    const { fields, height } = this
    const { _start, _end, _updateValue } = this.pickerDate
    const currentYear = _updateValue[0]
    const currentMonth = _updateValue[1]

    const yearRange = getYearRange(_start.getFullYear(), _end.getFullYear())
      .map(item => `${item}年`)
    const monthRange = getMonthRange(_start, _end, currentYear)
      .map(item => `${item < 10 ? `0${item}` : item}月`)
    const dayRange = getDayRange(_start, _end, currentYear, currentMonth)
      .map(item => `${item < 10 ? `0${item}` : item}日`)

    const renderView = [
      <taro-picker-group
        mode='date'
        range={yearRange}
        height={height[0]}
        updateDay={this.updateDay}
        updateHeight={this.updateHeight}
        columnId='0'
      />
    ]
    if (fields === 'month' || fields === 'day') {
      renderView.push(
        <taro-picker-group
          mode='date'
          range={monthRange}
          height={height[1]}
          updateDay={this.updateDay}
          updateHeight={this.updateHeight}
          columnId='1'
        />
      )
    }
    if (fields === 'day') {
      renderView.push(
        <taro-picker-group
          mode='date'
          range={dayRange}
          height={height[2]}
          updateDay={this.updateDay}
          updateHeight={this.updateHeight}
          columnId='2'
        />
      )
    }

    return renderView
  }

  render () {
    const {
      name,
      mode,
      fadeOut,
      hidden
    } = this

    // 选项条
    let pickerGroup
    switch (mode) {
      case 'multiSelector':
        pickerGroup = this.getMultiSelector()
        break
      case 'time':
        pickerGroup = this.getTimeSelector()
        break
      case 'date':
        pickerGroup = this.getDateSelector()
        break
      default:
        pickerGroup = this.getSelector()
    }

    // 动画类名控制逻辑
    const clsMask = classNames('weui-mask', 'weui-animate-fade-in', {
      'weui-animate-fade-out': fadeOut
    })
    const clsSlider = classNames('weui-picker', 'weui-animate-slide-up', {
      'weui-animate-slide-down': fadeOut
    })
    const shouldDivHidden = hidden ? { display: 'none' } : {}

    return (
      <Host>
        <div onClick={this.showPicker}>
          <slot />
          <input type='hidden' name={name} value={formatValue(this.pickerValue)} />
        </div>
        <div
          class='weui-picker__overlay'
          style={shouldDivHidden}
          ref={el => { this.overlay = el }}
        >
          <div class={clsMask} onClick={this.handleCancel} />
          <div class={clsSlider}>
            <div class='weui-picker__hd'>
              <div class='weui-picker__action' onClick={this.handleCancel}>
                {this.textProps.cancelText ?? '取消'}
              </div>
              <div class='weui-picker__action' onClick={this.handleChange}>
                {this.textProps.okText ?? '确定'}
              </div>
            </div>
            <div class='weui-picker__bd'>{pickerGroup}</div>
            <input type='hidden' name={name} value={formatValue(this.pickerValue)} />
          </div>
        </div>
      </Host>
    )
  }
}
