import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 开放接口-生物认证
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'startSoterAuthentication 指纹',
        func: () => {
          this.startSoterAuthentication('fingerPrint')
        },
      },
      {
        id: 'startSoterAuthentication 人脸',
        func: () => {
          this.startSoterAuthentication('facial')
        },
      },
      {
        id: 'startSoterAuthentication 声纹',
        func: () => {
          this.startSoterAuthentication('speech')
        },
      },
      {
        id: 'checkIsSupportSoterAuthentication',
        func: (apiIndex) => {
          Taro.checkIsSupportSoterAuthentication({
            success: (res) => {
              console.log('success-----', res)
            },
            fail: function (res) {
              console.log('fail-----', res)
            },
            complete: function (res) {
              console.log('complete-----', res)
            },
          })
        },
      },
      {
        id: 'checkIsSoterEnrolledInDevice',
        func: (apiIndex) => {
          const authModes = ['fingerPrint', 'facial', 'speech']
          authModes.forEach((mode) => {
            Taro.checkIsSoterEnrolledInDevice({
              checkAuthMode: mode as any,
              success: (res) => {
                console.log('success-----', mode, res)
              },
            })
          })
        },
      },
    ],
  }
  startSoterAuthentication = (authMode) => {
    Taro.startSoterAuthentication({
      requestAuthModes: [authMode],
      challenge: 'test',
      authContent: 'apitest',
      success: () => {
        Taro.showToast({
          title: '认证成功',
        })
      },
      fail: (err) => {
        console.error(err)
        Taro.showModal({
          title: '失败',
          content: '认证失败',
          showCancel: false,
        })
      },
    })
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
