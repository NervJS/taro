import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 界面-窗口
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'setWindowSize',
        func: null,
      },
      {
        id: 'onWindowResize',
        func: () => {
          console.log('onWindowResize')
          if (!this.listenResize['registered']) {
            this.listenResize['registered'] = true
            Taro.onWindowResize(this.listenResize)
            Taro.showToast({
              title: '注册监听',
              icon: 'success',
            })
          }
        },
      },
      {
        id: 'offWindowResize',
        func: () => {
          console.log('offWindowResize')
          Taro.offWindowResize(this.listenResize)
          this.listenResize['registered'] = false
          Taro.showToast({
            title: '取消注册',
            icon: 'success',
          })
        },
      },
      {
        id: 'checkIsPictureInPictureActive',
        func: null,
      },
    ],
  }

  listenResize(res) {
    Taro.showToast({
      title: `高:${res.windowHeight},宽${res.windowWidth}`,
    })
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
