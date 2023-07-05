import {View, Image, MatchMedia} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './index.scss'
import React from "react";

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })


  return (
    <View className='index'>
      <MatchMedia minWidth={500}>
        <Image src={'https://t7.baidu.com/it/u=1956604245,3662848045&fm=193&f=GIF'}/>
      </MatchMedia>
    </View>
  )
}
