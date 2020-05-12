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
        <tab onMyevent={this.tabEvent} myProperty='This is tab' />
        <View className='title'>与小程序原生融合的各种示例</View>
        <View className='main'>
          <View className='wrapper'>
            <Button type='primary' onClick={this.gotoWxParse}>wxParse 示例</Button>
          </View>
          <View className='wrapper'>
            <Button type='primary' onClick={this.gotoEcharts}>echarts-for-weixin 示例</Button>
          </View>
          <View className='wrapper'>
            <Button type='primary' onClick={this.gotoNative}>混写原生页面示例</Button>
          </View>
        </View>
      </View>
    )
  }
}

