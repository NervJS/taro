import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import consoleLogMain from '../../utils/consoleLogMain'
import consoleLogSubVendors from '../../utils/consoleLogSubVendors'
import testExcludeString from '../../utils/testExcludeString'
import './index.css'

export default class Detail extends Component {
  componentDidMount() {
    consoleLogMain()
    consoleLogSubVendors()
    testExcludeString()
  }

  render() {
    return (
      <View className='detail'>
        <Text>I m detail</Text>
      </View>
    )
  }
}
