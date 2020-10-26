import { createCallbackManager, successHandler, errorHandler } from '../utils/index'

let compassListener
const callbackManager = createCallbackManager()

/**
 * 停止监听罗盘数据
 * @param {Object} object 参数
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
const stopCompass = ({ success, fail, complete } = {}) => {
  try {
    window.removeEventListener('deviceorientation', compassListener, true)
    return successHandler(success, complete)({
      errMsg: 'stopCompass:ok'
    })
  } catch (e) {
    return errorHandler(fail, complete)({
      errMsg: `stopCompass:fail ${e.message}`
    })
  }
}

const getDeviceOrientationListener = interval => {
  let lock
  let timer
  return evt => {
    if (lock) return
    lock = true
    timer && clearTimeout(timer)
    callbackManager.trigger({
      direction: 360 - evt.alpha
    })
    timer = setTimeout(() => { lock = false }, interval)
  }
}

/**
 * 开始监听罗盘数据
 * @param {Object} object 参数
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
const startCompass = ({ success, fail, complete } = {}) => {
  try {
    if (window.DeviceOrientationEvent) {
      if (compassListener) {
        stopCompass()
      }
      compassListener = getDeviceOrientationListener(200)
      window.addEventListener('deviceorientation', compassListener, true)
    } else {
      throw new Error('compass is not supported')
    }
    return successHandler(success, complete)({
      errMsg: 'startCompass:ok'
    })
  } catch (e) {
    return errorHandler(fail, complete)({
      errMsg: `startCompass:fail ${e.message}`
    })
  }
}

/**
 * @typedef CompassParam 回调参数
 * @property {number} direction 面对的方向度数
 * @property {Accuracy} [accuracy] 精度
 */

/**
 * @typedef {'high'|'medium'|'low'|'no-contact'|'unreliable'|'unknow'|number} Accuracy
 * 由于平台差异，accuracy 在 iOS/Android 的值不同。
 * iOS：accuracy 是一个 number 类型的值，表示相对于磁北极的偏差。0 表示设备指向磁北，90 表示指向东，180 表示指向南，依此类推。
 * Android：accuracy 是一个 string 类型的枚举值。
 * high 高精度
 * medium 中等精度
 * low 低精度
 * no-contact 不可信，传感器失去连接
 * unreliable 不可信，原因未知
 * unknow ${value} 未知的精度枚举值，即该 Android 系统此时返回的表示精度的 value 不是一个标准的精度枚举值
 */

/**
 * 监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 wx.stopCompass 停止监听。
 * @param {(obj: CompassParam) => void} callback 罗盘数据变化事件的回调函数
 */
const onCompassChange = callback => {
  callbackManager.add(callback)
}

export {
  stopCompass,
  startCompass,
  onCompassChange
}
