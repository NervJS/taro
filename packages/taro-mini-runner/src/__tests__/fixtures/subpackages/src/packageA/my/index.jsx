import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { someCommon } from '../common'

export default class My extends Component {
  componentDidMount () {
    someCommon('my')
  }

  render () {
    return (
      <View>
        <Text>I m my</Text>
      </View>
    )
  }
}
