import React, { Component } from 'react'
import { View } from '@tarojs/components'
import Common from '../../components/common'

import './index.scss'

export default class Index extends Component {
  render () {
    return (
      <View  className='red'>
        <View className='blue'>Detail</View>
        <Common />
      </View>
    )
  }
}
