import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { someCommon } from '../common'
import './index.css'

export default class Detail extends Component {
  componentDidMount () {
    someCommon('detail')
  }

  render () {
    return (
      <View className='detail'>
        <Text>I m detail</Text>
      </View>
    )
  }
}
