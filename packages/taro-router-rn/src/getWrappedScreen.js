import React from 'react'
import TaroProvider from './TaroProvider'

/**
 * @description 包裹页面 Screen 组件，处理生命周期，注入方法
 * @param Screen 页面的组件
 * @param Taro 挂在方法到 Taro 上
 * @returns {WrappedScreen}
 */
function getWrappedScreen (Screen, Taro, {enablePullDownRefresh}) {
  class WrappedScreen extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.screenRef = React.createRef()
    }

    componentDidMount () {
      this.screenRef.current.componentDidShow && this.screenRef.current.componentDidShow()
    }

    componentWillUnmount () {
      this.screenRef.current.componentDidHide && this.screenRef.current.componentDidHide()
    }

    render () {
      return (
        <TaroProvider
          navigationOptions={Screen.navigationOptions || {}}
          Taro={Taro}
          enablePullDownRefresh={enablePullDownRefresh}
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
