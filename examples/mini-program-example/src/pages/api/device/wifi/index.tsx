import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-wifi
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopWifi',
        func: (apiIndex) => {
          TestConsole.consoleTest('stopWifi')
          Taro.stopWifi({
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
        id: 'startWifi',
        func: (apiIndex) => {
          TestConsole.consoleTest('startWifi')
          Taro.startWifi({
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
        id: 'onWifiConnectedWithPartialInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('onWifiConnectedWithPartialInfo')
          Taro.onWifiConnectedWithPartialInfo((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onWifiConnectedWithPartialInfo', apiIndex)
          })
        },
      },
      {
        id: 'onWifiConnected',
        func: (apiIndex) => {
          TestConsole.consoleTest('onWifiConnected')
          Taro.onWifiConnected((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onWifiConnected', apiIndex)
          })
        },
      },
      {
        id: 'onGetWifiList',
        func: (apiIndex) => {
          TestConsole.consoleTest('onGetWifiList')
          Taro.onGetWifiList((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onGetWifiList', apiIndex)
            const wifiList = res.wifiList
              .sort((a, b) => b.signalStrength - a.signalStrength)
              .map((wifi) => {
                const strength = Math.ceil(wifi.signalStrength * 4)
                return Object.assign(wifi, { strength })
              })
            this.setState({
              wifiList,
            })
          })
        },
      },
      {
        id: 'offWifiConnectedWithPartialInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('offWifiConnectedWithPartialInfo')
          Taro.offWifiConnectedWithPartialInfo((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offWifiConnectedWithPartialInfo', apiIndex)
          })
        },
      },
      {
        id: 'offWifiConnected',
        func: (apiIndex) => {
          TestConsole.consoleTest('offWifiConnected')
          Taro.offWifiConnected((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offWifiConnected', apiIndex)
          })
        },
      },
      {
        id: 'offGetWifiList',
        func: (apiIndex) => {
          TestConsole.consoleTest('offGetWifiList')
          Taro.offGetWifiList((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offGetWifiList', apiIndex)
          })
        },
      },
      {
        id: 'getWifiList',
        func: (apiIndex) => {
          TestConsole.consoleTest('getWifiList')
          Taro.getWifiList({
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
        id: 'getConnectedWifi',
        func: (apiIndex) => {
          TestConsole.consoleTest('getConnectedWifi')
          Taro.getConnectedWifi({
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
        id: 'connectWifi',
        inputData: {
          SSID: 'hahaha',
          BSSID: '72:d4:aa:09:0f:f4',
          password: 'lwh123456',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('connectWifi')
          Taro.connectWifi({
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
    wifiList: [],
  }
  render() {
    const { list, wifiList } = this.state
    return (
      <View className='api-page'>
        <View className='page-body-info'>
          <Text className='info-title'>WiFi列表</Text>
          <ScrollView className='device-list' scrollY>
            {wifiList.map((item, index) => {
              return (
                <View className='item' key={index}>
                  <View className='list'>
                    <Text>{item.SSID}</Text>
                    <View className='wifi-icon'>
                      <View className='wifi-1'></View>
                      <View className={'wifi-2 ' + (item.strength < 2 ? 'off' : '')}></View>
                      <View className={'wifi-3 ' + (item.strength < 3 ? 'off' : '')}></View>
                      <View className={'wifi-4 ' + (item.strength < 4 ? 'off' : '')}></View>
                      {item.secure && <View className='lock'></View>}
                    </View>
                  </View>
                </View>
              )
            })}
          </ScrollView>
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
