import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-日历
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'addPhoneRepeatCalendar',
        func: () => {
          TestConsole.consoleTest('addPhoneRepeatCalendar')
          Taro.addPhoneRepeatCalendar({
            title: '日历事件标题',
            startTime: new Date().getTime(),
            allDay: false,
            description: '事件说明',
            location: '事件位置',
            endTime: '',
            alarm: true,
            alarmOffset: 10,
            repeatInterval: 'day',
            repeatEndTime: new Date().getTime() + 360000,
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'addPhoneCalendar',
        func: () => {
          TestConsole.consoleTest('addPhoneCalendar')
          Taro.addPhoneCalendar({
            title: '日历事件标题',
            startTime: new Date().getTime(),
            allDay: false,
            description: '事件说明',
            location: '事件位置',
            endTime: '',
            alarm: true,
            alarmOffset: 10,
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((res) => {
            TestConsole.consoleReturn(res)
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
