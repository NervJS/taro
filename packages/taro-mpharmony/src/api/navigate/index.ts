import Taro from '@tarojs/api'
import { MethodHandler } from 'src/utils/handler'

import { shouldBeObject, temporarilyNotSupport } from '../../utils'
import { showModal } from '../ui/index'

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
  return new Promise((resolve, reject) => {
    const { success, fail, complete, ...otherOptions } = options as Exclude<typeof options, undefined>
    const handle = new MethodHandler({ name: apiName, success, fail, complete })

    showModal({
      content: `即将打开${options.appId}应用`,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000',
      confirmText: '允许',
      confirmColor: '#0000ff',
      fail: () => {
        handle.fail({ errMsg: 'showModal error' }, { resolve, reject })
      },
      success: (res) => {
        if (res.confirm) {
          // @ts-ignore
          native.navigateToMiniProgram(otherOptions).then(
            (res: any) => {
              handle.success(res, { resolve, reject })
            },
            (res: any) => {
              handle.fail(res, { resolve, reject })
            }
          )
        } else {
          handle.fail({ errMsg: 'cancel' }, { resolve, reject })
        }
      },
    })
  })
}
