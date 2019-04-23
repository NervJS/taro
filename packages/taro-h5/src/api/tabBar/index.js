import { shouleBeObject, getParameterError, isValidColor, successHandler, errorHandler } from '../utils'
import Taro from '../../taro'

let tabConf
let App

export function initTabBarApis (_App = {}) {
  tabConf = _App.state.__tabs
  App = _App
}

/**
 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
 * @param {Object} options
 * @param {string} options.url 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数。
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
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

/**
 * 为 tabBar 某一项的右上角添加文本
 * @param {Object} options
 * @param {number} options.index tabBar 的哪一项，从左边算起
 * @param {string} options.text 显示的文本，超过 4 个字符则显示成 ...
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
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
      wrong: text
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

/**
 * 移除 tabBar 某一项右上角的文本
 * @param {Object} options
 * @param {number} options.index tabBar 的哪一项，从左边算起
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
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

/**
 * 显示 tabBar 某一项的右上角的红点
 * @param {Object} options
 * @param {number} options.index tabBar 的哪一项，从左边算起
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
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

/**
 * 隐藏 tabBar 某一项的右上角的红点
 * @param {Object} options
 * @param {number} options.index tabBar 的哪一项，从左边算起
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
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

/**
 * 显示 tabBar
 * @param {Object} options
 * @param {boolean} [options.animation=false] 是否需要动画效果
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
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

/**
 * 隐藏 tabBar
 * @param {Object} options
 * @param {boolean} [options.animation=false] 是否需要动画效果
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
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

/**
 * 动态设置 tabBar 的整体样式
 * @param {Object} options 
 * @param {string} options.color tab 上的文字默认颜色，HexColor
 * @param {string} options.selectedColor tab 上的文字选中时的颜色，HexColor
 * @param {string} options.backgroundColor tab 的背景色，HexColor
 * @param {'black'|'white'} options.borderStyle tabBar上边框的颜色， 仅支持 black/white
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
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

/**
 * 动态设置 tabBar 某一项的内容
 * @param {Object} options 
 * @param {number} options.index tabBar 的哪一项，从左边算起
 * @param {string} [options.text] tab 上的按钮文字
 * @param {string} [options.iconPath] 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
 * @param {string} [options.selectedIconPath] 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
 * @param {function} [options.success] 接口调用成功的回调函数
 * @param {function} [options.fail] 接口调用失败的回调函数
 * @param {function} [options.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 */
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
