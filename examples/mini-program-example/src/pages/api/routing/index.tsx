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
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'reLaunch',
        inputData: {
          url: '/pages/api/index/index?testParam=1',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('reLaunch')
          Taro.reLaunch({
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
          }).then((res) => {
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'redirectTo',
        inputData: {
          url: '../routeA/index?testParam01=1&testParam02=2&testParam03=3',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('redirectTo')
          Taro.redirectTo({
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
          }).then((res) => {
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'navigateTo',
        inputData: {
          url: '/pages/api/routing/routeA/index?testParam01=1&testParam02=2&testParam03=3',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('navigateTo')
          Taro.navigateTo({
            ...data,
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
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'navigateBack',
        inputData: {
          delta: 1,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('navigateBack')
          Taro.navigateBack({
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
          }).then((res) => {
            TestConsole.consoleResult.call(this, res, apiIndex)
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
