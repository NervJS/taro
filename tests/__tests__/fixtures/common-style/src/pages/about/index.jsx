import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Title from '../../components/title'

export default class Index extends Component {
  render () {
    return (
      <View className='about'>
        <Title title='about' />
        <Text>About.</Text>
      </View>
    )
  }
}
