import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 设置是否保持常亮状态
 * 
 * @canUse setKeepScreenOn
 * @__object [keepScreenOn]
 */
export const setKeepScreenOn: typeof Taro.setKeepScreenOn = (options) => {
  const name = 'setKeepScreenOn'
  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { keepScreenOn, success, fail, complete } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })
    if (typeof keepScreenOn !== 'boolean') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'value',
            correct: 'boolean',
            wrong: keepScreenOn,
          }),
        },
        { resolve, reject }
      )
    }
    // @ts-ignore
    native.setKeepScreenOn({
      keepScreenOn: keepScreenOn,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
