import { convertNumber2VP } from '@tarojs/runtime'
import { isNumber } from '@tarojs/shared'

export function getSingleSelector(range, rangeKey): any[] {
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

function handleNodeStyleData (dataValue: string, handler: (values: string[]) => { [key: string]: string } | void) {
  let res: any = {}
  if (dataValue) {
    const values = dataValue.toString().trim().split(/\s+/)
    const data = handler(values)

    if (!data) return res

    res = data

    Object.keys(res).forEach(key => {
      const exec = `${res[key]}`.match(/(\d+)(px)$/)
      if (exec && values.length > 1) {
        res[key] = getUnit(+exec[1])
      }
    })
  }

  return res
}

export function getNodeBorderRadiusData (dataValue: string) {
  return handleNodeStyleData(dataValue, values => {
    switch (values.length) {
      case 1:
        return { topLeft: values[0], topRight: values[0], bottomRight: values[0], bottomLeft: values[0] }
      case 2:
        return { topLeft: values[0], topRight: values[1], bottomRight: values[0], bottomLeft: values[1] }
      case 3:
        return { topLeft: values[0], topRight: values[1], bottomRight: values[2], bottomLeft: values[1] }
      case 4:
        return { topLeft: values[0], topRight: values[1], bottomRight: values[2], bottomLeft: values[3] }
      default:
        break
    }
  })
}

export function getNodeMarginOrPaddingData (dataValue: string) {
  return handleNodeStyleData(dataValue, values => {
    switch (values.length) {
      case 1:
        return { top: values[0], right: values[0], bottom: values[0], left: values[0] }
      case 2:
        return { top: values[0], right: values[1], bottom: values[0], left: values[1] }
      case 3:
        return { top: values[0], right: values[1], bottom: values[2], left: values[1] }
      case 4:
        return { top: values[0], right: values[1], bottom: values[2], left: values[3] }
      default:
        break
    }
  })
}
