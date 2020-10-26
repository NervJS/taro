import { createCallbackManager, successHandler, errorHandler } from '../utils/index'

const callbackManager = createCallbackManager()
let devicemotionListener

/**
 * 停止监听加速度数据。
 * @param {Object} [object] 参数
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
const stopAccelerometer = ({ success, fail, complete } = {}) => {
  const res = {}
  try {
    window.removeEventListener('devicemotion', devicemotionListener, true)
    res.errMsg = 'stopAccelerometer:ok'
    return successHandler(success, complete)(res)
  } catch (e) {
    res.errMsg = `stopAccelerometer:fail ${e.message}`
    return errorHandler(fail, complete)(res)
  }
}

const INTERVALMAP = {
  game: {
    interval: 20,
    frequency: 50
  },
  ui: {
    interval: 60,
    frequency: 16.67
  },
  normal: {
    interval: 200,
    frequency: 5
  }
}

const getDevicemotionListener = interval => {
  let lock
  let timer
  return evt => {
    if (lock) return
    lock = true
    timer && clearTimeout(timer)
    callbackManager.trigger({
      x: evt.acceleration.x || 0,
      y: evt.acceleration.y || 0,
      z: evt.acceleration.z || 0
    })
    timer = setTimeout(() => { lock = false }, interval)
  }
}

/**
 * 开始监听加速度数据。
 * @param {Object} [object] 参数
 * @param {'game' | 'ui' | 'normal'} [object.interval=normal] 监听加速度数据回调函数的执行频率
 * game 适用于更新游戏的回调频率，在 20ms/次 左右
 * ui 适用于更新 UI 的回调频率，在 60ms/次 左右
 * normal 普通的回调频率，在 200ms/次 左右
 * @param {function} [object.success]  接口调用成功的回调函数
 * @param {function} [object.fail]  接口调用失败的回调函数
 * @param {function} [object.complete]  接口调用结束的回调函数（调用成功、失败都会执行）
 */
const startAccelerometer = ({ interval = 'normal', success, fail, complete } = {}) => {
  try {
    if (window.DeviceMotionEvent) {
      const intervalObj = INTERVALMAP[interval]
      if (devicemotionListener) {
        stopAccelerometer()
      }
      devicemotionListener = getDevicemotionListener(intervalObj.interval)
      window.addEventListener('devicemotion', devicemotionListener, true)
    } else {
      throw new Error('accelerometer is not supported')
    }
    return successHandler(success, complete)({
      errMsg: 'startAccelerometer:ok'
    })
  } catch (e) {
    return errorHandler(fail, complete)({
      errMsg: `startAccelerometer:fail ${e.message}`
    })
  }
}

/**
 * 加速度数据事件的回调函数的参数
 * @typedef {object} AccelerometerParam
 * @property {number} x X 轴
 * @property {number} y Y 轴
 * @property {number} z Z 轴
 */

/**
 * 监听加速度数据事件。频率根据 wx.startAccelerometer() 的 interval 参数。可使用 wx.stopAccelerometer() 停止监听。
 * @param {(res: AccelerometerParam) => void} callback 加速度数据事件的回调函数
 */
const onAccelerometerChange = callback => {
  callbackManager.add(callback)
}

export { stopAccelerometer, startAccelerometer, onAccelerometerChange }
