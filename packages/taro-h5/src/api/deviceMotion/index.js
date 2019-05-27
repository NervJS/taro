import { createCallbackManager, successHandler, errorHandler } from '../utils/index'

let deviceMotionListener
const callbackManager = createCallbackManager()

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

/**
 * 停止监听设备方向的变化。
 * @param {Object} object 参数
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
const stopDeviceMotionListening = ({ success, fail, complete }) => {
  try {
    window.removeEventListener('deviceorientation', deviceMotionListener, true)
    return successHandler(success, complete)({
      errMsg: 'stopDeviceMotionListening:ok'
    })
  } catch (e) {
    return errorHandler(fail, complete)({
      errMsg: `stopDeviceMotionListening:fail ${e.message}`
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
      alpha: evt.alpha,
      beta: evt.beta,
      gamma: evt.gamma
    })
    timer = setTimeout(() => { lock = false }, interval)
  }
}

/**
 * 开始监听设备方向的变化。
 * @param {Object} object 参数
 * @param {function} [object.success] 接口调用成功的回调函数
 * @param {function} [object.fail] 接口调用失败的回调函数
 * @param {function} [object.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
const startDeviceMotionListening = ({ interval = 'normal', success, fail, complete } = {}) => {
  try {
    const intervalObj = INTERVALMAP[interval]
    if (window.DeviceOrientationEvent) {
      if (deviceMotionListener) {
        stopDeviceMotionListening()
      }
      deviceMotionListener = getDeviceOrientationListener(intervalObj.interval)
      window.addEventListener('deviceorientation', deviceMotionListener, true)
    } else {
      throw new Error('deviceMotion is not supported')
    }
    return successHandler(success, complete)({
      errMsg: 'startDeviceMotionListening:ok'
    })
  } catch (e) {
    return errorHandler(fail, complete)({
      errMsg: `startDeviceMotionListening:fail ${e.message}`
    })
  }
}

/**
 * @typedef DeviceMotionParam 回调参数
 * @property {number} alpha 当手机坐标 X/Y 和 地球 X/Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为 [0, 2*PI)。逆时针转动为正。
 * @property {number} beta 当手机坐标 Y/Z 和地球 Y/Z 重合时，绕着 X 轴转动的夹角为 beta。范围值为 [-1*PI, PI) 。顶部朝着地球表面转动为正。也有可能朝着用户为正。
 * @property {number} gamma 当手机 X/Z 和地球 X/Z 重合时，绕着 Y 轴转动的夹角为 gamma。范围值为 [-1*PI/2, PI/2)。右边朝着地球表面转动为正。
 */

/**
 * 监听设备方向变化事件。频率根据 wx.startDeviceMotionListeningListening() 的 interval 参数。可以使用 wx.stopDeviceMotionListeningListening() 停止监听。
 * @param {(obj: DeviceMotionParam) => void} callback 罗盘数据变化事件的回调函数
 */
const onDeviceMotionChange = callback => {
  callbackManager.add(callback)
}

export {
  stopDeviceMotionListening,
  startDeviceMotionListening,
  onDeviceMotionChange
}
