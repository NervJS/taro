import {View, Text,Image,GridView,ListView, Button, PageContainer,MatchMedia} from '@tarojs/components'
import Taro, {useLoad} from '@tarojs/taro'
import './index.scss'
import React, {useState} from "react";

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/grid-view/index'
        })
      }}>GridView</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/list-view/index'
        })
      }}>ListView</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/page-container/index'
        })
      }}>PageContainer</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/match-media/index'
        })
      }}>MatchMedia</Button>

    </View>
  )
}
