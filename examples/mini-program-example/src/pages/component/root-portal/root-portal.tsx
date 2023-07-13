import {View, Text, RootPortal} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './root-portal.scss'
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
        <Header title='RootPortal'></Header>
         <ComponentState platform='H5' rate='100'> </ComponentState>
      </View>
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
