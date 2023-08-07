import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
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
        func: () => {
          TestConsole.consoleTest('stopWifi')
          Taro.stopWifi({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'startWifi',
        func: () => {
          TestConsole.consoleTest('startWifi')
          Taro.startWifi({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'setWifiList',
        func: null,
      },
      {
        id: 'onWifiConnectedWithPartialInfo',
        func: () => {
          TestConsole.consoleTest('onWifiConnectedWithPartialInfo')
          Taro.onWifiConnectedWithPartialInfo((res) => {
            TestConsole.consoleSuccess(res)
          })
        },
      },
      {
        id: 'onWifiConnected',
        func: () => {
          TestConsole.consoleTest('onWifiConnected')
          Taro.onWifiConnected((res) => {
            TestConsole.consoleSuccess(res)
          })
        },
      },
      {
        id: 'onGetWifiList',
        func: () => {
          TestConsole.consoleTest('onGetWifiList')
          Taro.onGetWifiList((res) => {
            TestConsole.consoleSuccess(res)
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
        func: () => {
          TestConsole.consoleTest('offWifiConnectedWithPartialInfo')
          Taro.offWifiConnectedWithPartialInfo((res) => {
            TestConsole.consoleSuccess(res)
          })
        },
      },
      {
        id: 'offWifiConnected',
        func: () => {
          TestConsole.consoleTest('offWifiConnected')
          Taro.offWifiConnected((res) => {
            TestConsole.consoleSuccess(res)
          })
        },
      },
      {
        id: 'offGetWifiList',
        func: () => {
          TestConsole.consoleTest('offGetWifiList')
          Taro.offGetWifiList((res) => {
            TestConsole.consoleSuccess(res)
          })
        },
      },
      {
        id: 'getWifiList',
        func: () => {
          TestConsole.consoleTest('getWifiList')
          Taro.getWifiList({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'getConnectedWifi',
        func: () => {
          TestConsole.consoleTest('getConnectedWifi')
          Taro.getConnectedWifi({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'connectWifi',
        func: () => {
          Taro.connectWifi({
            SSID: '',
            BSSID: '',
            password: '',
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
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
        {list.map((item) => {
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
