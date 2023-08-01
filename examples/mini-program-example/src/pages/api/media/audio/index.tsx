import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-音频
 * @returns
 */
let innercontext
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createInnerAudioContext',
        func: () => {
          innercontext = Taro.createInnerAudioContext()
          innercontext.src = 'https://storage.360buyimg.com/jdrd-blog/27.mp3'
          innercontext.startTime = 0
          innercontext.autoplay = true
          innercontext.loop = false
          innercontext.volume = 1
          innercontext.playbackRate = 1
          innercontext.currentTime = 0
          innercontext.referrerPolicy = 'origin'
          console.log('create innerAudioContext :', innercontext)
        },
      },
      {
        id: 'InnerAudioContext_play',
        func: () => {
          innercontext.play()
          console.log('innerAudioContext play')
        },
      },
      {
        id: 'InnerAudioContext_pause',
        func: () => {
          innercontext.pause()
          console.log('innerAudioContext pause')
        },
      },
      {
        id: 'InnerAudioContext_stop',
        func: () => {
          innercontext.stop()
          console.log('innerAudioContext stop')
        },
      },
      {
        id: 'InnerAudioContext_seek',
        func: () => {
          innercontext.seek(150)
          console.log('innerAudioContext seek')
        },
      },
      {
        id: 'InnerAudioContext_destroy',
        func: () => {
          innercontext.destroy()
          console.log('innerAudioContext destroy')
        },
      },
      {
        id: 'InnerAudioContext_onCanplay',
        func: () => {
          innercontext.onCanplay(() => {
            console.log('onCanplay callback')
          })
          console.log('innerAudioContext onCanplay')
        },
      },
      {
        id: 'InnerAudioContext_onPlay',
        func: () => {
          innercontext.onPlay(() => {
            console.log('onPlay callback')
          })
          console.log('innerAudioContext onPlay')
        },
      },
      {
        id: 'InnerAudioContext_onPause',
        func: () => {
          innercontext.onPause(() => {
            console.log('onPause callback')
          })
          console.log('innerAudioContext onPause')
        },
      },
      {
        id: 'InnerAudioContext_onStop',
        func: () => {
          innercontext.onStop(() => {
            console.log('onStop callback')
          })
          console.log('innerAudioContext onStop')
        },
      },
      {
        id: 'InnerAudioContext_onEnded',
        func: () => {
          innercontext.onEnded(() => {
            console.log('onEnded callback')
          })
          console.log('innerAudioContext onEnded')
        },
      },
      {
        id: 'InnerAudioContext_onTimeUpdate',
        func: () => {
          innercontext.onTimeUpdate(() => {
            console.log('onTimeUpdate callback')
          })
          console.log('innerAudioContext onTimeUpdate')
        },
      },
      {
        id: 'InnerAudioContext_onError-音频出错才能触发',
        func: () => {
          innercontext.onError(() => {
            console.log('onError callback')
          })
          console.log('innerAudioContext onError')
        },
      },
      {
        id: 'InnerAudioContext_onWaiting-音频缓冲不足暂停才能触发',
        func: () => {
          innercontext.onWaiting(() => {
            console.log('onWaiting callback')
          })
          console.log('innerAudioContext onWaiting')
        },
      },
      {
        id: 'InnerAudioContext_onSeeking',
        func: () => {
          innercontext.onSeeking(() => {
            console.log('onSeeking callback')
          })
          console.log('innerAudioContext onSeeking')
        },
      },
      {
        id: 'InnerAudioContext_onSeeked',
        func: () => {
          innercontext.onSeeked(() => {
            console.log('onSeeked callback')
          })
          console.log('innerAudioContext onSeeked')
        },
      },
      {
        id: 'InnerAudioContext_offCanplay',
        func: () => {
          innercontext.offCanplay(() => {
            console.log('offCanplay callback')
          })
          console.log('innerAudioContext offCanplay')
        },
      },
      {
        id: 'InnerAudioContext_offPlay',
        func: () => {
          innercontext.offPlay(() => {
            console.log('offPlay callback')
          })
          console.log('innerAudioContext offPlay')
        },
      },
      {
        id: 'InnerAudioContext_offPause',
        func: () => {
          innercontext.offPause(() => {
            console.log('offPause callback')
          })
          console.log('innerAudioContext offPause')
        },
      },
      {
        id: 'InnerAudioContext_offStop',
        func: () => {
          innercontext.offStop(() => {
            console.log('offStop callback')
          })
          console.log('innerAudioContext offStop')
        },
      },
      {
        id: 'InnerAudioContext_offEnded',
        func: () => {
          innercontext.offEnded(() => {
            console.log('offEnded callback')
          })
          console.log('innerAudioContext offEnded')
        },
      },
      {
        id: 'InnerAudioContext_offTimeUpdate',
        func: () => {
          innercontext.offTimeUpdate(() => {
            console.log('offTimeUpdate callback')
          })
          console.log('innerAudioContext offTimeUpdate')
        },
      },
      {
        id: 'InnerAudioContext_offError',
        func: () => {
          innercontext.offError(() => {
            console.log('offError callback')
          })
          console.log('innerAudioContext offError')
        },
      },
      {
        id: 'InnerAudioContext_offWaiting',
        func: () => {
          innercontext.offWaiting(() => {
            console.log('offWaiting callback')
          })
          console.log('innerAudioContext offWaiting')
        },
      },
      {
        id: 'InnerAudioContext_offSeeking',
        func: () => {
          innercontext.offSeeking(() => {
            console.log('offSeeking callback')
          })
          console.log('innerAudioContext offSeeking')
        },
      },
      {
        id: 'InnerAudioContext_offSeeked',
        func: () => {
          innercontext.offSeeked(() => {
            console.log('offSeeked callback')
          })
          console.log('innerAudioContext offSeeked')
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
