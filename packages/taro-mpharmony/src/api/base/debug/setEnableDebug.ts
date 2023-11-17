import Taro from '@tarojs/api'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 设置是否打开调试开关
 * 
 * @canUse setEnableDebug
 * @null_implementation
 */
export const setEnableDebug: typeof Taro.setEnableDebug = (options) => {
  const name = 'setEnableDebug'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { success, fail, complete } = options as Exclude<typeof options, undefined>
    const handle = new MethodHandler<{
      errMsg?: string
    }>({ name, success, fail, complete })
    try {
      handle.success({
        errMsg: 'ok'
      }, { resolve, reject })
    } catch (error) {
      handle.fail({
        errMsg: 'fail'
      }, { resolve, reject })
    }
  })
}