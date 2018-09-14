import React from 'react'
import TaroProvider from './TaroProvider'

/**
 * @description 包裹页面 Screen 组件，处理生命周期，注入方法
 * @param Screen 页面的组件，有可能是 react-redux 里面的 connect 包裹后的 Screen
 * @param Taro 挂在方法到 Taro 上
 * @param globalNavigationOptions 全局
 * @returns {WrappedScreen}
 */
function getWrappedScreen (Screen, Taro, globalNavigationOptions) {
  class WrappedScreen extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.screenRef = React.createRef()
    }

    /**
     * @description 如果 Screen 被包裹过（如：@connect），
     * 需提供获取包裹前 Screen 实例的方法 getWrappedInstance 并暴露出被包裹组件的 navigationOptions
     * @returns {*}
     */
    getScreenInstance () {
      if (this.screenRef.current && this.screenRef.current.getWrappedInstance) {
        return this.screenRef.current.getWrappedInstance()
      } else {
        return this.screenRef.current || {}
      }
    }

    componentDidMount () {
      this.getScreenInstance().componentDidShow && this.getScreenInstance().componentDidShow()
      this.screenRef.current && this.setState({})
    }

    componentWillUnmount () {
      this.getScreenInstance().componentDidHide && this.getScreenInstance().componentDidHide()
    }

    render () {
      console.log(this.getScreenInstance())
      console.log(this.getScreenInstance().onPullDownRefresh)
      const {globalEnablePullDownRefresh = false} = globalNavigationOptions
      const navigationOptions = Screen.navigationOptions || {}
      // 页面配置优先级 > 全局配置
      let isScreenEnablePullDownRefresh = navigationOptions.enablePullDownRefresh === undefined
        ? globalEnablePullDownRefresh
        : navigationOptions.enablePullDownRefresh
      return (
        <TaroProvider
          Taro={Taro}
          enablePullDownRefresh={isScreenEnablePullDownRefresh}
          onPullDownRefresh={this.getScreenInstance().onPullDownRefresh}
          onReachBottom={this.getScreenInstance().onReachBottom}
          onScroll={this.getScreenInstance().onScroll}
          {...this.props}
        >
          <Screen ref={this.screenRef} {...this.props}/>
        </TaroProvider>
      )
    }
  }

  return WrappedScreen
}

export default getWrappedScreen
