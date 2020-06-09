import Taro from '@tarojs/taro'
import React from 'react'

import './app.css'

class App extends React.Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      this.props.children
    )
  }
}

export default App
