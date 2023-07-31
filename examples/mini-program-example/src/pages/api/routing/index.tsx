import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 路由
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'switchTab',
        func: () => {
          Taro.switchTab({
            url: '/pages/api/index/index',
            complete: (res) => {
              console.log('switchTab complete ', res)
            },
            fail: (res) => {
              console.log('switchTab fail ', res)
            },
            success: (res) => {
              console.log('switchTab success ', res)
            },
          })
        },
      },
      {
        id: 'reLaunch',
        func: () => {
          Taro.reLaunch({
            url: '/pages/api/index/index?testParam=1',
            complete: (res) => {
              console.log('reLaunch complete ', res)
            },
            fail: (res) => {
              console.log('reLaunch fail ', res)
            },
            success: (res) => {
              console.log('reLaunch success ', res)
            },
          })
        },
      },
      {
        id: 'redirectTo',
        func: () => {
          Taro.redirectTo({
            url: '/pages/api/index/index?testParam01=1&testParam02=2',
            complete: (res) => {
              console.log('redirectTo complete ', res)
            },
            fail: (res) => {
              console.log('redirectTo fail ', res)
            },
            success: (res) => {
              console.log('redirectTo success ', res)
            },
          })
        },
      },
      {
        id: 'navigateTo',
        func: () => {
          Taro.navigateTo({
            url: '/pages/api/index/index?testParam01=1&testParam02=2&testParam03=3',
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function (data) {
                console.log(data)
              },
              someEvent: function (data) {
                console.log(data)
              },
            },
            success: (res) => {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
              console.log('navigateTo success ', res)
            },
            complete: (res) => {
              console.log('navigateTo complete ', res)
            },
            fail: (res) => {
              console.log('navigateTo fail ', res)
            },
          })
        },
      },
      {
        id: 'navigateBack',
        func: () => {
          //A页面
          Taro.navigateTo({
            url: '/pages/api/basics/basics/index',
          })
          //B页面
          Taro.navigateTo({
            url: '/pages/api/basics/system/index',
          })
          // 在C页面内 navigateBack，将返回A页面
          Taro.navigateBack({
            delta: 2,
            success: (res) => {
              console.log('navigateBack success ', res)
            },
            complete: (res) => {
              console.log('navigateBack complete ', res)
            },
            fail: (res) => {
              console.log('navigateBack fail ', res)
            },
          })
        },
      },
      {
        id: 'EventChannel',
        func: null,
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
