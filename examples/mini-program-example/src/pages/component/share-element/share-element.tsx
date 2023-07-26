import { View, Text, Button, PageContainer, ShareElement } from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './share-element.scss'
import React, {useState} from "react";
import Header from "../../../components/head/head";
import ComponentState from "../../../components/component_state/component_state";


export default function PageView() {

  const [container_show, setContainerShow] = useState(false);
  const [position, setTransitionPosition] = useState('bottom');
  const [round, setRound] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState('overlay_black');

  useLoad(() => {
    console.log('Page loaded.')
  })


  return (
    <View className='components-page'>
      <View className='components-page__header'>
        <Header title='PageContainer'></Header>
         <ComponentState platform='H5' rate='10'> </ComponentState>
      </View>
      <View className='index'>
        <ShareElement key={"aaa"}>
          ShareElement动画正在开发中……
        </ShareElement>
      </View>
    </View>
  )
}
