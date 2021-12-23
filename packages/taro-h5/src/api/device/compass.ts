import Taro from '@tarojs/api'
import { CallbackManager, MethodHandler } from '../utils/handler'

const callbackManager = new CallbackManager()
let compassListener

/**
 * 停止监听罗盘数据
 */
export const stopCompass: typeof Taro.stopCompass = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'stopCompass', success, fail, complete })
  try {
    window.removeEventListener('deviceorientation', compassListener, true)
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
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
 */
export const startCompass: typeof Taro.startCompass = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'startCompass', success, fail, complete })
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
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

/**
 * 监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 wx.stopCompass 停止监听。
 */
export const onCompassChange: typeof Taro.onCompassChange = callback => {
  callbackManager.add(callback)
}

/**
 * 取消监听罗盘数据变化事件，参数为空，则取消所有的事件监听。
 */
export const offCompassChange: typeof Taro.offCompassChange = callback => {
  callbackManager.remove(callback)
}
