import {View, Text, RootPortal} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './index.scss'
import React from "react";

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <RootPortal enable={false} style={{
        position: 'absolute',
        background: '#212121',
        width: '80%',
        left: '10%',
        top: '50%',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Text>Hello RootPortal!</Text>
        <Text>Hello RootPortal!</Text>
      </RootPortal>
    </View>
  )
}
