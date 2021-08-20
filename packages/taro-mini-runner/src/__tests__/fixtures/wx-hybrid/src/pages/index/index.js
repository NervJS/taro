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

import Taro from '@tarojs/taro'
import React from 'react'
import { View, Text, Button } from '@tarojs/components'

import './index.scss'

export default class Index extends React.Component {

  gotoWxParse () {
    Taro.navigateTo({
      url: '/pages/wxParse/wxParse'
    })
  }

  gotoEcharts () {
    Taro.navigateTo({
      url: '/pages/echarts/echarts'
    })
  }

  gotoNative () {
    Taro.navigateTo({
      url: '/pages/native/native'
    })
  }

  tabEvent (e) {
    console.log(e)
  }

  render () {
    return (
      <View className='index'>
        
        <View className='title'>与小程序原生融合的各种示例</View>
        <View className='main'>
          <View className='wrapper'>
            <tab onMyevent={this.tabEvent} myProperty='This is tab' />
          </View>
          <View className='wrapper'>
            <Button type='primary' onClick={this.gotoNative}>混写原生页面示例</Button>
          </View>
        </View>
      </View>
    )
  }
}

