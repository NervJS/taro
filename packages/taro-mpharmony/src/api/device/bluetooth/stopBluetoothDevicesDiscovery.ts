import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const stopBluetoothDevicesDiscovery: typeof Taro.stopBluetoothDevicesDiscovery = (options) => {
  const name = 'stopBluetoothDevicesDiscovery'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    errMsg?: string
  }>({ name, success, fail, complete })

  return new Promise<Taro.stopBluetoothDevicesDiscovery.Promised>((resolve, reject) => {
    // @ts-ignore
    native.stopBluetoothDevicesDiscovery({
      success: (res: any) => {
        const result: TaroGeneral.BluetoothError = {
          /** 错误信息 */
          errMsg: res[0] === 0 ? `${name}:ok` : `${res[0]}`,
          /** 错误码 */
          errCode: 0
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      }
    })
  })
}
