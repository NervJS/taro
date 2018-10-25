import React from 'react'
import { View } from 'react-native'

class HomeScreen extends React.Component {
  constructor (props) {
    super(props)
  }

  static config = {
    navigationBarTitleText: '首页',
    navigationBarBackgroundColor: 'white',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: true
  }

  onPullDownRefresh () {}

  onReachBottom () {}

  onScroll () {}

  render () {
    return <View>Test</View>
  }
}

export default HomeScreen
