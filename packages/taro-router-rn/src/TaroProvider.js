import React from 'react'
import RefreshProvider from './RefreshProvider'
import { errorHandler, successHandler, shouleBeObject, getParameterError } from './utils'

const queryString = require('query-string')

class TaroProvider extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.refreshProviderRef = React.createRef()
  }

  navigationMethodInit () {
    const { Taro } = this.props
    Taro.navigateTo = this.wxNavigateTo.bind(this)
    Taro.redirectTo = this.wxRedirectTo.bind(this)
    Taro.navigateBack = this.wxNavigateBack.bind(this)
    Taro.switchTab = this.wxSwitchTab.bind(this)
    Taro.getCurrentPages = this.wxGetCurrentPages.bind(this)
    Taro.reLaunch = this.wxReLaunch.bind(this)
    Taro.showTabBar = this.showTabBar.bind(this)
    Taro.hideTabBar = this.hideTabBar.bind(this)
    Taro.showTabBarRedDot = this.showTabBarRedDot.bind(this)
    Taro.hideTabBarRedDot = this.hideTabBarRedDot.bind(this)
    Taro.setTabBarBadge = this.setTabBarBadge.bind(this)
    Taro.removeTabBarBadge = this.removeTabBarBadge.bind(this)
    Taro.setTabBarItem = this.setTabBarItem.bind(this)
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillMount () {
    this.navigationMethodInit()
    // didFocus
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      () => {
        // 页面进入后回退并不会调用 React 生命周期，需要在路由生命周期中绑定 this
        this.navigationMethodInit()
      }
    )
  }

  componentDidMount () {
    const { Taro } = this.props
    try {
      Taro.startPullDownRefresh = this.refreshProviderRef.current && this.refreshProviderRef.current.handlePullDownRefresh
      Taro.stopPullDownRefresh = this.refreshProviderRef.current && this.refreshProviderRef.current.stopPullDownRefresh
      Taro.pageScrollTo = this.refreshProviderRef.current && this.refreshProviderRef.current.pageScrollTo
    } catch (e) {
      console.warn('this.refreshProviderRef: ')
      console.warn(this.refreshProviderRef)
      throw e
    }
  }

  wxNavigateTo (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `navigateTo${isObject.msg}` }
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    const res = { errMsg: 'navigateTo:ok' }
    let { url, success, fail, complete } = options

    if (url.startsWith('/')) {
      url = url.substr(1)
    }

    const obj = queryString.parseUrl(url)
    console.warn(obj)
    try {
      this.props.navigation.push(obj.url, obj.query)
    } catch (e) {
      return errorHandler(fail, complete)({ errMsg: e })
    }
    return successHandler(success, complete)(res)
  }

  wxRedirectTo (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `redirectTo${isObject.msg}` }
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    const res = { errMsg: 'redirectTo:ok' }
    let { url, success, fail, complete } = options

    if (url.startsWith('/')) {
      url = url.substr(1)
    }

    const obj = queryString.parseUrl(url)
    console.warn(obj)
    try {
      this.props.navigation.replace(obj.url, obj.query)
    } catch (e) {
      return errorHandler(fail, complete)({ errMsg: e })
    }
    return successHandler(success, complete)(res)
  }

  wxSwitchTab (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `switchTab${isObject.msg}` }
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    const res = { errMsg: 'switchTab:ok' }
    let { url, success, fail, complete } = options

    if (url.startsWith('/')) {
      url = url.substr(1)
    }

    const obj = queryString.parseUrl(url)
    console.warn(obj)
    try {
      this.props.navigation.navigate(obj.url, obj.query)
    } catch (e) {
      return errorHandler(fail, complete)({ errMsg: e })
    }
    return successHandler(success, complete)(res)
  }

  wxNavigateBack (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `navigateBack${isObject.msg}` }
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    const res = { errMsg: 'navigateBack:ok' }

    const { delta = 1, success, fail, complete } = options

    try {
      this.props.navigation.pop(delta)
    } catch (e) {
      return errorHandler(fail, complete)({ errMsg: e })
    }
    return successHandler(success, complete)(res)
  }

  wxGetCurrentPages () {
    const parentState = this.props.navigation.dangerouslyGetParent().state
    if (parentState && parentState.routes) {
      return parentState.routes.map(item => { return { route: item.routeName } })
    } else {
      return []
    }
  }

  /**
   * @description
   * @param options
   * @param {string} options.string 需要跳转的应用内页面路径，路径后可以带参数。
   */
  wxReLaunch (options = {}) {
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `reLaunch${isObject.msg}` }
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    const res = { errMsg: 'reLaunch:ok' }
    const { url, success, fail, complete } = options

    const pages = this.wxGetCurrentPages()
    const length = pages.length

    try {
      if (length > 0) {
        this.wxNavigateBack({ delta: length })
      }
      this.wxRedirectTo({ url })
    } catch (e) {
      return errorHandler(fail, complete)({ errMsg: e })
    }
    return successHandler(success, complete)(res)
  }

  /**
   * @todo
   * @description 动态设置 tabBar 的整体样式
   * @param options
   * @param {string} options.color - tab 上的文字默认颜色，HexColor
   * @param {string} options.selectedColor - tab 上的文字选中时的颜色，HexColor
   * @param {string} options.backgroundColor - tab 的背景色，HexColor
   * @param {string} options.borderStyle - tabBar上边框的颜色， 仅支持 black/white
   */
  setTabBarStyle (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `setTabBarStyle${isObject.msg}` }
      console.warn(res.errMsg)
      return Promise.reject(res)
    }
    console.warn('not finished')
  }

  /**
   * @description 动态设置 tabBar 某一项的内容，2.7.0 起图片支持临时文件和网络文件
   * @param options
   * @param {number} options.index - tabBar 的哪一项，从左边算起
   * @param {string} [options.text]- tab 上的按钮文字
   * @param {string} [options.iconPath]- 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效
   * @param {string} [options.selectedIconPath]- 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
   * @returns {*}
   */
  setTabBarItem (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `setTabBarItem${isObject.msg}` }
      console.warn(res.errMsg)
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

    try {
      const _taroTabBarIconConfig = global._taroTabBarIconConfig || {}
      _taroTabBarIconConfig[index] = Object.assign({}, _taroTabBarIconConfig[index],
        { itemText: text, itemSelectedIconPath: selectedIconPath, itemIconPath: iconPath })
      // react-navigation 暂未开放 Dynamic tab setup ，不推荐 @TODO
      global._taroTabBarIconConfig = _taroTabBarIconConfig
      this.props.navigation.setParams({ _taroTabBarIconConfig })
    } catch (e) {
      console.warn(e)
      return errorHandler(fail, complete)(res)
    }
    return successHandler(success, complete)(res)
  }

  /**
   * @description 为 tabBar 某一项的右上角添加文本
   * @param options
   * @param {number} options.index tabBar 的哪一项，从左边算起
   * @param {string} options.string 显示的文本，超过 4 个字符则显示成 ...
   * @returns {*}
   */
  setTabBarBadge (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `setTabBarBadge${isObject.msg}` }
      console.warn(res.errMsg)
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

    try {
      const _taroTabBarIconConfig = global._taroTabBarIconConfig || {}
      _taroTabBarIconConfig[index] = Object.assign({}, _taroTabBarIconConfig[index], { isBadgeShow: true, badgeText: text })
      // react-navigation 暂未开放 Dynamic tab setup ，不推荐 @TODO
      global._taroTabBarIconConfig = _taroTabBarIconConfig
      this.props.navigation.setParams({ _taroTabBarIconConfig })
    } catch (e) {
      console.warn(e)
      return errorHandler(fail, complete)(res)
    }
    return successHandler(success, complete)(res)
  }

  /**
   * @description 移除 tabBar 某一项右上角的文本
   * @param options
   * @param {number} options.index tabBar 的哪一项，从左边算起
   */
  removeTabBarBadge (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `removeTabBarBadge${isObject.msg}` }
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    const {
      index,
      success,
      fail,
      complete
    } = options

    const res = { errMsg: 'hideTabBarRedDot:ok' }

    try {
      const _taroTabBarIconConfig = global._taroTabBarIconConfig || {}
      _taroTabBarIconConfig[index] = Object.assign({}, _taroTabBarIconConfig[index], { isBadgeShow: false, badgeText: '' })
      // react-navigation 暂未开放 Dynamic tab setup ，不推荐 @TODO
      global._taroTabBarIconConfig = _taroTabBarIconConfig
      this.props.navigation.setParams({ _taroTabBarIconConfig })
    } catch (e) {
      console.warn(e)
      return errorHandler(fail, complete)(res)
    }
    return successHandler(success, complete)(res)
  }

  /**
   * @description 显示 tabBar 某一项的右上角的红点
   * @param options
   * @param {number} options.index - tabBar 的哪一项，从左边算起
   * @returns {*}
   */
  showTabBarRedDot (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `showTabBarRedDot${isObject.msg}` }
      console.warn(res.errMsg)
      return Promise.reject(res)
    }
    const {
      index,
      success,
      fail,
      complete
    } = options

    const res = { errMsg: 'showTabBarRedDot:ok' }

    try {
      const _taroTabBarIconConfig = global._taroTabBarIconConfig || {}
      _taroTabBarIconConfig[index] = Object.assign({}, _taroTabBarIconConfig[index], { isRedDotShow: true })
      global._taroTabBarIconConfig = _taroTabBarIconConfig
      this.props.navigation.setParams({ _taroTabBarIconConfig })
    } catch (e) {
      console.warn(e)
      return errorHandler(fail, complete)(res)
    }
    return successHandler(success, complete)(res)
  }

  /**
   * @description 隐藏 tabBar 某一项的右上角的红点
   * @param options
   * @param {number} options.index - tabBar 的哪一项，从左边算起
   * @returns {*}
   */
  hideTabBarRedDot (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `hideTabBarRedDot${isObject.msg}` }
      console.warn(res.errMsg)
      return Promise.reject(res)
    }
    const {
      index,
      success,
      fail,
      complete
    } = options

    const res = { errMsg: 'hideTabBarRedDot:ok' }

    try {
      const _taroTabBarIconConfig = global._taroTabBarIconConfig || {}
      _taroTabBarIconConfig[index] = Object.assign({}, _taroTabBarIconConfig[index], { isRedDotShow: false })
      // react-navigation 暂未开放 Dynamic tab setup ，不推荐 @TODO
      global._taroTabBarIconConfig = _taroTabBarIconConfig
      this.props.navigation.setParams({ _taroTabBarIconConfig })
    } catch (e) {
      console.warn(e)
      return errorHandler(fail, complete)(res)
    }
    return successHandler(success, complete)(res)
  }

  /**
   * @description 显示 tabBar
   * @param options
   * @param {boolean} [options.animation=false] - 是否需要动画效果
   * @returns {*}
   */
  showTabBar (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `showTabBar${isObject.msg}` }
      console.warn(res.errMsg)
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
      console.warn(res.errMsg)
      return errorHandler(fail, complete)(res)
    }

    try {
      this.props.navigation.setParams({ _tabBarVisible: true })
    } catch (e) {
      console.warn(e)
      return errorHandler(fail, complete)(res)
    }
    return successHandler(success, complete)(res)
  }

  /**
   * @description 隐藏 tabBar
   * @param options
   * @param {boolean} [options.animation=false] - 是否需要动画效果
   * @returns {*}
   */
  hideTabBar (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = { errMsg: `showTabBar${isObject.msg}` }
      console.warn(res.errMsg)
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

    try {
      this.props.navigation.setParams({ _tabBarVisible: false })
    } catch (e) {
      console.warn(e)
      return errorHandler(fail, complete)({ errMsg: e })
    }

    return successHandler(success, complete)(res)
  }

  componentWillUnmount () {
    // Remove the listener when you are done
    this.didFocusSubscription && this.didFocusSubscription.remove()
  }

  render () {
    return (
      <RefreshProvider
        ref={this.refreshProviderRef}
        {...this.props}
      >
        {this.props.children}
      </RefreshProvider>
    )
  }
}

export default TaroProvider
