import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 在input、textarea等focus拉起键盘之后，手动调用此接口收起键盘
 * 
 * @canUse hideKeyboard
 */
export const hideKeyboard: typeof Taro.hideKeyboard = (options) => {
  const name = 'hideKeyboard'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore
      native.hideKeyboard()
      const result: TaroGeneral.CallbackResult = {
        errMsg: `${name}:ok`,
      }
      handle.success(result, { resolve, reject })
    } catch (exception) {
      const result: TaroGeneral.CallbackResult = {
        errMsg: `${name}:fail`,
      }
      handle.fail(result, { resolve, reject })
    }
  })
}
