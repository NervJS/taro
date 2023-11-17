import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 开始搜寻附近的蓝牙外围设备
 * 
 * @canUse startBluetoothDevicesDiscovery
 * @__object [allowDuplicatesKey, interval, services]
 */
export const startBluetoothDevicesDiscovery: typeof Taro.startBluetoothDevicesDiscovery = (options) => {
  const name = 'startBluetoothDevicesDiscovery'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { allowDuplicatesKey, interval, services, success, fail, complete } = options as Exclude<
    typeof options,
  undefined
  >

  const handle = new MethodHandler<{
    errMsg?: string
  }>({ name, success, fail, complete })

  return new Promise<Taro.startBluetoothDevicesDiscovery.Promised>((resolve, reject) => {
    // @ts-ignore
    native.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: allowDuplicatesKey,
      interval: interval,
      services: services,
      success: (res: any) => {
        const result: TaroGeneral.BluetoothError = {
          /** 错误信息 */
          errMsg: res[0] === 0 ? `${name}:ok` : `${res[0]}`,
          /** 错误码 */
          errCode: 0,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
