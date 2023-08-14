import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 设备-联系人
 * @returns
 */


export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'addPhoneContact',
        inputData: {
          firstName: 'xh',
          nickName: '校花',
          lastName: 'L',
          mobilePhoneNumber: '13456846212',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('addPhoneContact')
          console.log(this.state.list, data, apiIndex)
          Taro.addPhoneContact({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              Taro.showToast({
                title: `联系人创建成功:${res.errMsg}`,
              })
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
              Taro.showToast({
                title: `联系人创建失败:${res.errMsg}`,
              })
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'chooseContact',
        func: null,
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
