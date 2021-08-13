import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Title from '../../components/title'

export default class Index extends Component {
  render () {
    return (
      <View className='index'>
        <Title title='index' />
        <Text>Hello world!</Text>
      </View>
    )
  }
}
