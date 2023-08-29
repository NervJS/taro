import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-罗盘
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopCompass',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.stopCompass')
          Taro.stopCompass({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
            .catch((err) => {
              TestConsole.consoleReturn.call(this, err, apiIndex)
            })
        },
      },
      {
        id: 'startCompass',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.startCompass')
          Taro.startCompass({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
            .catch((err) => {
              TestConsole.consoleReturn.call(this, err, apiIndex)
            })
        },
      },
      {
        id: 'onCompassChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onCompassChange')
          Taro.onCompassChange(this.onCompassChangeCallback01)
          Taro.onCompassChange(this.onCompassChangeCallback02)
        },
      },
      {
        id: 'offCompassChange',
        inputData: {
          close01: true,
          close02: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.offCompassChange')
          if (data.close01) {
            Taro.offCompassChange(this.onCompassChangeCallback01)
          }
          if (data.close02) {
            Taro.offCompassChange(this.onCompassChangeCallback02)
          }
        },
      },
    ],
  }

  onCompassChangeCallback01 = (res) => {
    TestConsole.consoleOnCallback(res, 'onCompassChange01')
  }

  onCompassChangeCallback02 = (res) => {
    TestConsole.consoleOnCallback(res, 'onCompassChange02')
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
