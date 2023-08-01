import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-相机
 * @returns
 */
let cameraContext
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createCameraContext',
        func: () => {
          cameraContext = Taro.createCameraContext()
          console.log('createCameraContext success')
        },
      },
      {
        id: 'createCameraContext_onCameraFrame',
        func: () => {
          cameraContext.onCameraFrame((frame) => {
            console.log('onCameraFrame callback :', frame.data instanceof ArrayBuffer, frame.width, frame.height)
          })
        },
      },
      {
        id: 'createCameraContext_setZoom',
        func: () => {
          cameraContext.setZoom({
            zoom: 70,
            success: (res: any) => {
              console.log('cameraContext.setZoom success ', res.zoom, res.setZoom)
            },
            fail: (res: any) => {
              console.log('cameraContext.setZoom fail ', res)
            },
            complete: (res: any) => {
              console.log('cameraContext.setZoom complete ', res)
            },
          })
        },
      },
      {
        id: 'createCameraContext_startRecord',
        func: () => {
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
              console.log(
                'cameraContext.startRecord timeoutCallback ',
                res.result.tempThumbPath,
                res.result.tempVideoPath,
                res.result.height,
                res.result.width,
                res.result.size,
                res.result.duration
              )
            },
          })
        },
      },
      {
        id: 'createCameraContext_stopRecord',
        func: () => {
          cameraContext.stopRecord({
            success: (res) => {
              console.log('cameraContext.stopRecord success ', res.tempThumbPath, res.tempVideoPathes)
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
      {
        id: 'createCameraContext_takePhoto',
        func: () => {
          cameraContext.takePhoto({
            quality: 'normal',
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
