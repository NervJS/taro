import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 取消监听加速度数据事件，参数为空，则取消所有的事件监听
 * 
 * @canUse offAccelerometerChange
 */
export const offAccelerometerChange: typeof Taro.offAccelerometerChange = (callback) => {
  const name = 'offAccelerometerChange'

  // callback must be an Function or undefined
  const isValid = shouldBeFunction(callback).flag || typeof callback === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.offAccelerometerChange(callback)
}
