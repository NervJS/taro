import Taro from '@tarojs/api'
import { MethodHandler } from 'src/utils/handler'

import { shouldBeObject, temporarilyNotSupport } from '../../utils'

// 跳转
export const openEmbeddedMiniProgram = /* @__PURE__ */ temporarilyNotSupport('openEmbeddedMiniProgram')
export const navigateBackMiniProgram = /* @__PURE__ */ temporarilyNotSupport('navigateBackMiniProgram')
export const exitMiniProgram = /* @__PURE__ */ temporarilyNotSupport('exitMiniProgram')
export const openBusinessView = /* @__PURE__ */ temporarilyNotSupport('openBusinessView')

export const navigateToMiniProgram: typeof Taro.navigateToMiniProgram = (options) => {
  const apiName = 'navigateToMiniProgram'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${apiName}:fail ${isObject.msg}` }
    return Promise.reject(res)
  }
  const { success, fail, complete, ...otherOptions } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name: apiName, success, fail, complete })

  // @ts-ignore
  return native.navigateToMiniProgram(otherOptions).then(
    (res: any) => {
      handle.success(res)
    },
    (res: any) => {
      handle.fail(res)
    }
  )
}
