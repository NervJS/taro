import { eventCenter } from '@tarojs/runtime'

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
  const handle = new MethodHandler({ name: 'setNavigationBarColor', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroNavigationStyle', {
      animation: options.animation,
      backgroundColor: options.backgroundColor,
      frontColor: options.frontColor,
    })

    return handle.success({}, { resolve, reject })
  })
}

export const showNavigationBarLoading: typeof Taro.setNavigationBarColor = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'showNavigationBarLoading', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroNavigationStyle', {
      loading: true,
    })

    return handle.success({}, { resolve, reject })
  })
}

export const hideNavigationBarLoading: typeof Taro.hideNavigationBarLoading = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'hideNavigationBarLoading', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroNavigationStyle', {
      loading: false,
    })

    return handle.success({}, { resolve, reject })
  })
}

export const hideHomeButton: typeof Taro.hideHomeButton = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'hideHomeButton', success, fail, complete })

  return new Promise((resolve, reject) => {
    eventCenter.trigger('__taroNavigationStyle', {
      home: false,
    })

    return handle.success({}, { resolve, reject })
  })
}
