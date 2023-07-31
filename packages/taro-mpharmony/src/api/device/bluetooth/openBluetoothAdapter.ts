import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const openBluetoothAdapter: typeof Taro.openBluetoothAdapter = (options) => {
  const name = 'openBluetoothAdapter'

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

  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.openBluetoothAdapter({
      success: (res: any) => {
        const result: TaroGeneral.BluetoothError = {
          /** 错误信息 */
          errMsg: `${name}:${res[0]}`,
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
