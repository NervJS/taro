import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-相机
 * @returns 
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createCameraContext',
        func: () => {
          const cameraContext = Taro.createCameraContext()
          console.log('createCameraContext success')
          cameraContext.takePhoto({
            success: (res) => {
              console.log('cameraContext.takePhoto success ', res)
            },
            fail: (res) => {
              console.log('cameraContext.takePhoto fail ', res)
            },
            complete: (res) => {
              console.log('cameraContext.takePhoto complete ', res)
            },
          })
          cameraContext.onCameraFrame((frame) => {
            console.log('onCameraFrame ', frame.data instanceof ArrayBuffer, frame.width, frame.height)
          })
          cameraContext.setZoom({
            zoom: 70,
            success: (res) => {
              console.log('cameraContext.setZoom success ', res)
            },
            fail: (res) => {
              console.log('cameraContext.setZoom fail ', res)
            },
            complete: (res) => {
              console.log('cameraContext.setZoom complete ', res)
            },
          })
          cameraContext.startRecord({
            success: (res) => {
              console.log('cameraContext.startRecord success ', res)
            },
            fail: (res) => {
              console.log('cameraContext.startRecord fail ', res)
            },
            complete: (res) => {
              console.log('cameraContext.startRecord complete ', res)
            },
            timeoutCallback: (res) => {
              console.log('cameraContext.startRecord timeoutCallback ', res)
            },
          })
          cameraContext.stopRecord({
            success: (res) => {
              console.log('cameraContext.stopRecord success ', res)
            },
            fail: (res) => {
              console.log('cameraContext.stopRecord fail ', res)
            },
            complete: (res) => {
              console.log('cameraContext.stopRecord complete ', res)
            },
          })
        },
      },
    ],
  }
  render() {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => {} : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
