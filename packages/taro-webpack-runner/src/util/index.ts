import * as path from 'path'

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

export {
  isEmptyObject,
  getRootPath,
  zeroPad,
  formatTime
}
