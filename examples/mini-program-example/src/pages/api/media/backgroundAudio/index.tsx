import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 媒体-背景音频
 * @returns
 */
let backgroundAudioManager
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getBackgroundAudioManager',
        func: (apiIndex) => {
          TestConsole.consoleTest('getBackgroundAudioManager')
          backgroundAudioManager = Taro.getBackgroundAudioManager()
          backgroundAudioManager.src = 'https://storage.360buyimg.com/jdrd-blog/27.mp3'
          backgroundAudioManager.title = '此时此刻'
          backgroundAudioManager.epname = '此时此刻'
          backgroundAudioManager.singer = '许巍'
          backgroundAudioManager.coverImgUrl =
            'https://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
          backgroundAudioManager.webUrl =
            'https://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
          backgroundAudioManager.protocol = 'http'
          backgroundAudioManager.referrerPolicy = 'origin'
          TestConsole.consoleNormal('get backgroundAudioManager :', backgroundAudioManager)
        },
      },
      {
        id: 'BackgroundAudioManager_play',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_play')
          backgroundAudioManager.play()
        },
      },
      {
        id: 'BackgroundAudioManager_pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_pause')
          backgroundAudioManager.pause()
        },
      },
      {
        id: 'BackgroundAudioManager_stop',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_stop')
          backgroundAudioManager.stop()
        },
      },
      {
        id: 'BackgroundAudioManager_seek',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_seek')
          backgroundAudioManager.seek(150)
        },
      },
      {
        id: 'BackgroundAudioManager_onCanplay',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onCanplay')
          backgroundAudioManager.onCanplay(() => {
            TestConsole.consoleNormal('onCanplay callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onWaiting',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onWaiting')
          backgroundAudioManager.onPlay(() => {
            TestConsole.consoleNormal('onWaiting callback')
          })
        },
      },
      {
        id: 'backgroundAudioManagert_onError',
        func: (apiIndex) => {
          TestConsole.consoleTest('backgroundAudioManagert_onError')
          backgroundAudioManager.onError(() => {
            TestConsole.consoleNormal('onError callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onPlay',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onPlay')
          backgroundAudioManager.onPlay(() => {
            TestConsole.consoleNormal('onPlay callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onPause',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onPause')
          backgroundAudioManager.onPause(() => {
            TestConsole.consoleNormal('onPause callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onSeeking',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onSeeking')
          backgroundAudioManager.onSeeking(() => {
            TestConsole.consoleNormal('onSeeking callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onSeeked',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onSeeked')
          backgroundAudioManager.onSeeked(() => {
            TestConsole.consoleNormal('onSeeked callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onEnded',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onEnded')
          backgroundAudioManager.onEnded(() => {
            TestConsole.consoleNormal('onEnded callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onStop',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onStop')
          backgroundAudioManager.onStop(() => {
            TestConsole.consoleNormal('onStop callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onTimeUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onTimeUpdate')
          backgroundAudioManager.onTimeUpdate(() => {
            TestConsole.consoleNormal('onTimeUpdate callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onPrev_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onPrev')
          backgroundAudioManager.onPrev(() => {
            TestConsole.consoleNormal('onPrev callback')
          })
        },
      },
      {
        id: 'BackgroundAudioManager_onNext_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onNext')
          backgroundAudioManager.onNext(() => {
            TestConsole.consoleNormal('onNext callback')
          })
        },
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
