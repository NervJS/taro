import Taro from '@tarojs/api'
import { setTitle } from '@tarojs/router/dist/utils/navigate'

import { getParameterError, shouldBeObject, temporarilyNotSupport } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

// 导航栏
export const showNavigationBarLoading = temporarilyNotSupport('showNavigationBarLoading')

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
  const { backgroundColor, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'setNavigationBarColor', success, fail, complete })
  const meta = document.createElement('meta')
  meta.setAttribute('name', 'theme-color')
  meta.setAttribute('content', backgroundColor)
  document.head.appendChild(meta)
  return handle.success()
}

export const hideNavigationBarLoading = temporarilyNotSupport('hideNavigationBarLoading')
export const hideHomeButton = temporarilyNotSupport('hideHomeButton')
