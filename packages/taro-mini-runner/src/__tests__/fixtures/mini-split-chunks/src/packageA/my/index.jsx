import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import consoleLogMain from '../../utils/consoleLogMain'
import consoleLogSubVendors from '../../utils/consoleLogSubVendors'
import consoleLogSubCommon from '../../utils/consoleLogSubCommon'

export default class My extends Component {
  componentDidMount () {
    consoleLogMain()
    consoleLogSubVendors()
    consoleLogSubCommon('packageA')
  }

  render () {
    return (
      <View>
        <Text>I m my</Text>
      </View>
    )
  }
}
