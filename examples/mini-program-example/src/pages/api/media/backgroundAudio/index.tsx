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
        id: 'play',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_play')
          backgroundAudioManager.play()
        },
      },
      {
        id: 'pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_pause')
          backgroundAudioManager.pause()
        },
      },
      {
        id: 'stop',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_stop')
          backgroundAudioManager.stop()
        },
      },
      {
        id: 'seek',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_seek')
          backgroundAudioManager.seek(150)
        },
      },
      {
        id: 'onCanplay',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onCanplay')
          backgroundAudioManager.onCanplay(() => {
            TestConsole.consoleNormal('onCanplay callback')
          })
        },
      },
      {
        id: 'onWaiting',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onWaiting')
          backgroundAudioManager.onPlay(() => {
            TestConsole.consoleNormal('onWaiting callback')
          })
        },
      },
      {
        id: 'onError',
        func: (apiIndex) => {
          TestConsole.consoleTest('backgroundAudioManagert_onError')
          backgroundAudioManager.onError(() => {
            TestConsole.consoleNormal('onError callback')
          })
        },
      },
      {
        id: 'onPlay',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onPlay')
          backgroundAudioManager.onPlay(() => {
            TestConsole.consoleNormal('onPlay callback')
          })
        },
      },
      {
        id: 'onPause',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onPause')
          backgroundAudioManager.onPause(() => {
            TestConsole.consoleNormal('onPause callback')
          })
        },
      },
      {
        id: 'onSeeking',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onSeeking')
          backgroundAudioManager.onSeeking(() => {
            TestConsole.consoleNormal('onSeeking callback')
          })
        },
      },
      {
        id: 'onSeeked',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onSeeked')
          backgroundAudioManager.onSeeked(() => {
            TestConsole.consoleNormal('onSeeked callback')
          })
        },
      },
      {
        id: 'onEnded',
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
        id: 'onTimeUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onTimeUpdate')
          backgroundAudioManager.onTimeUpdate(() => {
            TestConsole.consoleNormal('onTimeUpdate callback')
          })
        },
      },
      {
        id: 'onPrev_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('BackgroundAudioManager_onPrev')
          backgroundAudioManager.onPrev(() => {
            TestConsole.consoleNormal('onPrev callback')
          })
        },
      },
      {
        id: 'onNext_暂不支持',
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
