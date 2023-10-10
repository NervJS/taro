import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 框架
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'App.onPageNotFound',
        func: () => {
          TestConsole.consoleTest('触发App.onPageNotFound')
          Taro.navigateTo({
            url: '/pages/unexistedpage',
          })
        },
      },
      {
        id: 'App.onError',
        func: () => {
          TestConsole.consoleTest('触发App.onError')
          throw new Error('')
        },
      },
      {
        id: 'getApp',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getApp')
          TestConsole.consoleResult.call(this, Taro.getApp(), apiIndex)
        },
      },
      {
        id: 'getCurrentPages',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.getCurrentPages')
          TestConsole.consoleResult.call(this, Taro.getCurrentPages(), apiIndex)
        },
      },
      {
        id: 'Page',
        func: () => {
          TestConsole.consoleTest('Taro.getCurrentInstance().page')
          TestConsole.consoleNormal('当前页面信息', Taro.getCurrentInstance().page)
        },
      },
      {
        id: 'Page.componentDidHide',
        func: () => {
          TestConsole.consoleTest('Page.componentDidHide')
          Taro.navigateTo({
            url: '/pages/api/interface/interaction/index',
          })
        },
      },
    ],
  }

  onLoad(res) {
    TestConsole.consoleNormal('Page.onLoad', res)
  }

  onUnload() {
    TestConsole.consoleNormal('Page.onUnload')
  }

  onReady() {
    TestConsole.consoleNormal('Page.onReady')
  }

  componentDidShow() {
    TestConsole.consoleNormal('componentDidShow')
  }

  componentDidHide() {
    TestConsole.consoleNormal('componentDidHide')
  }

  onPullDownRefresh() {
    TestConsole.consoleNormal('Page.onPullDownRefresh')
    Taro.showModal({
      title: 'onPullDownRefresh',
      showCancel: false,
      success: () => {
        Taro.stopPullDownRefresh()
      },
    })
  }

  onReachBottom() {
    TestConsole.consoleNormal('Page.onReachBottom')
    Taro.showToast({
      title: 'onReachBottom',
    })
  }

  onPageScroll(res) {
    TestConsole.consoleNormal('Page.onPageScroll', res)
  }

  onResize(res) {
    TestConsole.consoleNormal('Page.onResize', res)
  }

  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
        <View style={{ height: '1000px', textAlign: 'center', border: '1px solid #000' }}>填充区域，可以滚动屏幕</View>
      </View>
    )
  }
}
