import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import miao from '../../alias/files/index'
import './index.css'

export default class Index extends Component {
  componentDidMount () {
    miao()
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
