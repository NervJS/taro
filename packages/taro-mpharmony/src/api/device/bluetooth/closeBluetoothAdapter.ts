import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 关闭蓝牙模块
 * 
 * @canUse closeBluetoothAdapter
 */
export const closeBluetoothAdapter: typeof Taro.closeBluetoothAdapter = (options) => {
  const name = 'closeBluetoothAdapter'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler<{
    errMsg?: string
  }>({ name, success, fail, complete })

  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.closeBluetoothAdapter({
      success: (res: any) => {
        const result: TaroGeneral.BluetoothError = {
          /** 错误信息 */
          errMsg: res[0] === 'ok' ? `${name}:${res[0]}` : res[0],
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
