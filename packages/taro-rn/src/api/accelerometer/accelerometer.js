import { Accelerometer } from 'expo-sensors'

const accCase = {}
const intervalMap = {
  game: 29,
  ui: 60,
  normal: 200
}

function onAccelerometerChange (fnc) {
  accCase.callback = fnc
}

/**
 * 开始监听加速度数据。
 * @param {Object} opts
 * @param {string} [opts.interval='normal'] 监听加速度数据回调函数的执行频率
 */
function startAccelerometer (opts = {}) {
  const {interval = 'normal', success, fail, complete} = opts
  accCase.interval = interval
  try {
    accCase.listener = Accelerometer.addListener(accCase.callback)
    success && success()
    complete && complete()
  } catch (error) {
    fail && fail()
    complete && complete()
    const res = {errMsg: 'stopAccelerometer failed'}
    return Promise.reject(res)
  }
  Accelerometer.setUpdateInterval(intervalMap[interval])
  return Promise.resolve({errMsg: 'ok'})
}

/**
 * 停止监听加速度数据
 * @param opts
 */
function stopAccelerometer (opts = {}) {
  const {success, fail, complete} = opts
  try {
    accCase.listener.remove()
    accCase.listener = null
    success && success()
    complete && complete()
    return Promise.resolve({errMsg: 'ok'})
  } catch (error) {
    fail && fail()
    complete && complete()
    const res = {errMsg: 'stopAccelerometer failed'}
    return Promise.reject(res)
  }
}

export {
  onAccelerometerChange,
  startAccelerometer,
  stopAccelerometer
}
