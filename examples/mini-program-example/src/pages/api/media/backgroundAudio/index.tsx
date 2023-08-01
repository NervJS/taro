import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

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
        func: () => {
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
          console.log('get backgroundAudioManager :', backgroundAudioManager)
        },
      },
      {
        id: 'BackgroundAudioManager_play',
        func: () => {
          backgroundAudioManager.play()
          console.log('backgroundAudioManager play')
        },
      },
      {
        id: 'BackgroundAudioManager_pause',
        func: () => {
          backgroundAudioManager.pause()
          console.log('backgroundAudioManager pause')
        },
      },
      {
        id: 'BackgroundAudioManager_stop',
        func: () => {
          backgroundAudioManager.stop()
          console.log('backgroundAudioManager stop')
        },
      },
      {
        id: 'BackgroundAudioManager_seek',
        func: () => {
          backgroundAudioManager.seek(150)
          console.log('backgroundAudioManager seek')
        },
      },
      {
        id: 'BackgroundAudioManager_onCanplay',
        func: () => {
          backgroundAudioManager.onCanplay(() => {
            console.log('onCanplay callback')
          })
          console.log('backgroundAudioManager onCanplay')
        },
      },
      {
        id: 'BackgroundAudioManager_onWaiting',
        func: () => {
          backgroundAudioManager.onPlay(() => {
            console.log('onWaiting callback')
          })
          console.log('backgroundAudioManager onWaiting')
        },
      },
      {
        id: 'backgroundAudioManagert_onError',
        func: () => {
          backgroundAudioManager.onError(() => {
            console.log('onError callback')
          })
          console.log('backgroundAudioManager onError')
        },
      },
      {
        id: 'BackgroundAudioManager_onPlay',
        func: () => {
          backgroundAudioManager.onPlay(() => {
            console.log('onPlay callback')
          })
          console.log('innerAudioContext onPlay')
        },
      },
      {
        id: 'BackgroundAudioManager_onPause',
        func: () => {
          backgroundAudioManager.onPause(() => {
            console.log('onPause callback')
          })
          console.log('backgroundAudioManager onPause')
        },
      },
      {
        id: 'BackgroundAudioManager_onSeeking',
        func: () => {
          backgroundAudioManager.onSeeking(() => {
            console.log('onSeeking callback')
          })
          console.log('backgroundAudioManager onSeeking')
        },
      },
      {
        id: 'BackgroundAudioManager_onSeeked',
        func: () => {
          backgroundAudioManager.onSeeked(() => {
            console.log('onSeeked callback')
          })
          console.log('backgroundAudioManager onSeeked')
        },
      },
      {
        id: 'BackgroundAudioManager_onEnded',
        func: () => {
          backgroundAudioManager.onEnded(() => {
            console.log('onEnded callback')
          })
          console.log('backgroundAudioManager onEnded')
        },
      },
      {
        id: 'BackgroundAudioManager_onStop',
        func: () => {
          backgroundAudioManager.onStop(() => {
            console.log('onStop callback')
          })
          console.log('backgroundAudioManager onStop')
        },
      },
      {
        id: 'BackgroundAudioManager_onTimeUpdate',
        func: () => {
          backgroundAudioManager.onTimeUpdate(() => {
            console.log('onTimeUpdate callback')
          })
          console.log('backgroundAudioManager onTimeUpdate')
        },
      },
      {
        id: 'BackgroundAudioManager_onPrev',
        func: () => {
          backgroundAudioManager.onPrev(() => {
            console.log('onPrev callback')
          })
          console.log('backgroundAudioManager onPrev')
        },
      },
      {
        id: 'BackgroundAudioManager_onNext',
        func: () => {
          backgroundAudioManager.onNext(() => {
            console.log('onNext callback')
          })
          console.log('backgroundAudioManager onNext')
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
