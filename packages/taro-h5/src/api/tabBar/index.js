import { shouleBeObject, getParameterError } from '../utils'

function initTabBarApis (App = {}, Taro = {}) {
  function setTabBarBadge (options = {}) {
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
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    if (typeof text !== 'string') {
      res.errMsg = getParameterError({
        name: 'setTabBarBadge',
        para: 'text',
        correct: 'String',
        wrong: index
      })
      console.error(res.errMsg)
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  function removeTabBarBadge (options = {}) {
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
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  function showTabBarRedDot (options = {}) {
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
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  function hideTabBarRedDot (options = {}) {
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
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  function showTabBar (options = {}) {
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
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  function hideTabBar (options = {}) {
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
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  function setTabBarStyle (options = {}) {
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
    if (color && !/^#\d{6}$/.test(color)) {
      errMsg = 'color'
    } else if (selectedColor && !/^#\d{6}$/.test(selectedColor)) {
      errMsg = 'selectedColor'
    } else if (backgroundColor && !/^#\d{6}$/.test(backgroundColor)) {
      errMsg = 'backgroundColor'
    } else if (borderStyle && !/^(black|white)$/.test(borderStyle)) {
      errMsg = 'borderStyle'
    }

    if (errMsg) {
      res.errMsg = `setTabBarStyle:fail invalid ${errMsg}`
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    if (!App.state.__tabs) {
      res.errMsg = 'setTabBarStyle:fail'
      return Promise.reject(res)
    }

    const obj = {}
    if (color) obj.color = color
    if (selectedColor) obj.selectedColor = selectedColor
    if (backgroundColor) obj.backgroundColor = backgroundColor
    if (borderStyle) obj.borderStyle = borderStyle

    const temp = Object.assign({}, App.state.__tabs, obj)
    App.setState && App.setState({ __tabs: temp })

    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  function setTabBarItem (options = {}) {
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
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    if (
      !App.state.__tabs ||
      !App.state.__tabs.list ||
      !App.state.__tabs.list[index]
    ) {
      res.errMsg = 'setTabBarItem:fail tabbar item not found'
      typeof fail === 'function' && fail(res)
      typeof complete === 'function' && complete(res)
      return Promise.reject(res)
    }

    const obj = {}
    if (text) obj.text = text
    if (iconPath) obj.iconPath = iconPath
    if (selectedIconPath) obj.selectedIconPath = selectedIconPath

    const temp = Object.assign({}, App.state.__tabs)
    temp.list[index] = Object.assign({}, temp.list[index], obj)

    App.setState && App.setState({ __tabs: temp })

    typeof success === 'function' && success(res)
    typeof complete === 'function' && complete(res)
    return Promise.resolve(res)
  }

  // Taro.setTabBarBadge = setTabBarBadge
  // Taro.removeTabBarBadge = removeTabBarBadge
  // Taro.showTabBarRedDot = showTabBarRedDot
  // Taro.hideTabBarRedDot = hideTabBarRedDot
  // Taro.showTabBar = showTabBar
  // Taro.hideTabBar = hideTabBar
  Taro.setTabBarStyle = setTabBarStyle
  Taro.setTabBarItem = setTabBarItem
}

export {
  initTabBarApis
}
