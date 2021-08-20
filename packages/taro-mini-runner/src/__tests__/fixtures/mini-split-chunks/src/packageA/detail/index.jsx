/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
