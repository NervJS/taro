import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import consoleLogMain from '../../utils/consoleLogMain'
import consoleLogSubVendors from '../../utils/consoleLogSubVendors'
import testExcludeString from '../../utils/testExcludeString'
import './index.css'
import '../../css/sub-vendors.css'
import '../../css/sub-common.css'
import subCommonStyles from '../../css/sub-common.module.css'
import vendorsStyles from '../../css/sub-vendors.module.css'
import _ from 'lodash'

export default class Detail extends Component {
  componentDidMount() {
    consoleLogMain()
    consoleLogSubVendors()
    testExcludeString()
  }

  render() {
    return (
      <View className='detail'>
        <Text className={`
          sub-vendors
          sub-common
          ${subCommonStyles['sub-common-module']}
          ${vendorsStyles['sub-vendors-module']}
        `}>I m detail</Text>
      </View>
    )
  }
}
