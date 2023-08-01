import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * AI-人脸识别
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopFaceDetect',
        func: null,
      },
      {
        id: 'initFaceDetect',
        func: null,
      },
      {
        id: 'faceDetect',
        func: null,
      },
      {
        id: 'checkIsSupportFacialRecognition',
        func: null,
      },
      {
        id: 'startFacialRecognitionVerify',
        func: null,
      },
      {
        id: 'startFacialRecognitionVerifyAndUploadVideo',
        func: null,
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        {list.map((item) => {
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
