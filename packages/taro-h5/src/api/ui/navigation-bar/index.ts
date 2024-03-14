import Taro from '@tarojs/api'
import { setNavigationBarLoading, setNavigationBarStyle, setTitle } from '@tarojs/router'

import { getParameterError, shouldBeObject, temporarilyNotSupport } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

// 导航栏
/**
 * 展示导航栏 loading 状态
*/
export function showNavigationBarLoading (options: Taro.showNavigationBarLoading.Option = {}) {
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'showNavigationBarLoading', success, fail, complete })
  setNavigationBarLoading(true)
  return handle.success()
}

export function setNavigationBarTitle (options?: Taro.setNavigationBarTitle.Option) {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `setNavigationBarTitle:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { title, success, fail, complete } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name: 'setNavigationBarTitle', success, fail, complete })

  if (!title || typeof title !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'title',
        correct: 'String',
        wrong: title
      })
    })
  }

  setTitle(title)

  return handle.success()
}

/**
 * 设置页面导航条颜色
 */
export const setNavigationBarColor: typeof Taro.setNavigationBarColor = (options) => {
  const { backgroundColor, frontColor, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'setNavigationBarColor', success, fail, complete })
  const meta = document.createElement('meta')
  meta.setAttribute('name', 'theme-color')
  meta.setAttribute('content', backgroundColor)
  document.head.appendChild(meta)
  setNavigationBarStyle({ frontColor, backgroundColor })
  return handle.success()
}

/**
 * 隐藏导航栏 loading 状态
*/
export function hideNavigationBarLoading (options: Taro.hideNavigationBarLoading.Option = {}) {
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'hideNavigationBarLoading', success, fail, complete })
  setNavigationBarLoading(false)
  return handle.success()
}

export const hideHomeButton = /* @__PURE__ */ temporarilyNotSupport('hideHomeButton')
