import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
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
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
