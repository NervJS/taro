import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 基础
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'Request',
        func: () => {
          Taro.request({
            url: 'www.baidu.com', //仅为示例，并非真实的接口地址
            data: {
              x: 'test01',
              y: 'test02',
            },
            header: {
              'content-type': 'application/json', // 默认值
            },
            timeout: 3000,
            method: 'GET',
            dataType: '',
            responseType: 'text',
            enableHttp2: false,
            enableQuic: false,
            enableCache: false,
            enableHttpDNS: false,
            httpDNSServiceId: '',
            enableChunked: false,
            jsonp: false,
            jsonpCache: false,
            mode: 'same-origin',
            credentials: 'omit',
            cache: 'default',
            retryTimes: 2,
            backup: 'www.baidu.com',
            dataCheck: () => {
              return false
            },
            success: function (res) {
              console.log('Request success ', res)
            },
            fail: function (res) {
              console.log('Request fail ', res)
            },
            complete: function (res) {
              console.log('Request complete ', res)
            },
          })
        },
      },
      {
        id: 'Download',
        func: () => {
          Taro.navigateTo({
            url: '/pages/api/network/download/index',
          })
        },
      },
      {
        id: 'Upload',
        func: () => {
          Taro.navigateTo({
            url: '/pages/api/network/upload/index',
          })
        },
      },
      {
        id: 'WebSocket',
        func: () => {
          Taro.navigateTo({
            url: '/pages/api/network/webSocket/index',
          })
        },
      },
      {
        id: 'mDNS',
        func: () => {
          Taro.navigateTo({
            url: '/pages/api/network/mDNS/index',
          })
        },
      },
      {
        id: 'TCPCommunications',
        func: () => {
          Taro.navigateTo({
            url: '/pages/api/network/TCPCommunications/index',
          })
        },
      },
      {
        id: 'UDPCommunications',
        func: () => {
          Taro.navigateTo({
            url: '/pages/api/network/UDPCommunications/index',
          })
        },
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
