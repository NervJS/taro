import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import consoleLogMain from '../../utils/consoleLogMain'
import consoleLogSubCommon from '../../utils/consoleLogSubCommon'
import testExcludeFunction from '../../utils/testExcludeFunction'
import '../../css/sub-common.css'
import subCommonStyles from '../../css/sub-common.module.css'
import _ from 'lodash'

export default class My extends Component {
  componentDidMount () {
      consoleLogMain()
      consoleLogSubCommon('packageB')
      testExcludeFunction()
  }

  render () {
    return (
      <View 
        className={`
          sub-common
          ${subCommonStyles['sub-common-module']}
        `}
        >
        <Text>list page</Text>
      </View>
    )
  }
}
