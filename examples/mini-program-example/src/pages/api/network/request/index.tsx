import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 网络-发起请求
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'request',
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
        id: 'RequestTask',
        func: null,
      },
      {
        id: 'addInterceptor',
        func: null,
      },
      {
        id: 'cleanInterceptors',
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
