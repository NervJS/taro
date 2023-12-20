import { eventCenter } from '@tarojs/runtime/dist/runtime.esm'

import { temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

import type Taro from '@tarojs/taro/types'

export const setNavigationBarTitle: typeof Taro.setNavigationBarTitle = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'setNavigationBarTitle', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroNavigationStyle', {
      title: options.title,
    })

    return handle.success({}, { resolve, reject })
  })
}

export const setNavigationBarColor: typeof Taro.setNavigationBarColor = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'setNavigationBarTitle', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroNavigationStyle', {
      animation: options.animation,
      backgroundColor: options.backgroundColor,
      frontColor: options.frontColor,
    })

    return handle.success({}, { resolve, reject })
  })
}

export const showNavigationBarLoading = temporarilyNotSupport('showNavigationBarLoading')
export const hideNavigationBarLoading = temporarilyNotSupport('hideNavigationBarLoading')
export const hideHomeButton = temporarilyNotSupport('hideHomeButton')
