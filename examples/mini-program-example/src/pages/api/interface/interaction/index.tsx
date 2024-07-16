import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import apiImage from '@/assets/tab/api.png'
import './index.scss'

/**
 * 界面-交互
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'showToast',
        inputData: {
          title: 'showToast',
          duration: 10000,
          icon: 'success',
          image: apiImage,
          mask: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showToast')
          Taro.showToast({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'hideToast',
        inputData: {
          noConflict: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('hideToast')
          Taro.hideToast({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'showLoading',
        inputData: {
          title: '加载中',
          mask: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showLoading')
          Taro.showLoading({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'hideLoading',
        inputData: {
          noConflict: false,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('hideLoading')
          Taro.hideLoading({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'showModal',
        inputData: {
          title: '提示',
          content: '这是一个模态弹窗',
          showCancel: true,
          cancelColor: '#f00',
          cancelText: '取消',
          confirmColor: '#0f0',
          confirmText: '确认',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showModal')
          Taro.showModal({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'showActionSheet',
        inputData: {
          alertText: '警示文案',
          itemList: ['ActionA', 'ActionB', 'ActionC'],
          itemColor: '#0f0',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('showActionSheet')
          Taro.showActionSheet({
            ...data,
            success: (res) => {
              Taro.showToast({
                title: `选择项目：${res.tapIndex}`,
                icon: 'success',
              })
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              Taro.showToast({
                title: `失败：${res.errMsg}`,
                icon: 'error',
              })
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'enableAlertBeforeUnload',
        inputData: {
          message: '空实现',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.enableAlertBeforeUnload')
          Taro.enableAlertBeforeUnload({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'disableAlertBeforeUnload',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.disableAlertBeforeUnload')
          Taro.disableAlertBeforeUnload({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
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
