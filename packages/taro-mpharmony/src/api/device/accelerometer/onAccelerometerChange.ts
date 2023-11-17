import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 监听加速度数据事件。频率根据 Taro.startAccelerometer() 的 interval 参数。可使用 Taro.stopAccelerometer() 停止监听。
 * 
 * @canUse onAccelerometerChange
 * @__callback [x, y, z]
 */
export const onAccelerometerChange: typeof Taro.onAccelerometerChange = (callback) => {
  const name = 'onAccelerometerChange'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  if (!callback.name) {
    Object.defineProperty(callback, 'name', { value: `${name}` })
  }
  // @ts-ignore
  native.onAccelerometerChange(callback)
}
