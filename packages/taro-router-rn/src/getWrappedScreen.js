import React from 'react'
import queryString from 'query-string'
import RefreshProvider from './RefreshProvider'

/**
 * @description 包裹页面 Screen 组件，处理生命周期，注入方法
 * @param Screen 页面的组件
 * @param Taro 挂在方法到 Taro 上
 * @returns {WrappedScreen}
 */
function getWrappedScreen (Screen, Taro, {enablePullDownRefresh}) {
  class WrappedScreen extends Screen {
    constructor (props, context) {
      super(props, context)
      this.refreshProviderRef = React.createRef()
      // 这样处理不一定合理，
      // 有时间看一下 react-navigation 内部的实现机制再优化
      Taro.navigateTo = this.wxNavigateTo.bind(this)
      Taro.redirectTo = this.wxRedirectTo.bind(this)
      Taro.navigateBack = this.wxNavigateBack.bind(this)
      Taro.switchTab = this.wxSwitchTab.bind(this)
      Taro.getCurrentPages = this.wxGetCurrentPages.bind(this)
    }

    componentDidMount () {
      try {
        Taro.startPullDownRefresh = this.refreshProviderRef.current && this.refreshProviderRef.current.handlePullDownRefresh
        Taro.stopPullDownRefresh = this.refreshProviderRef.current && this.refreshProviderRef.current.stopPullDownRefresh
      } catch (e) {
        console.log('this.refreshProviderRef: ')
        console.log(this.refreshProviderRef)
        throw e
      }
      super.componentDidMount && super.componentDidMount()
      super.componentDidShow && super.componentDidShow()
    }

    componentWillUnmount () {
      super.componentDidHide && super.componentDidHide()
      super.componentWillUnmount && super.componentWillUnmount()
    }

    wxNavigateTo ({url, success, fail, complete}) {
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

    wxRedirectTo ({url, success, fail, complete}) {
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

    wxSwitchTab ({url, success, fail, complete}) {
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

    wxNavigateBack ({delta = 1}) {
      while (delta > 0) {
        this.props.navigation.goBack()
        delta--
      }
    }

    wxGetCurrentPages () {
      let parentState = this.props.navigation.dangerouslyGetParent().state
      if (parentState && parentState.routes) {
        return parentState.routes.map(item => item.routeName)
      } else {
        return []
      }
    }

    render () {
      // if (enablePullDownRefresh || (Screen.navigationOptions && Screen.navigationOptions.enablePullDownRefresh)) {
      let isScreenEnablePullDownRefresh = enablePullDownRefresh || (Screen.navigationOptions && Screen.navigationOptions.enablePullDownRefresh)
      return (
        <RefreshProvider
          enablePullDownRefresh={isScreenEnablePullDownRefresh}
          onPullDownRefresh={this.onPullDownRefresh && this.onPullDownRefresh.bind(this)}
          onReachBottom={this.onReachBottom && this.onReachBottom.bind(this)}
          onScroll={this.onScroll && this.onScroll.bind(this)}
          ref={this.refreshProviderRef}
        >
          {super.render()}
        </RefreshProvider>
      )
      // } else {
      //   console.log('not enablePullDownRefresh')
      //   return super.render()
      // }
    }
  }

  return WrappedScreen
}

export default getWrappedScreen
