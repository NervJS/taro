import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

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
          TestConsole.consoleTest('createInnerAudioContext')
          innercontext = Taro.createInnerAudioContext()
          innercontext.src = 'https://storage.360buyimg.com/jdrd-blog/27.mp3'
          innercontext.startTime = 0
          innercontext.autoplay = true
          innercontext.loop = false
          innercontext.volume = 1
          innercontext.playbackRate = 1
          innercontext.currentTime = 0
          innercontext.referrerPolicy = 'origin'
          TestConsole.consoleNormal('create innerAudioContext :', innercontext)
        },
      },
      {
        id: 'InnerAudioContext_play',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_play')
          innercontext.play()
        },
      },
      {
        id: 'InnerAudioContext_pause',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_pause')
          innercontext.pause()
        },
      },
      {
        id: 'InnerAudioContext_stop',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_stop')
          innercontext.stop()
        },
      },
      {
        id: 'InnerAudioContext_seek',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_seek')
          innercontext.seek(150)
        },
      },
      {
        id: 'InnerAudioContext_destroy',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_destroy')
          innercontext.destroy()
        },
      },
      {
        id: 'InnerAudioContext_onCanplay',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onCanplay')
          innercontext.onCanplay(() => {
            TestConsole.consoleNormal('onCanplay callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_onPlay',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onPlay')
          innercontext.onPlay(() => {
            TestConsole.consoleNormal('onPlay callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_onPause',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onPause')
          innercontext.onPause(() => {
            TestConsole.consoleNormal('onPause callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_onStop',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onStop')
          innercontext.onStop(() => {
            TestConsole.consoleNormal('onStop callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_onEnded',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onEnded')
          innercontext.onEnded(() => {
            TestConsole.consoleNormal('onEnded callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_onTimeUpdate',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onTimeUpdate')
          innercontext.onTimeUpdate(() => {
            TestConsole.consoleNormal('onTimeUpdate callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_onError-音频出错才能触发',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onError')
          innercontext.onError(() => {
            TestConsole.consoleNormal('onError callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_onWaiting-音频缓冲不足暂停才能触发',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onWaiting')
          innercontext.onWaiting(() => {
            TestConsole.consoleNormal('onWaiting callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_onSeeking',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onSeeking')
          innercontext.onSeeking(() => {
            TestConsole.consoleNormal('onSeeking callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_onSeeked',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_onSeeked')
          innercontext.onSeeked(() => {
            TestConsole.consoleNormal('onSeeked callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offCanplay',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offCanplay')
          innercontext.offCanplay(() => {
            TestConsole.consoleNormal('offCanplay callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offPlay',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offPlay')
          innercontext.offPlay(() => {
            TestConsole.consoleNormal('offPlay callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offPause',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offPause')
          innercontext.offPause(() => {
            TestConsole.consoleNormal('offPause callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offStop',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offStop')
          innercontext.offStop(() => {
            TestConsole.consoleNormal('offStop callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offEnded',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offEnded')
          innercontext.offEnded(() => {
            TestConsole.consoleNormal('offEnded callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offTimeUpdate',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offTimeUpdate')
          innercontext.offTimeUpdate(() => {
            TestConsole.consoleNormal('offTimeUpdate callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offError',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offError')
          innercontext.offError(() => {
            TestConsole.consoleNormal('offError callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offWaiting',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offWaiting')
          innercontext.offWaiting(() => {
            TestConsole.consoleNormal('offWaiting callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offSeeking',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offSeeking')
          innercontext.offSeeking(() => {
            TestConsole.consoleNormal('offSeeking callback')
          })
        },
      },
      {
        id: 'InnerAudioContext_offSeeked',
        func: () => {
          TestConsole.consoleTest('InnerAudioContext_offSeeked')
          innercontext.offSeeked(() => {
            TestConsole.consoleNormal('offSeeked callback')
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
