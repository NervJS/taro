import Taro from '@tarojs/api'
import throttle from 'lodash-es/throttle'

import { CallbackManager, MethodHandler } from '../../utils/handler'

const callbackManager = new CallbackManager()
let gyroscopeListener: ((evt: DeviceMotionEvent) => void) | undefined
let gyroscopeThrottled: ReturnType<typeof throttle> | undefined

const INTERVAL_MAP = {
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

/** Note: devicemotion 事件中 rotationRate 的单位为 deg/s，小程序端陀螺仪数据的单位为 rad/s */
const DEG_TO_RAD = Math.PI / 180

/** 每次 start / stop 递增，用于丢弃等待授权期间已被取代的 startGyroscope 请求 */
let startToken = 0

function removeGyroscopeListener () {
  if (gyroscopeListener) {
    window.removeEventListener('devicemotion', gyroscopeListener, true)
    gyroscopeThrottled?.cancel()
    gyroscopeListener = undefined
    gyroscopeThrottled = undefined
  }
}

/**
 * 停止监听陀螺仪数据。
 */
export const stopGyroscope: typeof Taro.stopGyroscope = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'stopGyroscope', success, fail, complete })
  try {
    startToken++
    removeGyroscopeListener()
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

/**
 * 开始监听陀螺仪数据。
 */
export const startGyroscope: typeof Taro.startGyroscope = ({ interval = 'normal', success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'startGyroscope', success, fail, complete })
  try {
    if (!window.DeviceMotionEvent) {
      throw new Error('gyroscope is not supported')
    }
    const intervalObj = INTERVAL_MAP[interval]
    if (!intervalObj) {
      throw new Error('invalid interval')
    }
    const token = ++startToken

    const listen = () => {
      removeGyroscopeListener()
      /**
       * Note: rotationRate 的 alpha、beta、gamma 分别为设备绕 x、y、z 轴旋转的角速度
       * @see https://w3c.github.io/deviceorientation/#devicemotioneventrotationrate
       */
      gyroscopeThrottled = throttle((rotationRate: DeviceMotionEventRotationRate) => {
        callbackManager.trigger({
          x: (rotationRate.alpha || 0) * DEG_TO_RAD,
          y: (rotationRate.beta || 0) * DEG_TO_RAD,
          z: (rotationRate.gamma || 0) * DEG_TO_RAD
        })
      }, intervalObj.interval)
      const throttled = gyroscopeThrottled
      gyroscopeListener = (evt: DeviceMotionEvent) => {
        // 设备无法提供陀螺仪数据时 rotationRate 为 null，此时不应当作静止读数上报。
        // 需要在节流之前过滤，否则空读数会顶掉节流窗口内待派发的有效读数
        if (!evt.rotationRate) return
        throttled(evt.rotationRate)
      }
      window.addEventListener('devicemotion', gyroscopeListener, true)
    }

    // iOS 13+ Safari 需要在用户交互中调用 requestPermission，授权后才会派发 devicemotion 事件
    const requestPermission = (window.DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission
    if (typeof requestPermission !== 'function') {
      listen()
      return handle.success()
    }

    return requestPermission.call(window.DeviceMotionEvent).then(
      state => {
        if (state !== 'granted') {
          return handle.fail({ errMsg: 'permission denied' })
        }
        if (token !== startToken) {
          return handle.fail({ errMsg: 'start was interrupted by a later start or stop call' })
        }
        listen()
        return handle.success()
      },
      (e: Error) => handle.fail({ errMsg: e?.message || 'permission request failed' })
    )
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

/**
 * 监听陀螺仪数据变化事件。频率根据 Taro.startGyroscope() 的 interval 参数。可以使用 Taro.stopGyroscope() 停止监听。
 */
export const onGyroscopeChange: typeof Taro.onGyroscopeChange = callback => {
  callbackManager.add(callback)
}

/**
 * 取消监听陀螺仪数据变化事件，参数为空，则取消所有的事件监听。
 */
export const offGyroscopeChange: typeof Taro.offGyroscopeChange = callback => {
  callbackManager.remove(callback)
}
