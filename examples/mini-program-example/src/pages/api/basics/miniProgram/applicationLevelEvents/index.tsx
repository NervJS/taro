import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

/**
 * 基础-应用级事件
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'onUnhandledRejection',
        func: () => {
          new Promise((resolve, reject) => {
            const aa = 'name'
            // @ts-ignore
            if (aa === 'name1') {
              resolve(aa)
            } else {
              reject({ message: 'error' })
            }
          })

          Taro.onUnhandledRejection((res) => {
            console.log('Taro.onUnhandledRejection ', res)
            Taro.showModal({ content: 'Taro.onUnhandledRejection ' + JSON.stringify(res) })
          })
        },
      },
      {
        id: 'onThemeChange',
        func: null,
      },
      {
        id: 'onPageNotFound',
        func: () => {
          Taro.navigateTo({
            url: 'pages/api/index/11',
          })
          Taro.onPageNotFound((res) => {
            console.log('Taro.onPageNotFound success', res)
            Taro.navigateTo({
              url: 'pages/api/index/index',
            })
          })
        },
      },
      {
        id: 'onError',
        func: () => {
          Taro.onError((err) => {
            console.log('Taro.onError ', err)
            Taro.showModal({ content: 'Taro.onError ' + JSON.stringify(err) })
          })
        },
      },
      {
        id: 'onAudioInterruptionEnd',
        func: null,
      },
      {
        id: 'onAudioInterruptionBegin',
        func: null,
      },
      {
        id: 'onAppShow',
        func: () => {
          Taro.request({
            url: 'https://www.baidu.com',
            success: function (res) {
              Taro.showModal({
                title: '一把钥匙',
                content: res.data,
                confirmText: '探寻真实',
                cancelText: '放下钥匙',
                success: function () {
                  Taro.navigateTo({
                    url: '/pages/api/basics/miniProgram/applicationLevelEvents/index',
                    success: () => {
                      Taro.onAppShow((_result) => {
                        console.log('Taro.onAppShow success ')
                      })
                    },
                  })
                },
              })
            },
            fail: function (res) {
              console.log(res)
            },
          })
        },
      },
      {
        id: 'onAppHide',
        func: () => {
          Taro.navigateTo({
            url: '/pages/api/basics/miniProgram/applicationLevelEvents/index',
            success: () => {
              Taro.request({
                url: 'https://www.baidu.com',
                success: function (res) {
                  Taro.showModal({
                    title: '一把钥匙',
                    content: res.data,
                    confirmText: '探寻真实',
                    cancelText: '放下钥匙',
                    success: function () {
                      Taro.onAppHide((_result) => {
                        console.log('Taro.onAppHide success ')
                      })
                    },
                  })
                },
                fail: function (res) {
                  console.log(res)
                },
              })
            },
          })
        },
      },
      {
        id: 'offThemeChange',
        func: null,
      },
      {
        id: 'offPageNotFound',
        func: null,
      },
      {
        id: 'offError',
        func: null,
      },
      {
        id: 'offAudioInterruptionEnd',
        func: null,
      },
      {
        id: 'offAudioInterruptionBegin',
        func: null,
      },
      {
        id: 'offAppShow',
        func: null,
      },
      {
        id: 'offAppHide',
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
