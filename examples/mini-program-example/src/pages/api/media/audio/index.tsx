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
let audioContext
let currentAudio
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createInnerAudioContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('createInnerAudioContext_native')
          if (innercontext !== undefined) {
            innercontext.destroy()
            TestConsole.consoleNormal('innerAudioContext destroy:', innercontext)
          }
          innercontext = Taro.createInnerAudioContext()
          TestConsole.consoleResult.call(this, innercontext, apiIndex)
        },
      },
      {
        id: 'createInnerAudioContext_{}',
        func: (apiIndex) => {
          TestConsole.consoleTest('createInnerAudioContext_native')
          if (innercontext !== undefined) {
            innercontext.destroy()
            TestConsole.consoleNormal('innerAudioContext destroy:', innercontext)
          }
          innercontext = Taro.createInnerAudioContext({})
          TestConsole.consoleResult.call(this, innercontext, apiIndex)
        },
      },
      {
        id: 'createInnerAudioContext_',
        func: (apiIndex) => {
          TestConsole.consoleTest('createInnerAudioContext_h5')
          if (innercontext !== undefined) {
            innercontext.destroy()
            TestConsole.consoleNormal('innerAudioContext destroy:', innercontext)
          }
          innercontext = Taro.createInnerAudioContext({
            useWebAudioImplement: true, // 使用 Web Audio API 实现
          })
          TestConsole.consoleResult.call(this, innercontext, apiIndex)
        },
      },
      {
        id: 'set',
        inputData: {
          src: 'http://img.51miz.com/preview/sound/00/26/73/51miz-S267356-423D33372.mp3', // 音频播放地址
          startTime: 0, // 播放开始位置
          autoplay: true, // 是否自由开始播放
          loop: false, // 是否循环播放
          volume: 1, // 音量范围0~1
          playbackRate: 1, // 播放速度，0.5~2.0
          referrerPolicy: 'origin', // 发送完整的音频
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('InnerAudioContext_set')
          if (innercontext !== undefined) {
            innercontext.src = data.src
            innercontext.autoplay = data.autoplay
            innercontext.startTime = data.startTime
            innercontext.loop = data.loop
            innercontext.volume = data.volume
            innercontext.playbackRate = data.playbackRate
            innercontext.referrerPolicy = data.referrerPolicy
          } else {
            TestConsole.consoleNormal('set error')
          }
        },
      },
      {
        id: 'set-volume',
        inputData: {
          volume: 1, // 音量范围0~1
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('InnerAudioContext_setVolume')
          if (innercontext !== undefined) {
            innercontext.volume = data.volume
          } else {
            TestConsole.consoleNormal('setVolume error')
          }
        },
      },
      {
        id: 'set-playbackRate',
        inputData: {
          playbackRate: 1, // 音量范围0.75~2.0
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('InnerAudioContext_setPlaybackRate')
          if (innercontext !== undefined) {
            innercontext.playbackRate = data.playbackRate
          } else {
            TestConsole.consoleNormal('setPlaybackRate error')
          }
        },
      },
      {
        id: 'set-loop',
        inputData: {
          loop: true, // 	是否循环播放
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('InnerAudioContext_setLoops')
          if (innercontext !== undefined) {
            innercontext.loop = data.loop
          } else {
            TestConsole.consoleNormal('setLoops error')
          }
        },
      },
      {
        id: 'play',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_play')
          if (innercontext !== undefined) {
            innercontext.play()
          } else {
            TestConsole.consoleNormal('play error')
          }
        },
      },
      {
        id: 'pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_pause')
          if (innercontext !== undefined) {
            innercontext.pause()
          } else {
            TestConsole.consoleNormal('pause error')
          }
        },
      },
      {
        id: 'stop',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_stop')
          if (innercontext !== undefined) {
            innercontext.stop()
          } else {
            TestConsole.consoleNormal('stop error')
          }
        },
      },
      {
        id: 'seek',
        inputData: {
          seekData: 150
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('InnerAudioContext_seek')
          if (innercontext !== undefined) {
            innercontext.seek(data.seekData)
          } else {
            TestConsole.consoleNormal('seek error')
          }
        },
      },
      {
        id: 'destroy',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_destroy')
          if (innercontext !== undefined) {
            innercontext.destroy()
          } else {
            TestConsole.consoleNormal('destroy error')
          }
        },
      },
      {
        id: 'onCanplay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onCanplay')
          if (innercontext !== undefined) {
            innercontext.onCanplay(this.canPlayCallback)
          } else {
            TestConsole.consoleNormal('onCanplay error')
          }
        },
      },
      {
        id: 'onPlay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onPlay')
          if (innercontext !== undefined) {
            innercontext.onPlay(this.playCallback)
          } else {
            TestConsole.consoleNormal('onPlay error')
          }
        },
      },
      {
        id: 'onPause',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onPause')
          if (innercontext !== undefined) {
            innercontext.onPause(this.pauseCallback)
          } else {
            TestConsole.consoleNormal('onPause error')
          }
        },
      },
      {
        id: 'onStop',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onStop')
          if (innercontext !== undefined) {
            innercontext.onStop(this.stopCallback)
          } else {
            TestConsole.consoleNormal('onStop error')
          }
        },
      },
      {
        id: 'onEnded',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onEnded')
          if (innercontext !== undefined) {
            innercontext.onEnded(this.endedCallback)
          } else {
            TestConsole.consoleNormal('onEnded error')
          }
        },
      },
      {
        id: 'onTimeUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onTimeUpdate')
          if (innercontext !== undefined) {
            innercontext.onTimeUpdate(this.timeUpdateCallback)
          } else {
            TestConsole.consoleNormal('onTimeUpdate error')
          }
        },
      },
      {
        id: 'onError-音频出错才能触发',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onError')
          if (innercontext !== undefined) {
            innercontext.onError(this.errorCallback)
          } else {
            TestConsole.consoleNormal('onError error')
          }
        },
      },
      {
        id: 'onWaiting-音频缓冲不足暂停才能触发',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onWaiting')
          if (innercontext !== undefined) {
            innercontext.onWaiting(this.waitingCallback)
          } else {
            TestConsole.consoleNormal('onWaiting error')
          }
        },
      },
      {
        id: 'onSeeking',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onSeeking')
          if (innercontext !== undefined) {
            innercontext.onSeeking(this.seekingCallback)
          } else {
            TestConsole.consoleNormal('onSeeking error')
          }
        },
      },
      {
        id: 'onSeeked',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_onSeeked')
          if (innercontext !== undefined) {
            innercontext.onSeeked(this.seekedCallback)
          } else {
            TestConsole.consoleNormal('onSeeked error')
          }
        },
      },
      {
        id: 'offCanplay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offCanplay')
          if (innercontext !== undefined) {
            innercontext.offCanplay(this.canPlayCallback)
          } else {
            TestConsole.consoleNormal('offCanplay error')
          }
        },
      },
      {
        id: 'offPlay',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offPlay')
          if (innercontext !== undefined) {
            innercontext.offPlay(this.playCallback)
          } else {
            TestConsole.consoleNormal('offPlay error')
          }
        },
      },
      {
        id: 'offPause',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offPause')
          if (innercontext !== undefined) {
            innercontext.offPause(this.pauseCallback)
          } else {
            TestConsole.consoleNormal('offPause error')
          }
        },
      },
      {
        id: 'offStop',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offStop')
          if (innercontext !== undefined) {
            innercontext.offStop(this.stopCallback)
          } else {
            TestConsole.consoleNormal('offStop error')
          }
        },
      },
      {
        id: 'offEnded',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offEnded')
          if (innercontext !== undefined) {
            innercontext.offEnded(this.endedCallback)
          } else {
            TestConsole.consoleNormal('offEnded error')
          }
        },
      },
      {
        id: 'offTimeUpdate',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offTimeUpdate')
          if (innercontext !== undefined) {
            innercontext.offTimeUpdate(this.timeUpdateCallback)
          } else {
            TestConsole.consoleNormal('offTimeUpdate error')
          }
        },
      },
      {
        id: 'offError',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offError')
          if (innercontext !== undefined) {
            innercontext.offError(this.errorCallback)
          } else {
            TestConsole.consoleNormal('offError error')
          }
        },
      },
      {
        id: 'offWaiting',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offWaiting')
          if (innercontext !== undefined) {
            innercontext.offWaiting(this.waitingCallback)
          } else {
            TestConsole.consoleNormal('offWaiting error')
          }
        },
      },
      {
        id: 'offSeeking',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offSeeking')
          if (innercontext !== undefined) {
            innercontext.offSeeking(this.seekingCallback)
          } else {
            TestConsole.consoleNormal('offSeeking error')
          }
        },
      },
      {
        id: 'offSeeked',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_offSeeked')
          if (innercontext !== undefined) {
            innercontext.offSeeked(this.seekedCallback)
          } else {
            TestConsole.consoleNormal('offSeeked error')
          }
        },
      },
      {
        id: 'createAudioContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('createAudioContext')
          const str = this.state.IdList[this.state.IdList.length - 1] // 获取IdList数组中的最后一个id
          audioContext = Taro.createAudioContext(str) // 根据id来创建音频实例
          TestConsole.consoleResult.call(this, audioContext, apiIndex)
          let count = this.setState((preState: any) => {
            // 每创建一个音频实例，让count自加1
            return { count: preState.count + 1 }
          })
          this.setState((preState: any) => {
            // 每创建一个音频实例，就往IdList数组中添加id
            return (preState.IdList = [...preState.IdList, `${this.state.mainStr}${count}`])
          })
          this.setState((preState: any) => {
            // 每创建一个音频实例，就往AudioList数组中添加
            return (preState.AudioList = [...preState.AudioList, audioContext])
          })
        },
      },
      {
        id: 'audioContext_play',
        func: (apiIndex) => {
          TestConsole.consoleTest('audioContext_play')
          if (this.state.AudioList.length > 1) {
            // 当AudioList数组中只要有音频实例，直接播放并修改状态
            this.state.AudioList.map((audio: any) => {
              audio.play()
              this.setState({ isPlay: true })
            })
          } else if (this.state.AudioList.length === 1) {
            // 当AudioList数组不存在音频实例，向右移动一个指针，使用当前音频实例来播放并修改状态
            if (this.state.count !== 0) {
              this.setState((preState: any) => {
                return (preState.AudioList = [...preState.AudioList, audioContext])
              })
              this.setState((preState: any) => {
                return { count: preState.count - 1 }
              })
            }
            this.state.AudioList.map((audio: any) => {
              audio.play()
              this.setState({ isPlay: true })
            })
          }
        },
      },
      {
        id: 'audioContext_pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('audioContext_pause')
          if (this.state.AudioList.length > 1 && this.state.isPlay === true) {
            // 当AudioList数组中只要有多个音频实例实例并且当前实例正在播放，就获取到当前的音频实例，来暂停并修改状态
            currentAudio = this.state.AudioList[this.state.AudioList.length - 1]
            currentAudio.pause()
            this.setState({ isPlay: false })
            this.setState((preState: any) => {
              const newAudioList = [...preState.AudioList]
              newAudioList.length--
              return { AudioList: newAudioList }
            })
          } else if (this.state.AudioList.length >= 1 && this.state.isPlay === false) {
            // 当AudioList数组中只要有多个音频实例并且当前实例是暂停，就获取到前一个音频实例，来暂停并修改状态
            currentAudio = this.state.AudioList[this.state.AudioList.length - 1]
            currentAudio.pause()
            this.setState({ isPlay: false })
            this.setState((preState: any) => {
              const newAudioList = [...preState.AudioList]
              newAudioList.length--
              return { AudioList: newAudioList }
            })
          } else if (this.state.AudioList.length === 1) {
            // 当AudioList数组中只要一个音频实例时，直接暂停并修改状态
            audioContext.pause()
            this.setState({ isPlay: false })
          }
        },
      },
      {
        id: 'audioContext_seek',
        inputData: {
          position: 120,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('audioContext_seek')
          if (this.state.AudioList.length > 1) {
            // 当AudioList数组中只要有多个音频实例，就先获取当前音频实例来跳转
            currentAudio = this.state.AudioList[this.state.AudioList.length - 1]
            currentAudio.seek(data.position)
          } else if (this.state.AudioList.length === 1) {
            // 当AudioList数组只有一个音频实例，直接跳转
            audioContext.seek(data.position)
          } else {
            this.setState((preState: any) => {
              // 当AudioList数组不存在音频实例，向右移动一个指针，使用当前音频实例来跳转
              return (preState.AudioList = [...preState.AudioList, audioContext])
            })
            audioContext.seek(data.position)
          }
        },
      },
      {
        id: 'audioContext_setSrc',
        inputData: {
          src: 'https://storage.360buyimg.com/jdrd-blog/27.mp3',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('audioContext_setSrc')
          audioContext.setSrc(data.src)
        },
      },
    ],
    innerConTextList: [], // innerConTextList音频实例数组,将每次创建的音频实例放进去
    IdList: ['myAudio'], // 将audioContext创建音频实例需要的id放在IdList数组
    AudioList: [], // AudioList音频实例数组,将每次创建的音频实例放进去
    isPlay: false, // 用来表示当前是否播放音频
    mainStr: 'myAudio', //初始id
    count: 0, // 和初始id拼接用来创建新的id
  }

  canPlayCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onCanPlayCallback', 9)
  }

  playCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onPlayCallback', 10)
  }

  pauseCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onPauseCallback', 11)
  }

  stopCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onStopCallback', 12)
  }

  endedCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onEndedCallback', 13)
  }

  timeUpdateCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onTimeUpdateCallback', 14)
  }

  errorCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onErrorCallback', 15)
  }

  waitingCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onWaitingCallback', 16)
  }

  seekingCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onSeekingCallback', 17)
  }

  seekedCallback = (res) => {
    TestConsole.consoleOnCallback.call(this, res, 'onSeekedCallback', 18)
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
