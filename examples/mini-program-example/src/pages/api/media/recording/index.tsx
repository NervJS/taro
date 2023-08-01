import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
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
        id: 'stopRecord--recorderManager',
        func: () => {
          recorderManager.stop()
        },
      },
      {
        id: 'startRecord--recorderManager',
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
        id: 'pauseRecord',
        func: () => {
          recorderManager.pause()
        },
      },
      {
        id: 'resumeRecord',
        func: () => {
          recorderManager.resume()
        },
      },
      {
        id: 'getRecoederManager',
        func: () => {
          console.log('success-----on creating recorderManager ', Taro.getRecorderManager())
        },
      },
      {
        id: 'recorderManager',
        func: () => {
          const that = this
          recorderManager.onStart(() => {
            console.log('success-----recorderManage: onStart')
            // 录音时长记录 每秒刷新
            recordTimeInterval = setInterval(() => {
              const recordTime = that.state.recordTime + 1
              console.log(recordTime)
            }, 1000)
          })
          recorderManager.onStop((res) => {
            console.log('success-----recorderManage: onStop')
            // 清除录音计时器
            clearInterval(recordTimeInterval)
          })
          recorderManager.onResume(() => {
            console.log('success-----recorderManage: onResume')
            // 录音时长记录 每秒刷新
            recordTimeInterval = setInterval(() => {
              const recordTime = that.state.recordTime + 1
              console.log(recordTime)
            }, 1000)
          })
          recorderManager.onPause((res) => {
            console.log('success-----recorderManage: onPause', res)
            // 清除录音计时器
            clearInterval(recordTimeInterval)
          })
          recorderManager.onInterruptionBegin((res) => {
            console.log('success-----recorderManage: onInterruptionBegin', res)
            // 清除录音计时器
            clearInterval(recordTimeInterval)
          })
          recorderManager.onInterruptionEnd((res) => {
            console.log('success-----recorderManage: onInterruptionEnd', res)
            // 清除录音计时器
            recordTimeInterval = setInterval(() => {
              const recordTime = that.state.recordTime + 1
              console.log(recordTime)
            }, 1000)
          })
          recorderManager.onFrameRecorded((res) => {
            console.log('success-----recorderManage: onFrameRecorded', res)
          })
          recorderManager.onError((res) => {
            console.log('success-----recorderManage: onError', res)
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
