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
const canPlayCallback = () => {
  TestConsole.consoleNormal('on/offCanplay callback')
}

const playCallback = () => {
  TestConsole.consoleNormal('on/offPlay callback')
}

const pauseCallback = () => {
  TestConsole.consoleNormal('on/offPause callback')
}

const stopCallback = () => {
  TestConsole.consoleNormal('on/offStop callback')
}

const endedCallback = () => {
  TestConsole.consoleNormal('on/offEnded callback')
}

const timeUpdateCallback = () => {
  TestConsole.consoleNormal('on/offTimeUpdate callback')
}

const errorCallback = () => {
  TestConsole.consoleNormal('on/offError callback')
}

const waitingCallback = () => {
  TestConsole.consoleNormal('on/offWaiting callback')
}

const seekingCallback = () => {
  TestConsole.consoleNormal('on/offseeking callback')
}

const seekedCallback = () => {
  TestConsole.consoleNormal('on/offseeked callback')
}
let innercontext
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createInnerAudioContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('createInnerAudioContext_native')
          innercontext = Taro.createInnerAudioContext()
          TestConsole.consoleNormal('create innerAudioContext :', innercontext)
        },
      },
      {
        id: 'createInnerAudioContext_{}',
        func: (apiIndex) => {
          TestConsole.consoleTest('createInnerAudioContext_native')
          innercontext = Taro.createInnerAudioContext({})
          TestConsole.consoleNormal('create innerAudioContext :', innercontext)
        },
      },
      {
        id: 'createInnerAudioContext_',
        func: (apiIndex) => {
          TestConsole.consoleTest('createInnerAudioContext_h5')
          innercontext = Taro.createInnerAudioContext({
            useWebAudioImplement: true
          })
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
          referrerPolicy: 'origin'
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('InnerAudioContext_set')
          innercontext.autoplay = data.autoplay
          innercontext.src = data.src
          innercontext.startTime = data.startTime
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
          innercontext.onCanplay(canPlayCallback)
        },
      },
      {
        id: 'onPlay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onPlay')
          innercontext.onPlay(playCallback)
        },
      },
      {
        id: 'onPause',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onPause')
          innercontext.onPause(pauseCallback)
        },
      },
      {
        id: 'onStop',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onStop')
          innercontext.onStop(stopCallback)
        },
      },
      {
        id: 'onEnded',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onEnded')
          innercontext.onEnded(endedCallback)
        },
      },
      {
        id: 'onTimeUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onTimeUpdate')
          innercontext.onTimeUpdate(timeUpdateCallback)
        },
      },
      {
        id: 'onError-音频出错才能触发',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onError')
          innercontext.onError(errorCallback)
        },
      },
      {
        id: '_onWaiting-音频缓冲不足暂停才能触发',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onWaiting')
          innercontext.onWaiting(waitingCallback)
        },
      },
      {
        id: 'onSeeking',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onSeeking')
          innercontext.onSeeking(seekingCallback)
        },
      },
      {
        id: 'onSeeked',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onSeeked')
          innercontext.onSeeked(seekedCallback)
        },
      },
      {
        id: 'offCanplay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offCanplay')
          innercontext.offCanplay(canPlayCallback)
        },
      },
      {
        id: 'offPlay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offPlay')
          innercontext.offPlay(playCallback)
        },
      },
      {
        id: 'offPause',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offPause')
          innercontext.offPause(pauseCallback)
        },
      },
      {
        id: 'offStop',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offStop')
          innercontext.offStop(stopCallback)
        },
      },
      {
        id: 'offEnded',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offEnded')
          innercontext.offEnded(endedCallback)
        },
      },
      {
        id: 'offTimeUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offTimeUpdate')
          innercontext.offTimeUpdate(timeUpdateCallback)
        },
      },
      {
        id: 'offError',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offError')
          innercontext.offError(errorCallback)
        },
      },
      {
        id: 'offWaiting',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offWaiting')
          innercontext.offWaiting(waitingCallback)
        },
      },
      {
        id: 'offSeeking',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offSeeking')
          innercontext.offSeeking(seekingCallback)
        },
      },
      {
        id: 'offSeeked',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offSeeked')
          innercontext.offSeeked(seekedCallback)
        },
      },
    ],
  }
  render () {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
