import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 路由
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'switchTab',
        func: (apiIndex) => {
          TestConsole.consoleTest('switchTab')
          Taro.switchTab({
            url: '/pages/api/index/index',
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'reLaunch',
        func: (apiIndex) => {
          TestConsole.consoleTest('reLaunch')
          Taro.reLaunch({
            url: '/pages/api/index/index?testParam=1',
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'redirectTo',
        func: (apiIndex) => {
          TestConsole.consoleTest('redirectTo')
          Taro.redirectTo({
            url: '/pages/api/index/index?testParam01=1&testParam02=2',
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'navigateTo',
        func: (apiIndex) => {
          TestConsole.consoleTest('navigateTo')
          Taro.navigateTo({
            url: '/pages/api/index/index?testParam01=1&testParam02=2&testParam03=3',
            events: {
              data: 'test',
            },
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'navigateBack',
        func: (apiIndex) => {
          TestConsole.consoleTest('navigateBack')
          Taro.navigateBack({
            delta: 2,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleReturn.call(this, res, apiIndex)
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
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
