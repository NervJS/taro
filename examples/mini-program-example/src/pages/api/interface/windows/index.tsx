import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
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
          TestConsole.consoleTest('Taro.onWindowResize')
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
          TestConsole.consoleTest('Taro.offWindowResize')
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
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
