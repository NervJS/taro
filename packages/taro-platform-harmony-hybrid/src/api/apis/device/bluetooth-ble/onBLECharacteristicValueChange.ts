import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/api/apis/utils'

import native from '../../NativeApi'

/**
 * 监听低功耗蓝牙设备的特征值变化事件
 *
 * @canUse onBLECharacteristicValueChange
 * @__callback [characteristicId, deviceId, serviceId, value]
 */
export const onBLECharacteristicValueChange: typeof Taro.onBLECharacteristicValueChange = (callback) => {
  const name = 'onBLECharacteristicValueChange'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  native.onBLECharacteristicValueChange(callback)
}
