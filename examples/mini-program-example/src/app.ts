import React from 'react'
import Taro from '@tarojs/taro'
import { TestConsole } from '@/util/util'
import './app.scss'

class App extends React.Component {
  onLaunch(res) {
    if (res) {
      Taro.setStorageSync('onLaunch', res)
    } else {
      Taro.setStorageSync('onLaunch', 'Triggered')
    }
    TestConsole.consoleNormal('onLaunch', res)
  }

  onError(error) {
    if (error) {
      Taro.setStorageSync('onError', error)
    } else {
      Taro.setStorageSync('onError', 'Triggered')
    }
    TestConsole.consoleNormal('onError', error)
    Taro.showToast({
      title: 'onError',
      icon: 'error',
    })
  }

  onPageNotFound(res) {
    if (res) {
      Taro.setStorageSync('onPageNotFound', res)
    } else {
      Taro.setStorageSync('onPageNotFound', 'Triggered')
    }
    TestConsole.consoleNormal('onPageNotFound', res)
    Taro.navigateTo({
      url: 'pages/error/index',
    })
  }

  componentDidShow(res) {
    TestConsole.consoleNormal('App componentDidShow', res)
  }

  componentDidHide() {
    TestConsole.consoleNormal('App componentDidHide')
  }

  render() {
    // this.props.children 是将要会渲染的页面
    return this.props.children
  }
}

export default App
