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
        func: () => {
          TestConsole.consoleTest('pageScrollTo')
          Taro.pageScrollTo({
            duration: 300,
            selector: '#blank-content',
            offsetTop: 0,
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'ScrollViewContext',
        func: null,
      },
    ],
    listTail: [
      {
        id: 'pageScrollTo: 滚到顶部',
        func: () => {
          TestConsole.consoleTest('pageScrollTo: 滚到顶部')
          Taro.pageScrollTo({
            scrollTop: 0,
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
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
        <ButtonList buttonList={list} />
        {<View id='blank-content'>空白视图，用于滚动测试</View>}
        {listTail.map((item) => {
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
