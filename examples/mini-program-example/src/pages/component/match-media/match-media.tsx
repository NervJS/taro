import {View, Image, MatchMedia} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './match-media.scss'
import React from "react";
import Header from "../../../components/head/head";
import ComponentState from "../../../components/component_state/component_state";

export default function PageView() {
  useLoad(() => {
    console.log('Page loaded.')
  })


  return (
    <View className='components-page'>
      <View className='components-page__header'>
        <Header title='MatchMedia'></Header>
         <ComponentState platform='H5' rate='100'> </ComponentState>
      </View>
      <View className='index'>
        <MatchMedia minWidth={500}>
          <Image src={'https://t7.baidu.com/it/u=1956604245,3662848045&fm=193&f=GIF'}/>
        </MatchMedia>
      </View>
    </View>
  )
}
