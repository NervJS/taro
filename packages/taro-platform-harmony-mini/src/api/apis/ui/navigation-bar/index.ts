import Taro from '@tarojs/api'
import { setTitle } from '@tarojs/router/dist/utils/navigate'

import { getParameterError, shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/**
 * 设置页面导航条标题
 * 
 * @canUse setNavigationBarTitle
 * @__object [title]
 */
export const setNavigationBarTitle: typeof Taro.hideNavigationBarLoading = (
  options?: Taro.setNavigationBarTitle.Option
) => {
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
        wrong: title,
      }),
    })
  }

  setTitle(title)
  return handle.success()
}

/**
 * 设置页面导航条颜色
 * 
 * @canUse setNavigationBarColor
 * @__object [backgroundColor, frontColor, animation]
 */
export const setNavigationBarColor: typeof Taro.setNavigationBarColor = (options) => {
  const apiName = 'setNavigationBarColor'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${apiName}:fail ${isObject.msg}` }
    return Promise.reject(res)
  }

  const { frontColor, backgroundColor, success, fail, complete, ...otherOptions } = options as Exclude<
    typeof options,
  undefined
  >
  const handle = new MethodHandler({ name: apiName, success, fail, complete })

  if (!frontColor || typeof frontColor !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'frontColor',
        correct: 'String',
        wrong: frontColor,
      }),
    })
  }

  if (frontColor && !['#000000', '#ffffff'].includes(frontColor)) {
    return handle.fail({
      errMsg: `invalid frontColor "${frontColor}"`,
    })
  }

  if (!backgroundColor || typeof backgroundColor !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'backgroundColor',
        correct: 'String',
        wrong: backgroundColor,
      }),
    })
  }
  // @ts-ignore
  native.setNavigationBarColor({ frontColor, backgroundColor, ...otherOptions })
  return handle.success()
}
