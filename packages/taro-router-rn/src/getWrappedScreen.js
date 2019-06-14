import React from 'react'
import { View, Text, YellowBox } from 'react-native'
import LoadingView from './LoadingView'
import TaroProvider from './TaroProvider'
import { getNavigationOptions } from './utils'

/**
 * @description 包裹页面 Screen 组件，处理生命周期，注入方法
 * @param Screen 页面的组件，有可能是 react-redux 里面的 connect 包裹后的 Screen
 * @param Taro 挂在方法到 Taro 上
 * @param globalNavigationOptions 全局
 * @returns {WrappedScreen}
 */
function getWrappedScreen (Screen, Taro, globalNavigationOptions = {}) {
  class WrappedScreen extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.screenRef = React.createRef()
      // issue https://github.com/react-navigation/react-navigation/issues/3956
      YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'])
    }

    static navigationOptions = ({navigation}) => {
      const navigationOptions = getNavigationOptions(Screen.config)
      const title = navigation.getParam('title') || navigationOptions.title || globalNavigationOptions.title
      const rest = (navigationOptions.navigationStyle || globalNavigationOptions.navigationStyle) === 'custom' ? {header: null} : {}
      const headerTintColor = navigation.getParam('headerTintColor') || navigationOptions.headerTintColor || globalNavigationOptions.headerTintColor
      return {
        ...rest,
        headerTitle: <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {navigation.getParam('isNavigationBarLoadingShow') && <LoadingView />}
          <Text style={{flexDirection: 'row', flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center', color: headerTintColor}}>{title}</Text>
        </View>,
        headerTintColor,
        headerStyle: {
          backgroundColor: navigation.getParam('backgroundColor') || navigationOptions.backgroundColor || globalNavigationOptions.backgroundColor
        }
      }
    }

    /**
     * @description 如果 Screen 被包裹过（如：@connect），
     * 需提供获取包裹前 Screen 实例的方法 getWrappedInstance 并暴露出被包裹组件的 config
     * @returns {*}
     */
    getScreenInstance () {
      if (this.screenRef.current && this.screenRef.current.getWrappedInstance) {
        return this.screenRef.current.getWrappedInstance() || {}
      } else {
        return this.screenRef.current || {}
      }
    }

    showNavigationBarLoading (obj) {
      const {success, fail, complete} = obj || {}
      try {
        this.props.navigation.setParams({isNavigationBarLoadingShow: true})
        success && success()
        complete && complete()
      } catch (e) {
        fail && fail({errMsg: e.message})
        complete && complete({errMsg: e.message})
      }
    }

    hideNavigationBarLoading (obj) {
      const {success, fail, complete} = obj || {}
      try {
        this.props.navigation.setParams({isNavigationBarLoadingShow: false})
        success && success()
        complete && complete()
      } catch (e) {
        fail && fail({errMsg: e.message})
        complete && complete({errMsg: e.message})
      }
    }

    // TODO animation 动画效果支持
    setNavigationBarColor (obj) {
      if (typeof obj !== 'object') {
        console.warn('Taro.setNavigationBarColor 参数必须为 object')
        return
      }
      const {frontColor, backgroundColor, success, fail, complete} = obj
      if (this.props.navigation) {
        try {
          this.props.navigation.setParams({headerTintColor: frontColor, backgroundColor})
          success && success()
          complete && complete()
        } catch (e) {
          fail && fail({errMsg: e.message})
          complete && complete({errMsg: e.message})
        }
      } else {
        console.warn('this.props.navigation 不存在')
      }
    }

    setNavigationBarTitle (obj) {
      if (typeof obj !== 'object') {
        console.warn('Taro.setNavigationBarTitle 参数必须为 object')
        return
      }
      const {title, success, fail, complete} = obj
      if (this.props.navigation) {
        try {
          this.props.navigation.setParams({title})
          success && success()
          complete && complete()
        } catch (e) {
          fail && fail({errMsg: e.message})
          complete && complete({errMsg: e.message})
        }
      } else {
        console.warn('this.props.navigation 不存在')
      }
    }

    navigationMethodInit () {
      Taro.setNavigationBarTitle = this.setNavigationBarTitle.bind(this)
      Taro.setNavigationBarColor = this.setNavigationBarColor.bind(this)
      Taro.showNavigationBarLoading = this.showNavigationBarLoading.bind(this)
      Taro.hideNavigationBarLoading = this.hideNavigationBarLoading.bind(this)
    }

    componentWillMount () {
      this.navigationMethodInit()
      // didFocus
      this.didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
          // 页面进入后回退并不会调用 React 生命周期，需要在路由生命周期中绑定 this
          this.navigationMethodInit()
          // 页面聚焦时，调用 componentDidShow
          this.getScreenInstance().componentDidShow && this.getScreenInstance().componentDidShow()
        }
      )

      // willBlur
      this.willBlurSubscription = this.props.navigation.addListener(
        'willBlur',
        payload => {
          // 页面将失去焦点，调用 componentDidHide
          this.getScreenInstance().componentDidHide && this.getScreenInstance().componentDidHide()
        }
      )
      this.screenRef.current && this.setState({}) // TODO 不然 current 为null ??
    }

    componentWillUnmount () {
      // Remove the listener when you are done
      this.didFocusSubscription && this.didFocusSubscription.remove()
      this.willBlurSubscription && this.willBlurSubscription.remove()
    }

    render () {
      const {globalEnablePullDownRefresh = false} = globalNavigationOptions
      const {enablePullDownRefresh, disableScroll} = getNavigationOptions(Screen.config)

      // 页面配置优先级 > 全局配置
      let isScreenEnablePullDownRefresh = enablePullDownRefresh === undefined ? globalEnablePullDownRefresh : enablePullDownRefresh
      const screenInstance = this.getScreenInstance()
      return (
        <TaroProvider
          Taro={Taro}
          enablePullDownRefresh={isScreenEnablePullDownRefresh}
          disableScroll={disableScroll}
          onPullDownRefresh={screenInstance.onPullDownRefresh && screenInstance.onPullDownRefresh.bind(screenInstance)}
          onReachBottom={screenInstance.onReachBottom}
          onScroll={screenInstance.onScroll}
          {...this.props}
        >
          <Screen ref={this.screenRef} {...this.props} />
        </TaroProvider>
      )
    }
  }

  return WrappedScreen
}

export default getWrappedScreen
