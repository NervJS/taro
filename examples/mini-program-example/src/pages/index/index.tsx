import { View, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'
import React, { useState } from 'react'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Button
        className='buttonStyle'
        onClick={() => {
          Taro.switchTab({
            url: '/pages/component/index/index',
          })
        }}
      >
        组件示例
      </Button>
      <Button
        className='buttonStyle'
        onClick={() => {
          Taro.switchTab({
            url: '/pages/api/index/index',
          })
        }}
      >
        Api示例
      </Button>
    </View>
  )
}
