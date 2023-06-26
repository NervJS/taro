import Taro from '@tarojs/api'

import { throttle } from '../../utils'
import { CallbackManager, MethodHandler } from '../../utils/handler'
import { getDeviceInfo } from '../base/system'

const callbackManager = new CallbackManager()
let compassListener

/**
 * Note: 按系统类型获取对应绝对 orientation 事件名，因为安卓系统中直接监听 deviceorientation 事件得到的不是绝对 orientation
 */
const deviceorientationEventName = ['absolutedeviceorientation', 'deviceorientationabsolute', 'deviceorientation'].find(item => {
  if ('on' + item in window) {
    return item
  }
}) || ''

/**
 * 停止监听罗盘数据
 */
export const stopCompass: typeof Taro.stopCompass = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'stopCompass', success, fail, complete })
  try {
    window.removeEventListener(deviceorientationEventName, compassListener, true)
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

let CompassChangeTrigger = false
/**
 * 开始监听罗盘数据
 */
export const startCompass: typeof Taro.startCompass = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'startCompass', success, fail, complete })
  try {
    if (deviceorientationEventName !== '') {
      if (compassListener) {
        stopCompass()
      }
      compassListener = throttle((evt: DeviceOrientationEvent) => {
        const isAndroid = getDeviceInfo().system === 'AndroidOS'
        if (isAndroid && !evt.absolute && !CompassChangeTrigger) {
          CompassChangeTrigger = true
          console.warn('Warning: In \'onCompassChange\', your browser is not supported to get the orientation relative to the earth, the orientation data will be related to the initial orientation of the device .')
        }
        const alpha = evt.alpha || 0
        /**
         * 由于平台差异，accuracy 在 iOS/Android 的值不同。
         * - iOS：accuracy 是一个 number 类型的值，表示相对于磁北极的偏差。0 表示设备指向磁北，90 表示指向东，180 表示指向南，依此类推。
         * - Android：accuracy 是一个 string 类型的枚举值。
         */
        const accuracy = isAndroid ? evt.absolute ? 'high' : 'medium' : alpha
        callbackManager.trigger({
          direction: 360 - alpha,
          accuracy: accuracy
        } as unknown as Parameters<typeof Taro.onCompassChange>[number])
      }, 5000)
      window.addEventListener(deviceorientationEventName, compassListener, true)
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
