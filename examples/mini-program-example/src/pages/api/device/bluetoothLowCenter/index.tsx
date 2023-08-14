import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-蓝牙-低功耗中心设备
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'writeBLECharacteristicValue',
        func: (apiIndex) => {
          TestConsole.consoleTest('writeBLECharacteristicValue')
          // 向蓝牙设备发送一个0x00的16进制数据
          let buffer = new ArrayBuffer(1)
          Taro.writeBLECharacteristicValue({
            characteristicId: '',
            deviceId: '',
            serviceId: '',
            value: buffer,
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
        id: 'setBLEMTU',
        func: (apiIndex) => {
          TestConsole.consoleTest('setBLEMTU')
          Taro.setBLEMTU({
            deviceId: '',
            mtu: 300,
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
        id: 'readBLECharacteristicValue',
        func: (apiIndex) => {
          TestConsole.consoleTest('readBLECharacteristicValue')
          Taro.readBLECharacteristicValue({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: '',
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: '',
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId: '',
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
        id: 'onBLEMTUChange',
        func: null,
      },
      {
        id: 'onBLEConnectionStateChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('onBLEConnectionStateChange')
          Taro.onBLEConnectionStateChange((res) => {
            TestConsole.consoleSuccess.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'onBLECharacteristicValueChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('onBLECharacteristicValueChange')
          Taro.onBLECharacteristicValueChange((res) => {
            TestConsole.consoleSuccess.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'offBLEMTUChange',
        func: null,
      },
      {
        id: 'offBLEConnectionStateChange',
        func: null,
      },
      {
        id: 'offBLECharacteristicValueChange',
        func: null,
      },
      {
        id: 'notifyBLECharacteristicValueChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('notifyBLECharacteristicValueChange')
          Taro.notifyBLECharacteristicValueChange({
            // 启用 notify 功能
            state: true,
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: '',
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: '',
            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
            characteristicId: '',
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
        id: 'getBLEMTU',
        func: null,
      },
      {
        id: 'getBLEDeviceServices',
        func: (apiIndex) => {
          TestConsole.consoleTest('getBLEDeviceServices')
          Taro.getBLEDeviceServices({
            deviceId: '',
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
        id: 'getBLEDeviceRSSI',
        func: (apiIndex) => {
          TestConsole.consoleTest('getBLEDeviceRSSI')
          Taro.getBLEDeviceRSSI({
            deviceId: '',
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
        id: 'getBLEDeviceCharacteristics',
        func: (apiIndex) => {
          TestConsole.consoleTest('getBLEDeviceCharacteristics')
          Taro.getBLEDeviceCharacteristics({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: '',
            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
            serviceId: '',
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
        id: 'createBLEConnection',
        func: (apiIndex) => {
          TestConsole.consoleTest('createBLEConnection')
          Taro.createBLEConnection({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: '',
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
        id: 'closeBLEConnection',
        func: (apiIndex) => {
          TestConsole.consoleTest('closeBLEConnection')
          Taro.closeBLEConnection({
            deviceId: '',
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
