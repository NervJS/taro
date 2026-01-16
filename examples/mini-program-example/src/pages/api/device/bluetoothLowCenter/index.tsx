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

// let deviceId = '73:4F:1B:6F:9D:13'
let deviceId = '34:29:12:7F:79:71'
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'writeBLECharacteristicValue',
        func: (apiIndex) => {
          TestConsole.consoleTest('writeBLECharacteristicValue')
          let buffer = new ArrayBuffer(12)
          Taro.writeBLECharacteristicValue({
            characteristicId: '0000AAAD-0000-1000-8000-00805F9B34FB',
            deviceId: deviceId,
            serviceId: '0000AAAA-0000-1000-8000-00805F9B34FB',
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
            TestConsole.consoleResult.call(this, res, apiIndex)
          })
        },
      },
      {
        id: 'setBLEMTU',
        inputData: {
          deviceId: deviceId,
          mtu: 256,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setBLEMTU')
          Taro.setBLEMTU({
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
        id: 'readBLECharacteristicValue',
        inputData: {
          // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
          deviceId: deviceId,
          // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
          serviceId: '0000AAAA-0000-1000-8000-00805F9B34FB',
          // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
          characteristicId: '0000AAAD-0000-1000-8000-00805F9B34FB',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('readBLECharacteristicValue')
          Taro.readBLECharacteristicValue({
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
        id: 'onBLEMTUChange',
        func: null,
      },
      {
        id: 'onBLEConnectionStateChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('onBLEConnectionStateChange')
          Taro.onBLEConnectionStateChange((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onBLEConnectionStateChange', apiIndex)
          })
        },
      },
      {
        id: 'onBLECharacteristicValueChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('onBLECharacteristicValueChange')
          Taro.onBLECharacteristicValueChange((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onBLECharacteristicValueChange', apiIndex)
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
        inputData: {
          // 启用 notify 功能
          state: true,
          // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
          deviceId: deviceId,
          // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
          serviceId: '0000AAAA-0000-1000-8000-00805F9B34FB',
          // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
          characteristicId: '0000AAAD-0000-1000-8000-00805F9B34FB',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('notifyBLECharacteristicValueChange')
          Taro.notifyBLECharacteristicValueChange({
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
        id: 'getBLEMTU',
        func: null,
      },
      {
        id: 'getBLEDeviceServices',
        inputData: {
          deviceId: '34:29:12:7F:79:71',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('getBLEDeviceServices')
          Taro.getBLEDeviceServices({
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
        id: 'getBLEDeviceRSSI',
        inputData: {
          deviceId: deviceId,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('getBLEDeviceRSSI')
          Taro.getBLEDeviceRSSI({
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
        id: 'getBLEDeviceCharacteristics',
        inputData: {
          // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
          deviceId: deviceId,
          // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
          serviceId: '0000AAAA-0000-1000-8000-00805F9B34FB',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('getBLEDeviceCharacteristics')
          Taro.getBLEDeviceCharacteristics({
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
        id: 'createBLEConnection',
        inputData: {
          deviceId: deviceId,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('createBLEConnection')
          Taro.createBLEConnection({
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
        id: 'closeBLEConnection',
        inputData: {
          deviceId: deviceId,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('closeBLEConnection')
          Taro.closeBLEConnection({
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
