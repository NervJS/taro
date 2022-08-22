import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
