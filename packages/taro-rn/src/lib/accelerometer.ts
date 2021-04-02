import { Accelerometer } from 'expo-sensors'

const accCase: any = {
  callbacks: [],
}
const intervalMap: any = {
  game: 20,
  ui: 60,
  normal: 200
}

function offAccelerometerChange(fnc?: Taro.onAccelerometerChange.Callback): void {
  if (fnc && typeof fnc === 'function') {
    accCase.callbacks = accCase.callbacks.filter((cb: (...args: any[]) => any) => cb !== fnc)
  } else if (fnc === undefined) {
    accCase.callbacks = []
  } else {
    console.warn('offAccelerometerChange failed')
  }
}

function onAccelerometerChange(fnc: Taro.onAccelerometerChange.Callback): void {
  accCase.callbacks.push(fnc)
}

/**
 * 开始监听加速度数据。
 * @param {Object} opts
 * @param {string} [opts.interval='normal'] 监听加速度数据回调函数的执行频率
 */
function startAccelerometer(opts: Taro.startAccelerometer.Option = {}): Promise<Taro.General.CallbackResult> {
  const { interval = 'normal', success, fail, complete } = opts
  accCase.interval = interval
  const res = { errMsg: 'startAccelerometer:ok' }
  try {
    // 适配微信小程序行为：重复 start 失败
    if (accCase.listener) {
      throw new Error('startAccelerometer:fail')
    }
    accCase.listener = Accelerometer.addListener((e: Taro.onAccelerometerChange.Result) => {
      accCase.callbacks.forEach((cb: (...args: any[]) => any) => {
        cb?.(e)
      });
    })
    success?.(res)
    complete?.(res)
  } catch (error) {
    res.errMsg = 'startAccelerometer:fail'
    fail?.(res)
    complete?.(res)
    return Promise.reject(res)
  }
  Accelerometer.setUpdateInterval(intervalMap[interval])
  return Promise.resolve(res)
}

/**
 * 停止监听加速度数据
 * @param opts
 */
function stopAccelerometer(opts: Taro.stopAccelerometer.Option = {}): Promise<Taro.General.CallbackResult> {
  const { success, fail, complete } = opts
  const res = { errMsg: 'stopAccelerometer:ok' }
  try {
    accCase.listener.remove()
    accCase.listener = null
    success?.(res)
    complete?.(res)
    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'stopAccelerometer:fail'
    fail?.(res)
    complete?.(res)
    return Promise.reject(res)
  }
}

export {
  onAccelerometerChange,
  offAccelerometerChange,
  startAccelerometer,
  stopAccelerometer
}
