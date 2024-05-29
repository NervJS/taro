import Taro from '@tarojs/api'
import { navigateTo as navigateToH5, showModal } from '@tarojs/taro-h5'

import native from '../NativeApi'
import { shouldBeObject } from '../utils'
import { MethodHandler } from '../utils/handler'

/**
 * 打开另一个小程序
 *
 * @canUse navigateToMiniProgram
 * @__object [appId, path, extraData]
 */
export const navigateToMiniProgram: typeof Taro.navigateToMiniProgram = (options) => {
  const apiName = 'navigateToMiniProgram'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${apiName}:fail ${isObject.msg}` }
    return Promise.reject(res)
  }
  return new Promise((resolve, reject) => {
    const { success, fail, complete } = options as Exclude<typeof options, undefined>
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
          native.navigateToMiniProgram(options)
        } else {
          handle.fail({ errMsg: 'cancel' }, { resolve, reject })
        }
      },
    })
  })
}

const delay = 300
let lastExecuteTime = 0
let lastUrl

/**
 * 保留当前页面，跳转到应用内的某个页面。
 * 重复点击时 navigateTo 会重复跳转，因此进行限制。
 *
 * @canUse navigateTo
 * @__object [url, events]
 */
export function navigateTo (option: Taro.navigateTo.Option) {
  const targetUrl = option.url
  const executeTime = new Date().getTime()
  if (executeTime - lastExecuteTime < delay && lastUrl === targetUrl) {
    return Promise.resolve({ errMsg: 'navigateTo调用频率太高' })
  }
  lastExecuteTime = executeTime
  lastUrl = targetUrl
  return navigateToH5(option)
}
