import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 界面-滚动
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'pageScrollTo',
        inputData: {
          duration: 300,
          selector: '#blank-content',
          offsetTop: 0,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('pageScrollTo')
          Taro.pageScrollTo({
            ...data,
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
        id: 'ScrollViewContext',
        func: null,
      },
      {
        id: 'pageScrollTo: 滚到顶部',
        func: (apiIndex) => {
          TestConsole.consoleTest('pageScrollTo: 滚到顶部')
          Taro.pageScrollTo({
            scrollTop: 0,
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
  render() {
    const { list, listTail } = this.state
    return (
      <View className='api-page'>
        {<View id='blank-content'>空白视图，用于滚动测试</View>}
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
