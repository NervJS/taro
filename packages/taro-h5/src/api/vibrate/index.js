import { successHandler, errorHandler } from '../utils/index'

const vibrator = function vibrator (mm) {
  try {
    return window.navigator.vibrate(mm)
  } catch (e) {
    console.log('当前浏览器不支持vibrate')
  }
}

/**
 * 使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
 * @param {Object} object 参数
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
export const vibrateShort = ({ success, fail, complete } = {}) => {
  if (vibrator) {
    vibrator(15)
    return successHandler(success, complete)({
      errMsg: 'vibrateShort:ok'
    })
  } else {
    return errorHandler(fail, complete)({
      errMsg: 'vibrateShort:fail'
    })
  }
}

/**
 * 使手机发生较长时间的振动（400 ms)
 * @param {Object} object 参数
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
export const vibrateLong = ({ success, fail, complete } = {}) => {
  if (vibrator) {
    vibrator(400)
    return successHandler(success, complete)({
      errMsg: 'vibrateLong:ok'
    })
  } else {
    return errorHandler(fail, complete)({
      errMsg: 'vibrateLong:fail'
    })
  }
}
