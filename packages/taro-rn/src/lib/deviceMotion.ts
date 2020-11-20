import { DeviceMotion } from 'expo-sensors'

const devMotionCase: any = {}
const intervalMap: any = {
  game: 20,
  ui: 60,
  normal: 200
}

function onDeviceMotionChange (fnc: Taro.onDeviceMotionChange.Callback): void {
  devMotionCase.callback = fnc
}

/**
 * 开始监听设备方向的变化
 * @param object
 * @param {string} [object.interval='normal'] - 监听设备方向的变化回调函数的执行频率
 */
function startDeviceMotionListening (object: Taro.startDeviceMotionListening.Option = {}): Promise<Taro.General.CallbackResult> {
  const { interval = 'normal', success, fail, complete } = object
  const res = { errMsg: 'startDeviceMotionListening:ok' }
  devMotionCase.interval = interval
  try {
    devMotionCase.listener = DeviceMotion.addListener((res) => {
      const { rotation } = res
      devMotionCase.callback && devMotionCase.callback(rotation)
    })
    success && success(res)
    complete && complete(res)
  } catch (error) {
    res.errMsg = 'startDeviceMotionListening:fail'
    fail && fail(res)
    complete && complete(res)
    return Promise.reject(res)
  }
  DeviceMotion.setUpdateInterval(intervalMap[interval] || intervalMap.normal)
  return Promise.resolve(res)
}

/**
 * 停止监听设备方向的变化
 * @param object
 */
function stopDeviceMotionListening (object: Taro.stopDeviceMotionListening.Option = {}): Promise<Taro.General.CallbackResult> {
  const { success, fail, complete } = object
  const res = { errMsg: 'stopDeviceMotionListening:ok' }
  try {
    devMotionCase.listener.remove()
    devMotionCase.listener = null
    success && success(res)
    complete && complete(res)
    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'stopDeviceMotionListening:fail'
    fail && fail(res)
    complete && complete(res)
    return Promise.reject(res)
  }
}

export {
  onDeviceMotionChange,
  startDeviceMotionListening,
  stopDeviceMotionListening
}
