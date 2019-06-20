import { DeviceMotion } from 'expo-sensors'

const devMotionCase = {}
const intervalMap = {
  game: 20,
  ui: 60,
  normal: 200
}

function onDeviceMotionChange (fnc) {
  devMotionCase.callback = fnc
}

/**
 * 开始监听设备方向的变化
 * @param object
 * @param {string} [object.interval='normal'] - 监听设备方向的变化回调函数的执行频率
 */
function startDeviceMotionListening (object = {}) {
  const {interval = 'normal', success, fail, complete} = object
  devMotionCase.interval = interval
  try {
    devMotionCase.listener = DeviceMotion.addListener((res) => {
      const {rotation} = res
      devMotionCase.callback && devMotionCase.callback(rotation)
    })
    success && success()
    complete && complete()
  } catch (error) {
    fail && fail()
    complete && complete()
    const res = {errMsg: 'startDeviceMotionListening failed'}
    return Promise.reject(res)
  }
  DeviceMotion.setUpdateInterval(intervalMap[interval] || intervalMap.normal)
  return Promise.resolve({errMsg: 'ok'})
}

/**
 * 停止监听设备方向的变化
 * @param object
 */
function stopDeviceMotionListening (object = {}) {
  const {success, fail, complete} = object
  try {
    devMotionCase.listener.remove()
    devMotionCase.listener = null
    success && success()
    complete && complete()
    return Promise.resolve({errMsg: 'ok'})
  } catch (error) {
    fail && fail()
    complete && complete()
    const res = {errMsg: 'stopDeviceMotionListening failed'}
    return Promise.reject(res)
  }
}

export {
  onDeviceMotionChange,
  startDeviceMotionListening,
  stopDeviceMotionListening
}

export default {
  onDeviceMotionChange,
  startDeviceMotionListening,
  stopDeviceMotionListening
}
