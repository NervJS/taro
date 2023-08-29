import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-加速器
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopAccelerometer',
        func: (apiIndex) => {
          TestConsole.consoleTest('stopAccelerometer')
          Taro.stopAccelerometer({
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
        id: 'startAccelerometer',
        inputData: {
          interval: 'normal',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('startAccelerometer')
          Taro.startAccelerometer({
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
            .then((res) => {
              TestConsole.consoleReturn.call(this, res, apiIndex)
            })
            .catch((err) => {
              TestConsole.consoleReturn.call(this, err, apiIndex)
            })
        },
      },
      {
        id: 'onAccelerometerChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('onAccelerometerChange')
          Taro.onAccelerometerChange(this.onAccelerometerChange01)
          Taro.onAccelerometerChange(this.onAccelerometerChange02)
        },
      },
      {
        id: 'offAccelerometerChange',
        inputData: {
          closeAll: false,
          close01: true,
          close02: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('offAccelerometerChange')
          if (data.closeAll) {
            Taro.offAccelerometerChange()
          } else {
            if (data.close01) {
              Taro.offAccelerometerChange(this.onAccelerometerChange01)
            }
            if (data.close02) {
              Taro.offAccelerometerChange(this.onAccelerometerChange02)
            }
          }
        },
      },
    ],
  }

  onAccelerometerChange01 = (res: any) => {
    TestConsole.consoleOnCallback(res, 'onAccelerometerChange01')
  }

  onAccelerometerChange02 = (res: any) => {
    TestConsole.consoleOnCallback(res, 'onAccelerometerChange02')
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
