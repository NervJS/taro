import React from 'react'
import { View, NativeSlot } from '@tarojs/components'

export default function (props) {
  return (
    <View>
      <View>Header: <NativeSlot name='header' /></View>
      <View>Footer: <NativeSlot name='footer' /></View>
    </View>
  )
}
