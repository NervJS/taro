import {View, StickyHeader, StickySection} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './index.scss'
import React from "react";

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <StickyHeader>
        <StickySection style={{background: '#aaaaaa'}}>
          吸顶布局容器测试
        </StickySection>
      </StickyHeader>
    </View>
  )
}
