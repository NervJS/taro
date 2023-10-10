import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 位置
 * @returns
 */

export default class Index extends React.Component {
  state = {
    location: {},
    hasLocation: false,
    list: [
      {
        id: 'onLocationChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('onLocationChange')
          Taro.onLocationChange((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onLocationChange', apiIndex)
          })
        },
      },
      {
        id: 'startLocationUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('startLocationUpdate')
          Taro.startLocationUpdate({
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
        id: 'stopLocationUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('stopLocationUpdate')
          Taro.stopLocationUpdate({
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
        id: 'startLocationUpdateBackground',
        func: (apiIndex) => {
          TestConsole.consoleTest('startLocationUpdateBackground')
          Taro.startLocationUpdateBackground({
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
        id: 'offLocationChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('offLocationChange')
          Taro.offLocationChange((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offLocationChange', apiIndex)
          })
        },
      },
      {
        id: 'onLocationChangeError',
        func: (apiIndex) => {
          TestConsole.consoleTest('onLocationChangeError')
          Taro.onLocationChangeError((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onLocationChangeError', apiIndex)
          })
        },
      },
      {
        id: 'offLocationChangeError',
        func: (apiIndex) => {
          TestConsole.consoleTest('offLocationChangeError')
          Taro.offLocationChangeError((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onLocationChangeError', apiIndex)
          })
        },
      },
      {
        id: 'getLocation',
        inputData: {
          altitude: 'false',
          highAccuracyExpireTime: 8000,
          isHighAccuracy: true,
          type: 'wgs84',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('getLocation')
          Taro.getLocation({
            ...data,
            success: (res) => {
              this.setState({
                location: this.formatLocation(res.longitude, res.latitude),
                hasLocation: true,
              })
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
        id: 'chooseLocation',
        inputData: {
          mapOpts: {
            type: 1,
            search: 1,
            coord: [39.90374, 116.397827],
            // coordtype: 5,
            policy: 0,
            mapdraggable: 1,
            zoom: 15,
            radius: 1000,
            total: 10,
            referer: 'myTaro',
          },
        },
        func: (apiIndex, data) => {
          try {
            TestConsole.consoleTest('chooseLocation')
            // 需要配置全局变量LOCATION_APIKEY
            Taro.chooseLocation({
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
          } catch (err) {
            TestConsole.consoleDebug('chooseLocation', err)
          }
        },
      },
      {
        id: 'getFuzzyLocation',
        inputData: {
          type: 'gcj02',
        },
        func: (apiIndex, data) => {
          try {
            TestConsole.consoleTest('getFuzzyLocation')
            Taro.getFuzzyLocation({
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
          } catch (err) {
            TestConsole.consoleDebug('getFuzzyLocation', err)
          }
        },
      },
      {
        id: 'openLocation',
        func: async (apiIndex) => {
          try {
            TestConsole.consoleTest('openLocation')
            const loc = await Taro.getFuzzyLocation({ type: 'gcj02' })
            Taro.openLocation({
              longitude: loc.longitude,
              latitude: loc.latitude,
              name: '未来科技城',
              address: '中国湖北省武汉市高新大道999号未来科技城',
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
          } catch (err) {
            TestConsole.consoleDebug('openLocation', err)
          }
        },
      },
    ],
  }
  formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
      longitude = parseFloat(longitude)
      latitude = parseFloat(latitude)
    }
    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)
    return {
      longitude: longitude.toString().split('.'),
      latitude: latitude.toString().split('.'),
    }
  }
  render() {
    const { location, hasLocation, list } = this.state
    return (
      <View className='api-page'>
        <View className='page-body-info'>
          <Text className='page-body-text-small'>当前位置经纬度</Text>
          {hasLocation === false && (
            <View>
              <Text className='page-body-text'>未获取</Text>
            </View>
          )}
          {hasLocation === true && (
            <View>
              <View className='page-body-text-location'>
                <Text>{'E: ' + location.longitude[0] + '°' + location.longitude[1] + '′'}</Text>
                <Text>{'N: ' + location.latitude[0] + '°' + location.latitude[1] + '′'}</Text>
              </View>
            </View>
          )}
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
