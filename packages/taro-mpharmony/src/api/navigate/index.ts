import Taro from '@tarojs/api'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

import { showModal } from '../ui/index'

/**
 * 打开半屏小程序
 * 
 * @canNotUse openEmbeddedMiniProgram
 */
export { openEmbeddedMiniProgram } from '@tarojs/taro-h5'

/**
 * 返回到上一个小程序
 * 
 * @canNotUse navigateBackMiniProgram
 */
export { navigateBackMiniProgram } from '@tarojs/taro-h5'

/**
 * 退出当前小程序
 * 
 * @canNotUse exitMiniProgram
 */
export { exitMiniProgram } from '@tarojs/taro-h5'

/**
 * 打开微信支付分小程序，引导用户查看订单详情
 * 
 * @canNotUse openBusinessView
 */
export { openBusinessView } from '@tarojs/taro-h5'

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
