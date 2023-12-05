import { convertNumber2VP } from '@tarojs/runtime'
import { isNumber } from '@tarojs/shared'

export function getSingleSelector(ctx, range, rangeKey): any[] {
  return range.map((data) => data[rangeKey])
}

export function getMultiSelector(ctx, range, rangeKey, value) {
  return range.map((arr, arrIndex) => arr.map((data, i) => {
    const columnValue = value[arrIndex]
    if (columnValue === data) {
      ctx.showSelector[arrIndex] = i
    }
    if (rangeKey && typeof range[0][0] === 'object') {
      return data[rangeKey]
    }
    return data
  }))
}

export function getUnit (val) {
  if (/\d+(vp)$/.test(val)) {
    return val
  } else if (isNumber(val) || /\d+px$/.test(val)) {
    return convertNumber2VP(parseFloat(val))
  }
  return val
}

export function getNodeMarginOrPaddingData (dataValue: string) {
  let res: any = {}
  if (dataValue) {
    const values = dataValue.trim().split(/\s+/)
    switch (values.length) {
      case 1:
        res = { top: values[0], right: values[0], bottom: values[0], left: values[0] }
        break
      case 2:
        res = { top: values[0], right: values[1], bottom: values[0], left: values[1] }
        break
      case 3:
        res = { top: values[0], right: values[1], bottom: values[2], left: values[1] }
        break
      case 4:
        res = { top: values[0], right: values[1], bottom: values[2], left: values[3] }
        break
      default:
        break
    }
    Object.keys(res).forEach(key => {
      const exec = `${res[key]}`.match(/(\d+)(px)$/)
      if (exec && values.length > 1) {
        res[key] = getUnit(+exec[1])
      }
    })
  }
  return res
}
