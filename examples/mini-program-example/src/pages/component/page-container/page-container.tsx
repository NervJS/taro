import {View, Text, Button, PageContainer} from '@tarojs/components'
import {useLoad} from '@tarojs/taro'
import './page-container.scss'
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
         <ComponentState platform='H5' rate='100'> </ComponentState>
      </View>
      <View className='index'>
        <PageContainer show={container_show} round={round} position={position} overlay={overlay}
                       overlayStyle={overlayStyle} bindclickoverlay={() => (setContainerShow(false))}
                       bindbeforeenter={() => {
                         console.log("==bindbeforeenter==")
                       }}
                       bindenter={() => {
                         console.log("==bindenter==")
                       }}
                       bindafterenter={() => {
                         console.log("==bindafterenter==")
                       }}
                       bindbeforeleave={() => {
                         console.log("==bindbeforeleave==")
                       }}
                       bindleave={() => {
                         console.log("==bindleave==")
                       }}
                       bindafterleave={() => {
                         console.log("==bindafterleave==")
                       }}
                       duration={2000}
                       zIndex={20}
                       customStyle={'customStyle'}
        >
          <Text>Hello world!</Text>
          <Text>Hello world!</Text>
          <Text>Hello world!</Text>
          <Text>Hello world!</Text>
          <Button onClick={() => (
            setContainerShow(false)
          )}>关闭</Button>
        </PageContainer>


        <View style={{display: "flow"}}>
          <Text>弹出位置</Text>
          <Button onClick={() => {
            setTransitionPosition("right")
            setContainerShow(true)
          }}>右侧弹出</Button>

          <Button onClick={() => {
            setTransitionPosition("top")
            setContainerShow(true)
          }}>顶部弹出</Button>


          <Button onClick={() => {
            setTransitionPosition("bottom")
            setContainerShow(true)
          }}>底部弹出</Button>

          <Button onClick={() => {
            setTransitionPosition("center")
            setContainerShow(true)
          }}>中央弹出</Button>

          <Text>弹出圆角</Text>

          <Button onClick={() => {
            if (round) {
              setRound(false)
            } else {
              setRound(true)
            }
            setContainerShow(true)
          }}>设置圆角</Button>

          <Text>遮罩层</Text>

          <Button onClick={() => {
            if (overlay) {
              setOverlay(false)
            } else {
              setOverlay(true)
            }
            setContainerShow(true)
          }}>设置有遮罩</Button>

          <Button onClick={() => {
            setOverlayStyle('overlay_black')
            setContainerShow(true)
          }}>黑色半透明遮罩</Button>

          <Button onClick={() => {
            setOverlayStyle('overlay_white')
            setContainerShow(true)
          }}>白色半透明遮罩</Button>
        </View>

      </View>
    </View>
  )
}
