import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取在蓝牙模块生效期间所有已发现的蓝牙设备
 * 
 * @canUse getBluetoothDevices
 * @__success [devices]
 */
export const getBluetoothDevices: typeof Taro.getBluetoothDevices = (options) => {
  const name = 'getBluetoothDevices'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler<{
    devices?: object
    errMsg?: string
  }>({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.getBluetoothDevices({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
