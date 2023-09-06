import React from 'react'
import Taro from '@tarojs/taro'
import { TestConsole } from '@/util/util'
import './app.scss'

class App extends React.Component {
  onLaunch() {
    TestConsole.consoleNormal('onLaunch')
  }

  onError(error) {
    TestConsole.consoleNormal('onError', error)
    Taro.showToast({
      title: 'onError',
      icon: 'error',
    })
  }

  onPageNotFound(res) {
    TestConsole.consoleNormal('onPageNotFound', res)
    try {
      Taro.showToast({
        title: 'PageNotFound',
        icon: 'error',
      })
    } catch (err) {}
  }

  render() {
    // this.props.children 是将要会渲染的页面
    return this.props.children
  }
}

export default App
