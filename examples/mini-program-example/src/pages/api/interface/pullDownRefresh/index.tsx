import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 界面-下拉更新
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'startPullDownRefresh',
        func: (apiIndex) => {
          TestConsole.consoleTest('startPullDownRefresh')
          Taro.startPullDownRefresh({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'stopPullDownRefresh',
        func: (apiIndex) => {
          TestConsole.consoleTest('stopPullDownRefresh')
          Taro.stopPullDownRefresh({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
    ],
  }

  onPullDownRefresh() {
    console.log('onPullDownRefresh: 下拉刷新事件处理')
    Taro.showToast({
      title: '下拉刷新中',
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
