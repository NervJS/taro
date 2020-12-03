import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import consoleLogMain from '../../utils/consoleLogMain'
import consoleLogSubVendors from '../../utils/consoleLogSubVendors'
import consoleLogSubCommon from '../../utils/consoleLogSubCommon'
import testExcludeString from '../../utils/testExcludeString'
import testExcludeFunction from '../../utils/testExcludeFunction'

export default class My extends Component {
  componentDidMount () {
    consoleLogMain()
    consoleLogSubVendors()
    consoleLogSubCommon('packageA')
    testExcludeString()
    testExcludeFunction()
  }

  render () {
    return (
      <View>
        <Text>I m my</Text>
      </View>
    )
  }
}
