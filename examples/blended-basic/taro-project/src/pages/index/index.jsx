import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { printCommon } from '../../common'
import { logRaw } from '@/utils/util'
import './index.scss'

export default class Index extends Component {
  componentDidMount () {
    printCommon()
    logRaw()
  }

  render () {
    return (
      <View className='red'>
        <title />
        <Text>Hello world!</Text>
      </View>
    )
  }
}
