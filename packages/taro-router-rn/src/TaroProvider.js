import React from 'react'
import queryString from 'query-string'
import RefreshProvider from './RefreshProvider'
import Taro from '../../taro-rn/src'
import { errorHandler, successHandler, shouleBeObject, getParameterError } from './utils'

class TaroProvider extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.refreshProviderRef = React.createRef()
  }

  componentDidMount () {
    let {Taro} = this.props
    // didFocus
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        // 页面进入后回退并不会调用 React 生命周期，需要在路由生命周期中绑定 this
        Taro.navigateTo = this.wxNavigateTo.bind(this)
        Taro.redirectTo = this.wxRedirectTo.bind(this)
        Taro.navigateBack = this.wxNavigateBack.bind(this)
        Taro.switchTab = this.wxSwitchTab.bind(this)
        Taro.getCurrentPages = this.wxGetCurrentPages.bind(this)
        Taro.showTabBar = this.showTabBar.bind(this)
        Taro.hideTabBar = this.hideTabBar.bind(this)
      }
    )
    try {
      Taro.startPullDownRefresh = this.refreshProviderRef.current && this.refreshProviderRef.current.handlePullDownRefresh
      Taro.stopPullDownRefresh = this.refreshProviderRef.current && this.refreshProviderRef.current.stopPullDownRefresh
    } catch (e) {
      console.log('this.refreshProviderRef: ')
      console.log(this.refreshProviderRef)
      throw e
    }
  }

  wxNavigateTo (params) {
    if (typeof params !== 'object') {
      console.warn('Taro.NavigateTo 参数必须为 object')
      return
    }
    let {url, success, fail, complete} = params
    if (url.startsWith('/')) {
      url = url.substr(1)
    }

    let obj = queryString.parseUrl(url)
    console.log(obj)
    try {
      this.props.navigation.push(obj.url, obj.query)
    } catch (e) {
      fail && fail(e)
      complete && complete(e)
      throw e
    }
    success && success()
    complete && complete()
  }

  wxRedirectTo (params) {
    if (typeof params !== 'object') {
      console.warn('Taro.RedirectTo 参数必须为 object')
      return
    }
    let {url, success, fail, complete} = params
    if (url.startsWith('/')) {
      url = url.substr(1)
    }

    let obj = queryString.parseUrl(url)
    console.log(obj)
    try {
      this.props.navigation.replace(obj.url, obj.query)
    } catch (e) {
      fail && fail(e)
      complete && complete(e)
      throw e
    }
    success && success()
    complete && complete()
  }

  wxSwitchTab (params) {
    if (typeof params !== 'object') {
      console.warn('Taro.SwitchTab 参数必须为 object')
      return
    }
    let {url, success, fail, complete} = params
    if (url.startsWith('/')) {
      url = url.substr(1)
    }

    let obj = queryString.parseUrl(url)
    console.log(obj)
    try {
      this.props.navigation.navigate(obj.url, obj.query)
    } catch (e) {
      fail && fail(e)
      complete && complete(e)
      throw e
    }
    success && success()
    complete && complete()
  }

  wxNavigateBack (params = {}) {
    if (typeof params !== 'object') {
      console.warn('Taro.NavigateBack 参数必须为 object')
      return
    }
    let {delta = 1} = params
    this.props.navigation.pop(delta)
  }

  wxGetCurrentPages () {
    let parentState = this.props.navigation.dangerouslyGetParent().state
    if (parentState && parentState.routes) {
      return parentState.routes.map(item => item.routeName)
    } else {
      return []
    }
  }

  showTabBar (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = {errMsg: `showTabBar${isObject.msg}`}
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    const {
      animation,
      success,
      fail,
      complete
    } = options

    const res = {errMsg: 'showTabBar:ok'}

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
      this.props.navigation.setParams({_tabBarVisible: true})
    } catch (e) {
      console.log(e)
      errorHandler(fail, complete)(res)
    }

    return successHandler(success, complete)(res)
  }

  hideTabBar (options = {}) {
    // options must be an Object
    const isObject = shouleBeObject(options)
    if (!isObject.res) {
      const res = {errMsg: `showTabBar${isObject.msg}`}
      console.warn(res.errMsg)
      return Promise.reject(res)
    }

    const {
      animation,
      success,
      fail,
      complete
    } = options

    const res = {errMsg: 'showTabBar:ok'}

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
      this.props.navigation.setParams({_tabBarVisible: false})
    } catch (e) {
      console.log(e)
      errorHandler(fail, complete)({errMsg: e})
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
