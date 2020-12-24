import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import consoleLogMain from '../../utils/consoleLogMain'
import consoleLogSubCommon from '../../utils/consoleLogSubCommon'
import testExcludeFunction from '../../utils/testExcludeFunction'

export default class My extends Component {
  componentDidMount () {
      consoleLogMain()
      consoleLogSubCommon('packageB')
      testExcludeFunction()
  }

  render () {
    return (
      <View>
        <Text>list page</Text>
      </View>
    )
  }
}
