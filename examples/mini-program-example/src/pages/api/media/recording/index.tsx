import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

/**
 * 媒体-录音管理
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
          recorderManager = Taro.getRecorderManager()
          console.log('success-----on creating recorderManager')
        },
      },
      {
        id: 'recorderManager_start',
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
          recorderManager.start(options)
        },
      },
      {
        id: 'recorderManager_stop',
        func: () => {
          recorderManager.stop()
        },
      },

      {
        id: 'recorderManager_pause',
        func: () => {
          recorderManager.pause()
        },
      },
      {
        id: 'recorderManager_resume',
        func: () => {
          recorderManager.resume()
        },
      },
      {
        id: 'recorderManager_onError',
        func: () => {
          recorderManager.onError(() => {
            console.log('success-----recorderManage: onError')
          })
        },
      },
      {
        id: 'recorderManager_onFrameRecorded',
        func: () => {
          recorderManager.onFrameRecorded(() => {
            console.log('success-----recorderManage: onFrameRecorded')
          })
        },
      },
      {
        id: 'recorderManager_onInterruptionBegin',
        func: () => {
          const that = this
          recorderManager.onInterruptionBegin(() => {
            console.log('success-----recorderManage: onInterruptionBegin')
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
          const that = this
          recorderManager.onInterruptionEnd(() => {
            console.log('success-----recorderManage: onInterruptionEnd')
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
          const that = this
          recorderManager.onPause(() => {
            console.log('success-----recorderManage: onPause')
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
          const that = this
          recorderManager.onResume(() => {
            console.log('success-----recorderManage: onResume')
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
          const that = this
          recorderManager.onStart(() => {
            console.log('success-----recorderManage: onStart')
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
          const that = this
          recorderManager.onStop(() => {
            console.log('success-----recorderManage: onStop')
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
