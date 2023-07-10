import {View, StickyHeader, StickySection} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './sticky-header.scss'
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
        <Header title='StickyHeader'></Header>
         <ComponentState platform='H5' rate='100'> </ComponentState>
      </View>
      <StickyHeader>
        <StickySection style={{background: '#aaaaaa'}}>
          吸顶布局容器测试
        </StickySection>
      </StickyHeader>
    </View>
  )
}
