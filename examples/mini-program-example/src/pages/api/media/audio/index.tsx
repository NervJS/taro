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
        func: (apiIndex) => {
          TestConsole.consoleTest('createInnerAudioContext')
          innercontext = Taro.createInnerAudioContext()
          TestConsole.consoleNormal('create innerAudioContext :', innercontext)
        },
      },
      {
        id: 'set',
        inputData: {
          src: 'https://storage.360buyimg.com/jdrd-blog/27.mp3',
          startTime: 0,
          autoplay: true,
          loop: false,
          volume: 1,
          playbackRate: 1,
          referrerPolicy: 'origin',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('InnerAudioContext_set')
          innercontext.src = data.src
          innercontext.startTime = data.startTime
          innercontext.autoplay = data.autoplay
          innercontext.loop = data.loop
          innercontext.volume = data.volume
          innercontext.playbackRate = data.playbackRate
          innercontext.referrerPolicy = data.referrerPolicy
        },
      },
      {
        id: 'play',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_play')
          innercontext.play()
        },
      },
      {
        id: 'pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_pause')
          innercontext.pause()
        },
      },
      {
        id: 'stop',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_stop')
          innercontext.stop()
        },
      },
      {
        id: 'seek',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_seek')
          innercontext.seek(150)
        },
      },
      {
        id: 'destroy',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_destroy')
          innercontext.destroy()
        },
      },
      {
        id: 'onCanplay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onCanplay')
          innercontext.onCanplay(() => {
            TestConsole.consoleNormal('onCanplay callback')
          })
        },
      },
      {
        id: 'onPlay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onPlay')
          innercontext.onPlay(() => {
            TestConsole.consoleNormal('onPlay callback')
          })
        },
      },
      {
        id: 'onPause',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onPause')
          innercontext.onPause(() => {
            TestConsole.consoleNormal('onPause callback')
          })
        },
      },
      {
        id: 'onStop',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onStop')
          innercontext.onStop(() => {
            TestConsole.consoleNormal('onStop callback')
          })
        },
      },
      {
        id: 'onEnded',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onEnded')
          innercontext.onEnded(() => {
            TestConsole.consoleNormal('onEnded callback')
          })
        },
      },
      {
        id: 'onTimeUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onTimeUpdate')
          innercontext.onTimeUpdate(() => {
            TestConsole.consoleNormal('onTimeUpdate callback')
          })
        },
      },
      {
        id: 'onError-音频出错才能触发',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onError')
          innercontext.onError(() => {
            TestConsole.consoleNormal('onError callback')
          })
        },
      },
      {
        id: '_onWaiting-音频缓冲不足暂停才能触发',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onWaiting')
          innercontext.onWaiting(() => {
            TestConsole.consoleNormal('onWaiting callback')
          })
        },
      },
      {
        id: 'onSeeking',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onSeeking')
          innercontext.onSeeking(() => {
            TestConsole.consoleNormal('onSeeking callback')
          })
        },
      },
      {
        id: 'onSeeked',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onSeeked')
          innercontext.onSeeked(() => {
            TestConsole.consoleNormal('onSeeked callback')
          })
        },
      },
      {
        id: 'offCanplay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offCanplay')
          innercontext.offCanplay(() => {
            TestConsole.consoleNormal('offCanplay callback')
          })
        },
      },
      {
        id: 'offPlay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offPlay')
          innercontext.offPlay(() => {
            TestConsole.consoleNormal('offPlay callback')
          })
        },
      },
      {
        id: 'offPause',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offPause')
          innercontext.offPause(() => {
            TestConsole.consoleNormal('offPause callback')
          })
        },
      },
      {
        id: 'offStop',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offStop')
          innercontext.offStop(() => {
            TestConsole.consoleNormal('offStop callback')
          })
        },
      },
      {
        id: 'offEnded',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offEnded')
          innercontext.offEnded(() => {
            TestConsole.consoleNormal('offEnded callback')
          })
        },
      },
      {
        id: 'offTimeUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offTimeUpdate')
          innercontext.offTimeUpdate(() => {
            TestConsole.consoleNormal('offTimeUpdate callback')
          })
        },
      },
      {
        id: 'offError',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offError')
          innercontext.offError(() => {
            TestConsole.consoleNormal('offError callback')
          })
        },
      },
      {
        id: 'offWaiting',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offWaiting')
          innercontext.offWaiting(() => {
            TestConsole.consoleNormal('offWaiting callback')
          })
        },
      },
      {
        id: 'offSeeking',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offSeeking')
          innercontext.offSeeking(() => {
            TestConsole.consoleNormal('offSeeking callback')
          })
        },
      },
      {
        id: 'offSeeked',
        func: (apiIndex) => {
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
