import Taro from '@tarojs/api'

import { CallbackManager, MethodHandler } from '../utils/handler'

let compassListener
const callbackManager = new CallbackManager()

/**
 * 按系统类型获取对应绝对orientation事件名，因为安卓系统中
 * 直接监听deviceorientation事件得到的不是绝对orientation
 */
const getDeviceorientationAbsoluteEventNameByOS = () => {
  ['absolutedeviceorientation',
    'deviceorientationabsolute',
    'deviceorientation']
    .forEach(item => {
      if ('on' + item in window) {
        return item
      }
    }
    )
  return ''
}

/**
 * 停止监听罗盘数据
 */
export const stopCompass: typeof Taro.stopCompass = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'stopCompass', success, fail, complete })
  try {
    window.removeEventListener(getDeviceorientationAbsoluteEventNameByOS(), compassListener, true)
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
    if (getDeviceorientationAbsoluteEventNameByOS() !== '') {
      if (compassListener) {
        stopCompass()
      }
      compassListener = getDeviceOrientationListener(200)
      window.addEventListener(getDeviceorientationAbsoluteEventNameByOS(), compassListener, true)
    } else {
      throw new Error('compass is not supported')
    }
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

let isFirstTimeOnCompassChange = true

/**
 * 监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 wx.stopCompass 停止监听。
 */
export const onCompassChange: typeof Taro.onCompassChange = callback => {
  callbackManager.add((result: { accuracy, direction, absolute }) => {
    if (!result.absolute) {
      if (isFirstTimeOnCompassChange) {
        isFirstTimeOnCompassChange = false
        console.warn(`Warning: In 'onCompassChange',
        your browser is not supported to get the orientation relative to the earth,
        the orientation data will be related to the initial orientation of the device .`)
      }
    }
    callback(result)
  })
}

/**
 * 取消监听罗盘数据变化事件，参数为空，则取消所有的事件监听。
 */
export const offCompassChange: typeof Taro.offCompassChange = callback => {
  callbackManager.remove(callback)
}
