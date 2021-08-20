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
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import consoleLogMain from '../../utils/consoleLogMain'

export default class Index extends Component {
  componentDidMount() {
    consoleLogMain()
  }

  render () {
    return (
      <View className='index'>
        <View onClick={() => Taro.navigateTo({ url: '/packageA/detail/index' })}>
          Go to detail
        </View>
        <View onClick={() => Taro.navigateTo({ url: '/packageA/my/index' })}>
          Go to my
        </View>
        <View onClick={() => Taro.navigateTo({ url: '/packageB/list/index' })}>
          Go to list
        </View>
      </View>
    )
  }
}
