import {View, Text, Button,RootPortal, StickyHeader, StickySection, CheckboxGroup, Checkbox, Label,  } from '@tarojs/components'
import Taro, {useLoad} from '@tarojs/taro'
import './index.scss'
import React, {useState} from "react";

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })


  return (
    <View className='index'>
      <View className='tip'>
        <Text>Tab Bar 暂时不可用，请点击button进行跳转</Text>
      </View>
      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/component/index/index'
        })
      }}>组件示例</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/api/index/index'
        })
      }}>Api示例</Button>

    </View>
  )
}
