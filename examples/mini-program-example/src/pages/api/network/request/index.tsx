import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
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
        func: (apiIndex) => {
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
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
