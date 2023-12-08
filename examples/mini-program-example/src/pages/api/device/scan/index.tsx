import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-扫码
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'scanCode',
        inputData: {
          onlyFromCamera: false,
          scanType: ['qrCode']
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.scanCode')
          Taro.scanCode({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              this.setState({
                scanResult: res
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          }).then((res) => {
            TestConsole.consoleResult.call(this, res, apiIndex)
          }).catch((err) => {
            TestConsole.consoleDebug('scanCode', err)
          })
        },
      },
    ],
    scanResult: {}
  }
  render () {
    const { list, scanResult } = this.state
    return (
      <View>
        <View>
          <Text>扫码结果</Text>
          {Object.keys(scanResult).length === 0 && (
            <View>
              <Text>未扫描到内容</Text>
            </View>
          )}
          {Object.keys(scanResult).length !== 0 && (
            <View>
              <View>
                <Text>{'扫码的字符集: ' + scanResult?.charSet}</Text><br />
                <Text>{'编码原始数据: ' + scanResult?.rawData}</Text><br />
                <Text>{'所扫码的内容: ' + scanResult?.result}</Text><br />
                <Text>{'所扫码的类型: ' + scanResult?.scanType}</Text><br />
              </View>
            </View>
          )}
        </View>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
