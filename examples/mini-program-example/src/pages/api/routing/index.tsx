import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { TestConsole } from 'src/util/util'

/**
 * 路由
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'switchTab',
        func: () => {
          TestConsole.consoleTest('switchTab')
          Taro.switchTab({
            url: '/pages/api/index/index',
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'reLaunch',
        func: () => {
          TestConsole.consoleTest('reLaunch')
          Taro.reLaunch({
            url: '/pages/api/index/index?testParam=1',
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'redirectTo',
        func: () => {
          TestConsole.consoleTest('redirectTo')
          Taro.redirectTo({
            url: '/pages/api/index/index?testParam01=1&testParam02=2',
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'navigateTo',
        func: () => {
          TestConsole.consoleTest('navigateTo')
          Taro.navigateTo({
            url: '/pages/api/index/index?testParam01=1&testParam02=2&testParam03=3',
            events: {
              data: 'test',
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'navigateBack',
        func: () => {
          TestConsole.consoleTest('navigateBack')
          Taro.navigateBack({
            delta: 2,
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'EventChannel',
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
