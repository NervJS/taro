import { shouleBeObject, getParameterError, isValidColor, successHandler, errorHandler } from '../utils'
import Taro from '../../taro'

let tabConf
let App

export function initTabBarApis (_App = {}) {
  tabConf = _App.state.__tabs
  App = _App
}

export function switchTab (options = {}) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `showTabBarRedDot${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { url, success, fail, complete } = options
  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroSwitchTab', {
      url,
      successHandler: res => {
        success && success(res)
        complete && complete(res)
        resolve(res)
      },
      errorHandler: res => {
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function setTabBarBadge (options = {}) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `setTabBarBadge${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    index,
    text,
    success,
    fail,
    complete
  } = options
  const res = { errMsg: 'setTabBarBadge:ok' }

  if (typeof index !== 'number') {
    res.errMsg = getParameterError({
      name: 'setTabBarBadge',
      para: 'index',
      correct: 'Number',
      wrong: index
    })
    console.error(res.errMsg)
    return errorHandler(fail, complete)(res)
  }

  if (typeof text !== 'string') {
    res.errMsg = getParameterError({
      name: 'setTabBarBadge',
      para: 'text',
      correct: 'String',
      wrong: index
    })
    console.error(res.errMsg)
    return errorHandler(fail, complete)(res)
  }

  Taro.eventCenter.trigger('__taroSetTabBarBadge', {
    index,
    text,
    successHandler: successHandler(success, complete),
    errorHandler: errorHandler(fail, complete)
  })

  return successHandler(success, complete)(res)
}

export function removeTabBarBadge (options = {}) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `removeTabBarBadge${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    index,
    success,
    fail,
    complete
  } = options
  const res = { errMsg: 'removeTabBarBadge:ok' }

  if (typeof index !== 'number') {
    res.errMsg = getParameterError({
      name: 'removeTabBarBadge',
      para: 'index',
      correct: 'Number',
      wrong: index
    })
    console.error(res.errMsg)
    return errorHandler(fail, complete)(res)
  }

  Taro.eventCenter.trigger('__taroRemoveTabBarBadge', {
    index,
    successHandler: successHandler(success, complete),
    errorHandler: errorHandler(fail, complete)
  })

  return successHandler(success, complete)(res)
}

export function showTabBarRedDot (options = {}) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `showTabBarRedDot${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    index,
    success,
    fail,
    complete
  } = options
  const res = { errMsg: 'showTabBarRedDot:ok' }

  if (typeof index !== 'number') {
    res.errMsg = getParameterError({
      name: 'showTabBarRedDot',
      para: 'index',
      correct: 'Number',
      wrong: index
    })
    console.error(res.errMsg)
    return errorHandler(fail, complete)(res)
  }

  Taro.eventCenter.trigger('__taroShowTabBarRedDotHandler', {
    index,
    successHandler: successHandler(success, complete),
    errorHandler: errorHandler(fail, complete)
  })

  return successHandler(success, complete)(res)
}

export function hideTabBarRedDot (options = {}) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `hideTabBarRedDot${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    index,
    success,
    fail,
    complete
  } = options
  const res = { errMsg: 'hideTabBarRedDot:ok' }

  if (typeof index !== 'number') {
    res.errMsg = getParameterError({
      name: 'hideTabBarRedDot',
      para: 'index',
      correct: 'Number',
      wrong: index
    })
    console.error(res.errMsg)
    return errorHandler(fail, complete)(res)
  }

  Taro.eventCenter.trigger('__taroHideTabBarRedDotHandler', {
    index,
    successHandler: successHandler(success, complete),
    errorHandler: errorHandler(fail, complete)
  })

  return successHandler(success, complete)(res)
}

export function showTabBar (options = {}) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `showTabBar${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    animation,
    success,
    fail,
    complete
  } = options

  const res = { errMsg: 'showTabBar:ok' }

  if (options.hasOwnProperty('animation') && typeof animation !== 'boolean') {
    res.errMsg = getParameterError({
      name: 'showTabBar',
      para: 'animation',
      correct: 'Boolean',
      wrong: animation
    })
    console.error(res.errMsg)
    return errorHandler(fail, complete)(res)
  }

  Taro.eventCenter.trigger('__taroShowTabBar', {
    animation,
    successHandler: successHandler(success, complete),
    errorHandler: errorHandler(success, complete),
  })

  return successHandler(success, complete)(res)
}

export function hideTabBar (options = {}) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `hideTabBar${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    animation,
    success,
    fail,
    complete
  } = options

  const res = { errMsg: 'hideTabBar:ok' }

  if (options.hasOwnProperty('animation') && typeof animation !== 'boolean') {
    res.errMsg = getParameterError({
      name: 'hideTabBar',
      para: 'animation',
      correct: 'Boolean',
      wrong: animation
    })
    console.error(res.errMsg)
    return errorHandler(fail, complete)(res)
  }

  Taro.eventCenter.trigger('__taroHideTabBar', {
    animation,
    successHandler: successHandler(success, complete),
    errorHandler: errorHandler(success, complete)
  })

  return successHandler(success, complete)(res)
}

export function setTabBarStyle (options = {}) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `setTabBarStyle${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    color,
    selectedColor,
    backgroundColor,
    borderStyle,
    success,
    fail,
    complete
  } = options
  const res = { errMsg: 'setTabBarStyle:ok' }

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
    res.errMsg = `setTabBarStyle:fail invalid ${errMsg}`
    return errorHandler(fail, complete)(res)
  }

  if (!tabConf) {
    res.errMsg = 'setTabBarStyle:fail'
    return Promise.reject(res)
  }

  const obj = {}
  if (color) obj.color = color
  if (selectedColor) obj.selectedColor = selectedColor
  if (backgroundColor) obj.backgroundColor = backgroundColor
  if (borderStyle) obj.borderStyle = borderStyle

  const temp = Object.assign({}, tabConf, obj)
  App.setState && App.setState({ __tabs: temp })

  return successHandler(success, complete)(res)
}

export function setTabBarItem (options = {}) {
  // options must be an Object
  const isObject = shouleBeObject(options)
  if (!isObject.res) {
    const res = { errMsg: `setTabBarItem${isObject.msg}` }
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
  const res = { errMsg: 'setTabBarItem:ok' }

  if (typeof index !== 'number') {
    res.errMsg = getParameterError({
      name: 'setTabBarItem',
      para: 'index',
      correct: 'Number',
      wrong: index
    })
    console.error(res.errMsg)
    return errorHandler(fail, complete)(res)
  }

  if (
    !tabConf ||
    !tabConf.list ||
    !tabConf.list[index]
  ) {
    res.errMsg = 'setTabBarItem:fail tabbar item not found'
    return errorHandler(fail, complete)(res)
  }

  const obj = {}
  if (text) obj.text = text
  if (iconPath) obj.iconPath = iconPath
  if (selectedIconPath) obj.selectedIconPath = selectedIconPath

  const temp = Object.assign({}, tabConf)
  temp.list[index] = Object.assign({}, temp.list[index], obj)

  App.setState && App.setState({ __tabs: temp })

  return successHandler(success, complete)(res)
}
