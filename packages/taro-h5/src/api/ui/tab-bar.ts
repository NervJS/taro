import Taro, { AppConfig } from '@tarojs/api'

import { getParameterError, isValidColor, shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'

let tabConf

export function initTabBarApis (config: AppConfig = {}) {
  tabConf = config.tabBar
}

/**
 * 显示 tabBar 某一项的右上角的红点
 */
export const showTabBarRedDot: typeof Taro.showTabBarRedDot = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `showTabBarRedDot:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    index,
    success,
    fail,
    complete
  } = options
  const handle = new MethodHandler({ name: 'showTabBarRedDot', success, fail, complete })

  if (typeof index !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'index',
        correct: 'Number',
        wrong: index
      })
    })
  }

  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroShowTabBarRedDotHandler', {
      index,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

/**
 * 显示 tabBar
 */
export const showTabBar: typeof Taro.showTabBar = (options = {}) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `showTabBar:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { animation, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'showTabBar', success, fail, complete })

  if (options.hasOwnProperty('animation') && typeof animation !== 'boolean') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'animation',
        correct: 'Boolean',
        wrong: animation
      })
    })
  }

  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroShowTabBar', {
      animation,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

/**
 * 动态设置 tabBar 的整体样式
 */
export const setTabBarStyle: typeof Taro.setTabBarStyle = (options = {}) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `setTabBarStyle:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { color, selectedColor, backgroundColor, borderStyle, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'setTabBarStyle', success, fail, complete })

  let errMsg
  if (color && !isValidColor(color)) {
    errMsg = 'color'
  } else if (selectedColor && !isValidColor(selectedColor)) {
    errMsg = 'selectedColor'
  } else if (backgroundColor && !isValidColor(backgroundColor)) {
    errMsg = 'backgroundColor'
  } else if (borderStyle && !/^(black|white)$/.test(borderStyle)) {
    errMsg = 'borderStyle'
  }

  if (errMsg) {
    return handle.fail({ errMsg: `invalid ${errMsg}` })
  }

  if (!tabConf) {
    return handle.fail()
  }

  const obj: Taro.setTabBarStyle.Option = {}
  if (color) obj.color = color
  if (selectedColor) obj.selectedColor = selectedColor
  if (backgroundColor) obj.backgroundColor = backgroundColor
  if (borderStyle) obj.borderStyle = borderStyle

  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroSetTabBarStyle', {
      color,
      selectedColor,
      backgroundColor,
      borderStyle,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

/**
 * 动态设置 tabBar 某一项的内容
 */
export const setTabBarItem: typeof Taro.setTabBarItem = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `setTabBarItem:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    index,
    text,
    iconPath,
    selectedIconPath,
    success,
    fail,
    complete
  } = options
  const handle = new MethodHandler({ name: 'setTabBarItem', success, fail, complete })

  if (typeof index !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'index',
        correct: 'Number',
        wrong: index
      })
    })
  }

  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroSetTabBarItem', {
      index,
      text,
      iconPath,
      selectedIconPath,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

/**
 * 为 tabBar 某一项的右上角添加文本
 */
export const setTabBarBadge: typeof Taro.setTabBarBadge = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `setTabBarBadge:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { index, text, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'setTabBarBadge', success, fail, complete })

  if (typeof index !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'index',
        correct: 'Number',
        wrong: index
      })
    })
  }

  if (typeof text !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'text',
        correct: 'String',
        wrong: text
      })
    })
  }

  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroSetTabBarBadge', {
      index,
      text: text.replace(/[\u0391-\uFFE5]/g, 'aa').length > 4 ? '...' : text,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

/**
 * 移除 tabBar 某一项右上角的文本
 */
export const removeTabBarBadge: typeof Taro.removeTabBarBadge = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `removeTabBarBadge:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { index, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'removeTabBarBadge', success, fail, complete })

  if (typeof index !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'index',
        correct: 'Number',
        wrong: index
      })
    })
  }

  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroRemoveTabBarBadge', {
      index,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

/**
 * 隐藏 tabBar 某一项的右上角的红点
 */
export const hideTabBarRedDot: typeof Taro.hideTabBarRedDot = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `hideTabBarRedDot:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { index, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'hideTabBarRedDot', success, fail, complete })

  if (typeof index !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'index',
        correct: 'Number',
        wrong: index
      })
    })
  }

  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroHideTabBarRedDotHandler', {
      index,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

/**
 * 隐藏 tabBar
 */
export const hideTabBar: typeof Taro.hideTabBar = (options = {}) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `hideTabBar:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { animation, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'hideTabBar', success, fail, complete })

  if (options.hasOwnProperty('animation') && typeof animation !== 'boolean') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'animation',
        correct: 'Boolean',
        wrong: animation
      })
    })
  }

  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroHideTabBar', {
      animation,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}
