import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 媒体-录音
 * @returns
 */
let recordTimeInterval
let recorderManager

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopRecord--Taro(暂不支持)',
        func: () => {
          Taro.stopRecord()
        },
      },
      {
        id: 'startRecord--Taro(暂不支持)',
        func: () => {
          this.setState({
            recording: true,
          })
          const options = {
            duration: 50000,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 192000,
            format: 'aac',
            frameSize: 50,
          }
          Taro.startRecord(options as any)
        },
      },
      {
        id: 'getRecoederManager',
        func: () => {
          TestConsole.consoleTest('getRecoederManager')
          recorderManager = Taro.getRecorderManager()
        },
      },
      {
        id: 'recorderManager_start',
        func: () => {
          TestConsole.consoleTest('recorderManager_start')
          this.setState({
            recording: true,
          })
          const options = {
            duration: 50000,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 192000,
            format: 'aac',
            frameSize: 50,
          }
          recorderManager.start(options)
        },
      },
      {
        id: 'recorderManager_stop',
        func: () => {
          TestConsole.consoleTest('recorderManager_stop')
          recorderManager.stop()
        },
      },

      {
        id: 'recorderManager_pause',
        func: () => {
          TestConsole.consoleTest('recorderManager_pause')
          recorderManager.pause()
        },
      },
      {
        id: 'recorderManager_resume',
        func: () => {
          TestConsole.consoleTest('recorderManager_resume')
          recorderManager.resume()
        },
      },
      {
        id: 'recorderManager_onError',
        func: () => {
          TestConsole.consoleTest('recorderManager_onError')
          recorderManager.onError(() => {
            TestConsole.consoleNormal('onError callback')
          })
        },
      },
      {
        id: 'recorderManager_onFrameRecorded',
        func: () => {
          TestConsole.consoleTest('recorderManager_onFrameRecorded')
          recorderManager.onFrameRecorded(() => {
            TestConsole.consoleNormal('onFrameRecorded callback')
          })
        },
      },
      {
        id: 'recorderManager_onInterruptionBegin',
        func: () => {
          TestConsole.consoleTest('recorderManager_onInterruptionBegin')
          const that = this
          recorderManager.onInterruptionBegin(() => {
            TestConsole.consoleNormal('onInterruptionBegin callback')
            that.setState({
              recording: false,
            })
            // 清除录音计时器
            clearInterval(recordTimeInterval)
          })
        },
      },
      {
        id: 'recorderManager_onInterruptionEnd',
        func: () => {
          TestConsole.consoleTest('recorderManager_onInterruptionEnd')
          const that = this
          recorderManager.onInterruptionEnd(() => {
            TestConsole.consoleNormal('onInterruptionEnd callback')
            that.setState({
              recording: true,
            })
            // 清除录音计时器
            recordTimeInterval = setInterval(() => {
              const recordTime = that.state.recordTime + 1
              that.setState({
                formatedRecordTime: that.formatTime(recordTime),
                recordTime,
              })
            }, 1000)
          })
        },
      },
      {
        id: 'recorderManager_onPause',
        func: () => {
          TestConsole.consoleTest('recorderManager_onPause')
          const that = this
          recorderManager.onPause(() => {
            TestConsole.consoleNormal('onPause callback')
            that.setState({
              recording: false,
            })
            // 清除录音计时器
            clearInterval(recordTimeInterval)
          })
        },
      },
      {
        id: 'recorderManager_onResume',
        func: () => {
          TestConsole.consoleTest('recorderManager_onResume')
          const that = this
          recorderManager.onResume(() => {
            TestConsole.consoleNormal('onResume callback')
            // 录音时长记录 每秒刷新
            that.setState({
              recording: true,
            })
            recordTimeInterval = setInterval(() => {
              const recordTime = that.state.recordTime + 1
              that.setState({
                formatedRecordTime: that.formatTime(recordTime),
                recordTime,
              })
            }, 1000)
          })
        },
      },
      {
        id: 'recorderManager_onStart',
        func: () => {
          TestConsole.consoleTest('recorderManager_onStart')
          const that = this
          recorderManager.onStart(() => {
            TestConsole.consoleNormal('onStart callback')
            that.setState({
              recordTime: 0,
            })
            // 录音时长记录 每秒刷新
            recordTimeInterval = setInterval(() => {
              const recordTime = that.state.recordTime + 1
              that.setState({
                formatedRecordTime: that.formatTime(recordTime),
                recordTime,
              })
            }, 1000)
          })
        },
      },
      {
        id: 'recorderManager_onStop',
        func: () => {
          TestConsole.consoleTest('recorderManager_onStop')
          const that = this
          recorderManager.onStop(() => {
            TestConsole.consoleNormal('onStop callback')
            that.setState({
              recording: false,
            })
            // 清除录音计时器
            clearInterval(recordTimeInterval)
          })
        },
      },
    ],
    recording: false,
    recordTime: 0,
    formatedRecordTime: '00:00:00',
  }
  formatTime(time) {
    const hour = parseInt(time / 3600 + '')
    time %= 3600
    const minute = parseInt(time / 60 + '')
    time = parseInt((time % 60) + '')
    const second = time
    return [hour, minute, second]
      .map((n) => {
        n = n.toString()
        return n[1] ? n : `0${n}`
      })
      .join(':')
  }
  render() {
    const { recording, formatedRecordTime, list } = this.state
    return (
      <View className='api-page'>
        <View className='timer'>
          <View>{recording ? '| |' : '| >'}</View>
          <View>{formatedRecordTime}</View>
        </View>
        {list.map((item) => {
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
