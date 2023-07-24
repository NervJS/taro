import React from 'react'
import { View, NativeSlot } from '@tarojs/components'
import Common from '../common'
import './index.scss'

export default function (props) {
  return (
    <View className='blue'>
      <View>Header: <NativeSlot name='header' /></View>
      <View>Footer: <NativeSlot name='footer' /></View>
      <Common />
    </View>
  )
}
