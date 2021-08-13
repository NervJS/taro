import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import consoleLogMain from '../../utils/consoleLogMain'
import consoleLogSubVendors from '../../utils/consoleLogSubVendors'
import consoleLogSubCommon from '../../utils/consoleLogSubCommon'
import testExcludeString from '../../utils/testExcludeString'
import testExcludeFunction from '../../utils/testExcludeFunction'
import '../../css/sub-vendors.css'
import vendorsStyles from '../../css/sub-vendors.module.css'

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
      <View 
        className={`
          sub-vendors
          ${vendorsStyles['sub-vendors-module']}
        `}
        >
        <Text>I m my</Text>
      </View>
    )
  }
}
