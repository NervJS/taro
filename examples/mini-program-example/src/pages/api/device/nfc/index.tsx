import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
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
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
