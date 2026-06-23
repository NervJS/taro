import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 转发
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'updateShareMenu',
        func: null,
      },
      {
        id: 'showShareMenu',
        inputData: {
          withShareTicket: true,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.showShareMenu')
          Taro.showShareMenu(data).then(() => {
            TestConsole.consoleNormal('showShareMenu')
          })
          Taro.showShareMenu({
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
        id: 'showShareImageMenu',
        func: null,
      },
      {
        id: 'shareVideoMessage',
        func: null,
      },
      {
        id: 'shareFileMessage',
        func: null,
      },
      {
        id: 'onCopyUrl',
        func: null,
      },
      {
        id: 'offCopyUrl',
        func: null,
      },
      {
        id: 'hideShareMenu',
        inputData: {
          menus: ['shareAppMessage', 'shareTimeline'],
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.hideShareMenu')
          Taro.hideShareMenu(data).then(() => {
            TestConsole.consoleNormal('hideShareMenu')
          })
          Taro.hideShareMenu({
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
        id: 'getShareInfo',
        inputData: {
          shareTicket: '',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.getShareInfo')
          Taro.getShareInfo({
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
        id: 'authPrivateMessage',
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
