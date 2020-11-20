import { Accelerometer } from 'expo-sensors'

const accCase: any = {}
const intervalMap: any = {
  game: 29,
  ui: 60,
  normal: 200
}

function offAccelerometerChange (fnc?: () => any): void {
  if (fnc && typeof fnc === 'function') {
    if (accCase.callback === fnc) {
      accCase.callback = null
    } else {
      console.warn('offAccelerometerChange failed')
    }
  } else {
    Accelerometer.removeAllListeners()
    accCase.listener = null
    accCase.callback = null
  }
}

function onAccelerometerChange (fnc: Taro.onAccelerometerChange.Callback): void {
  accCase.callback = fnc
}

/**
 * 开始监听加速度数据。
 * @param {Object} opts
 * @param {string} [opts.interval='normal'] 监听加速度数据回调函数的执行频率
 */
function startAccelerometer (opts: Taro.startAccelerometer.Option = {}): Promise<Taro.General.CallbackResult> {
  const { interval = 'normal', success, fail, complete } = opts
  accCase.interval = interval
  const res = { errMsg: 'startAccelerometer:ok' }
  try {
    accCase.listener = Accelerometer.addListener(accCase.callback)
    success && success(res)
    complete && complete(res)
  } catch (error) {
    res.errMsg = 'startAccelerometer:fail'
    fail && fail(res)
    complete && complete(res)
    return Promise.reject(res)
  }
  Accelerometer.setUpdateInterval(intervalMap[interval])
  return Promise.resolve(res)
}

/**
 * 停止监听加速度数据
 * @param opts
 */
function stopAccelerometer (opts: Taro.stopAccelerometer.Option = {}): Promise<Taro.General.CallbackResult> {
  const { success, fail, complete } = opts
  const res = { errMsg: 'stopAccelerometer:ok' }
  try {
    accCase.listener.remove()
    accCase.listener = null
    success && success(res)
    complete && complete(res)
    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'stopAccelerometer:fail'
    fail && fail(res)
    complete && complete(res)
    return Promise.reject(res)
  }
}

export {
  onAccelerometerChange,
  offAccelerometerChange,
  startAccelerometer,
  stopAccelerometer
}
