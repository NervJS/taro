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


      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/sticky-header/index'
        })
      }}>StickyHeader</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/root-portal/index'
        })
      }}>root-portal</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/radio-group/index'
        })
      }}>radio-group</Button>

      <Button className={'buttonStyle'} onClick={() => {
        Taro.navigateTo({
          url: 'pages/check-box-group/index'
        })
      }}>check-box-group</Button>


    </View>
  )
}
