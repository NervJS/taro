import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 设备-NFC
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopHCE',
        func: null,
      },
      {
        id: 'startHCE',
        func: null,
      },
      {
        id: 'sendHCEMessage',
        func: null,
      },
      {
        id: 'onHCEMessage',
        func: null,
      },
      {
        id: 'offHCEMessage',
        func: null,
      },
      {
        id: 'getNFCAdapter',
        func: null,
      },
      {
        id: 'getHCEState',
        func: null,
      },
      {
        id: 'IsoDep',
        func: null,
      },
      {
        id: 'MifareClassic',
        func: null,
      },
      {
        id: 'MifareUltralight',
        func: null,
      },
      {
        id: 'Ndef',
        func: null,
      },
      {
        id: 'NfcA',
        func: null,
      },
      {
        id: 'NFCAdapter',
        func: null,
      },
      {
        id: 'NfcB',
        func: null,
      },
      {
        id: 'NfcF',
        func: null,
      },
      {
        id: 'NfcV',
        func: null,
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
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
