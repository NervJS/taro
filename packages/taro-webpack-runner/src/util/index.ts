import * as path from 'path'
import { mergeWith } from 'lodash';

const isEmptyObject = function (obj) {
  if (obj == null) {
    return true
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

const getRootPath = function () {
  return path.resolve(__dirname, '../../')
}

const zeroPad = function (num, places) {
  const zero = places - num.toString().length + 1
  return Array(+(zero > 0 && zero)).join('0') + num
}

const formatTime = function (date?) {
  if (!date) {
    date = new Date()
  } else if (!(date instanceof Date)) {
    date = new Date(date)
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  return `${year}-${zeroPad(month, 2)}-${zeroPad(day, 2)} ${zeroPad(hour, 2)}:${zeroPad(minute, 2)}`
}

const appPath = process.cwd()
const emptyObj = {}
const emptyTogglableObj = {
  enable: false,
  config: {}
}

const recursiveMerge = (src, ...args) => {
  return mergeWith(src, ...args, (value, srcValue, key, obj, source) => {
    const typeValue = typeof value
    const typeSrcValue = typeof srcValue
    if (typeValue !== typeSrcValue) return
    if (Array.isArray(value) && Array.isArray(srcValue)) {
      return value.concat(srcValue)
    }
    if (typeValue === 'object') {
      return recursiveMerge(value, srcValue)
    }
  })
}

const isNpmPackage = name => !/^(\.|\/)/.test(name)

const addLeadingSlash = path => path.charAt(0) === '/' ? path : '/' + path
const addTrailingSlash = path => path.charAt(path.length - 1) === '/' ? path : path + '/'

export {
  appPath,
  emptyObj,
  emptyTogglableObj,
  isEmptyObject,
  isNpmPackage,
  getRootPath,
  zeroPad,
  formatTime,
  recursiveMerge,
  addLeadingSlash,
  addTrailingSlash
}
