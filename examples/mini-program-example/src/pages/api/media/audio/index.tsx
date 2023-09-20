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
let audioContext
let currentAudio
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
            useWebAudioImplement: true, // 使用 Web Audio API 实现
          })
          this.setState((preState: any) => {
            // 每创建一个实例，就往innerConTextList数组中添加
            return (preState.innerConTextList = [...preState.innerConTextList, innercontext])
          })
          this.setState((preState: any) => {
            // 每创建一个音频实例，让count自加1
            return { count: preState.count + 1 }
          })
          TestConsole.consoleNormal('create innerAudioContext :', innercontext)
        },
      },
      {
        id: 'set',
        inputData: {
          src: 'https://storage.360buyimg.com/jdrd-blog/27.mp3', // 音频播放地址
          startTime: 0, // 播放开始位置
          autoplay: true, // 是否自由开始播放
          loop: false, // 是否循环播放
          volume: 1, // 音量范围0~1
          playbackRate: 1, // 播放速度，0.5~2.0
          referrerPolicy: 'origin', // 发送完整的音频
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
          this.setState({ isPlay: true })
        },
      },
      {
        id: 'play',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_play')
          if (this.state.innerConTextList.length > 1) {
            // 当AudioList数组中只要有音频实例，便利数组，播放所有音频实例
            this.state.innerConTextList.map((audio: any) => {
              audio.play()
              this.setState({ isPlay: true })
            })
          } else if (this.state.innerConTextList.length === 1) {
            // 当innerConTextList数组只有一个音频实例，使用当前音频实例来播放并修改状态，通过count数值恢复innerConTextList数组
            if (this.state.count !== 0) {
              this.setState((preState: any) => {
                return (preState.innerConTextList = [...preState.innerConTextList, innercontext])
              })
              this.setState((preState: any) => {
                return { count: preState.count - 1 }
              })
            }
            this.state.innerConTextList.map((audio: any) => {
              audio.play()
              this.setState({ isPlay: true })
            })
          } else {
            // 当innerConTextList数组中没有音频实例，向右移动一个指针，恢复一个音频实例
            this.setState((preState: any) => {
              return (preState.innerConTextList = [...preState.innerConTextList, innercontext])
            })
            innercontext.play()
            this.setState({ isPlay: true })
          }
        },
      },
      {
        id: 'pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_pause')
          if (this.state.innerConTextList.length > 1 && this.state.isPlay === true) {
            // 当innerConTextList数组中只要有多个音频实例并且当前音频实例正在播放，就获取到当前的音频实例，来暂停并修改状态
            currentAudio = this.state.innerConTextList[this.state.innerConTextList.length - 1]
            currentAudio.pause()
            this.setState({ isPlay: false })
            this.setState((preState: any) => {
              const newInnerAudioList = [...preState.innerConTextList]
              newInnerAudioList.length--
              return { innerConTextList: newInnerAudioList }
            })
          } else if (this.state.innerConTextList.length >= 1 && this.state.isPlay === false) {
            // 当innerConTextList数组中只要有多个音频实例并且当前实例是暂停状态，就获取到前一个的音频实例，来暂停并修改状态
            currentAudio = this.state.innerConTextList[this.state.innerConTextList.length - 1]
            currentAudio.pause()
            this.setState({ isPlay: false })
            this.setState((preState: any) => {
              const newInnerAudioList = [...preState.innerConTextList]
              newInnerAudioList.length--
              return { innerConTextList: newInnerAudioList }
            })
          } else if (this.state.innerConTextList.length === 1) {
            // 当innerConTextList数组中只要一个音频实例时，直接暂停并修改状态
            innercontext.pause()
            this.setState({ isPlay: false })
          }
        },
      },
      {
        id: 'stop',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_stop')
          if (this.state.innerConTextList.length > 1) {
            // 当innerConTextList数组中只要有音频实例，获取到当前音频实例，直接调用stop
            currentAudio = this.state.innerConTextList[this.state.innerConTextList.length - 1]
            currentAudio.stop()
            this.setState((preState: any) => {
              const newInnerAudioList = [...preState.innerConTextList]
              newInnerAudioList.length--
              return { innerConTextList: newInnerAudioList }
            })
          } else if (this.state.innerConTextList.length === 1) {
            // 当innerConTextList数组中有一个音频实例，使用当前音频实例停止
            innercontext.stop()
          } else {
            // 当innerConTextList数组中没有音频实例，向右移动一个指针，恢复一个音频实例
            this.setState((preState: any) => {
              return (preState.innerConTextList = [...preState.innerConTextList, innercontext])
            })
            innercontext.stop()
          }
        },
      },
      {
        id: 'seek',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_seek')
          if (this.state.innerConTextList.length > 1) {
            // 当innerConTextList数组中只要有多个音频实例，就先获取当前实例来跳转
            currentAudio = this.state.innerConTextList[this.state.innerConTextList.length - 1]
            currentAudio.seek(150)
          } else if (this.state.innerConTextList.length === 1) {
            // 当innerConTextList数组只有一个音频实例，直接停止
            innercontext.seek(150)
          } else {
            // 当innerConTextList数组不存在音频实例，向右移动一个指针，使用当前音频实例来停止
            this.setState((preState: any) => {
              return (preState.innerConTextList = [...preState.innerConTextList, innercontext])
            })
            innercontext.seek(150)
          }
        },
      },
      {
        id: 'destroy',
        func: (apiIndex) => {
          TestConsole.consoleTest('InnerAudioContext_destroy')
          if (this.state.innerConTextList.length > 1) {
            // 只要innerConTextList数组中有音频实例，直接销毁
            currentAudio = this.state.innerConTextList[this.state.innerConTextList.length - 1]
            currentAudio.destroy()
            this.setState((preState: any) => {
              const newInnerAudioList = [...preState.innerConTextList]
              newInnerAudioList.length--
              return { innerConTextList: newInnerAudioList }
            })
          } else if (this.state.innerConTextList.length === 1) {
            // 当innerConTextList数组恢复一个音频实例，直接销毁
            innercontext.destroy()
          }
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
      {
        id: 'createAudioContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('createAudioContext')
          const str = this.state.IdList[this.state.IdList.length - 1] // 获取IdList数组中的最后一个id
          audioContext = Taro.createAudioContext(str) // 根据id来创建音频实例
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

  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
