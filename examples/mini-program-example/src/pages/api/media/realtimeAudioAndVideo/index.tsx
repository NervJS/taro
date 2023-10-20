import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, ScrollView, LivePlayer } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 媒体-实时音视频
 * @returns
 */
let LivePlayerContext
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createLivePusherContext',
        func: null,
      },
      {
        id: 'createLivePlayerContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('createLivePlayerContext')
          LivePlayerContext = Taro.createLivePlayerContext('LivePlayer')
          TestConsole.consoleNormal('createLivePlayerContext ', LivePlayerContext)
        },
      },
      {
        id: 'LivePlayer_mute',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayer_mute')
          if (LivePlayerContext) {
            LivePlayerContext.mute({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayer_pause')
          if (LivePlayerContext) {
            LivePlayerContext.pause({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_stop',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_stop')
          if (LivePlayerContext) {
            LivePlayerContext.stop({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_play',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayer_play')
          if (LivePlayerContext) {
            LivePlayerContext.play({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_requestFullScreen',
        inputData: {
          direction: 0,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('LivePlayerContext_requestFullScreen')
          if (LivePlayerContext) {
            LivePlayerContext.requestFullScreen({
              ...data,
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
            setTimeout(() => {
              LivePlayerContext.exitFullScreen()
              TestConsole.consoleNormal('exitFullScreen')
            }, 8000)
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_resume',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayerContext_resume')
          if (LivePlayerContext) {
            LivePlayerContext.resume({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_snapshot',
        inputData: {
          quality: 'raw',
          sourceType: 'stream',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('LivePlayerContext_snapshot')
          if (LivePlayerContext) {
            LivePlayerContext.snapshot({
              ...data,
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_requestPictureInPicture_H5暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayerContext_requestPictureInPicture')
          if (LivePlayerContext) {
            LivePlayerContext.requestPictureInPicture({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePlayer_exitPictureInPicture_H5暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayerContext_exitPictureInPicture')
          if (LivePlayerContext) {
            LivePlayerContext.exitPictureInPicture({
              success: (res) => {
                TestConsole.consoleSuccess.call(this, res, apiIndex)
              },
              fail: (res) => {
                TestConsole.consoleFail.call(this, res, apiIndex)
              },
              complete: (res) => {
                TestConsole.consoleComplete.call(this, res, apiIndex)
              },
            })
          } else {
            TestConsole.consoleNormal('LivePlayerContext还未创建')
          }
        },
      },
      {
        id: 'LivePusherContext',
        func: null,
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      //@ts-ignore
      <View className='api-page'>
        <ButtonList buttonList={list} />
        <LivePlayer
          id='LivePlayer'
          src='https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-480p.flv'
          isLive
          cors
          soundMode='ear'
          type='flv'
        ></LivePlayer>
      </View>
    )
  }
}
