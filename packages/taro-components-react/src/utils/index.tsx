/* eslint-disable react/react-in-jsx-scope */
import { forwardRef } from './hooks'

export function throttle (fn, threshold = 250, scope?) {
  let lastTime = 0
  let deferTimer: ReturnType<typeof setTimeout>
  return function (...args) {
    const context = scope || this
    const now = Date.now()
    if (now - lastTime > threshold) {
      fn.apply(this, args)
      lastTime = now
    } else {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        lastTime = now
        fn.apply(context, args)
      }, threshold)
    }
  }
}

export function debounce (fn, ms = 250, scope?) {
  let timer: ReturnType<typeof setTimeout>

  return function (...args) {
    const context = scope || this
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, ms)
  }
}

export function omit (obj, fields) {
  const shallowCopy = Object.assign({}, obj)
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i]
    delete shallowCopy[key]
  }
  return shallowCopy
}

export const createForwardRefComponent = (ReactComponent: any) => {
  const forwardRefComponent = (
    props,
    ref
  ) => <ReactComponent {...props} forwardedRef={ref} />

  return forwardRef(forwardRefComponent)
}

// Picker 工具函数
function getTimeRange (begin: number, end: number) {
  const range: string[] = []
  for (let i = begin; i <= end; i++) {
    range.push(`${i < 10 ? '0' : ''}${i}`)
  }
  return range
}

export const hoursRange = getTimeRange(0, 23)

export const minutesRange = getTimeRange(0, 59)

/**
 * 校验传入的 value 是否合法
 */
export function verifyValue (value: number, range: any[]) {
  if (!isNaN(+value) && value >= 0 && value < range.length) return true
  return false
}

/**
 * 检验传入的 time value 是否合法
 */
export function verifyTime (value: string) {
  if (!/^\d{1,2}:\d{1,2}$/.test(value)) return false

  const time = value.split(':').map(num => +num)

  if (time[0] < 0 || time[0] > 23) return false
  if (time[1] < 0 || time[1] > 59) return false

  return true
}

/**
 * 比较时间
 * return t1 <= t2
 */
export function compareTime (t1: string, t2: string) {
  const t1List = t1.split(':').map(i => +i)
  const t2List = t2.split(':').map(i => +i)

  if (t1List[0] < t2List[0]) return true
  if (t1List[0] === t2List[0] && t1List[1] <= t2List[1]) return true

  return false
}

/**
 * 校验日期合法性，返回合法性和日期数组
 */
export function verifyDate (dateStr: string) {
  if (!dateStr) return false
  const date = new Date(dateStr.replace(/-/g, '/'))
  return isNaN(date.getMonth()) ? false : date
}

/**
 * 获取当月最大天数
 */
function getMaxDay (year: number, month: number) {
  if (month === 4 || month === 6 || month === 9 || month === 11) return 30
  if (month === 2) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) return 29
    else return 28
  }
  return 31
}

/**
 * 获取时间数组
 */
function getDateRange (start: number, end: number) {
  const range: number[] = []
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
}

/**
 * 获取年份区间数组
 */
export function getYearRange (start: number, end: number) {
  return getDateRange(start, end)
}

/**
 * 获取月份区间数组
 */
export function getMonthRange (start: Date, end: Date, year: number) {
  let rangeStart = 1
  let rangeEnd = 12

  // 当前年份等于开始年份，由开始对应的月份约束开始值
  if (start.getFullYear() === year) {
    rangeStart = start.getMonth() + 1
  }

  // 当前年份等于结束年份，由结束对应的月份约束结束值
  if (end.getFullYear() === year) {
    rangeEnd = end.getMonth() + 1
  }

  return getDateRange(rangeStart, rangeEnd)
}

/**
 * 获取日期区间数组
 */
export function getDayRange (start: Date, end: Date, year: number, month: number) {
  let rangeStart = 1
  let rangeEnd = getMaxDay(year, month)

  if (start.getFullYear() === year && start.getMonth() + 1 === month) {
    rangeStart = start.getDate()
  }

  if (end.getFullYear() === year && end.getMonth() + 1 === month) {
    rangeEnd = end.getDate()
  }

  return getDateRange(rangeStart, rangeEnd)
}

